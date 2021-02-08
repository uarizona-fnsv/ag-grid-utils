import axios, { CancelToken } from "axios"

import api from "@/utils/api"
import store from "@/store"

/**
 * @typedef {Object} Filter
 * @property {string|number} raw - Value entered by the user
 * @property {string|number} value - Value transformed for filtering
 * @property {string} key - The Annotation/Transaction field to filter on
 * @property {string} lookup = The Django lookup to filter by
 */

/**
 * Server-side datasource for agGrid.
 * Handles construction of query string for limit, offset, sorting, and filtering.
 * @param {Object} gridApi
 * @param {string} path - 
 */
const createDatasource = (gridApi, path, options) => ({
  defaultParams: options.defaultParams || {},
  params: {},
  filters: {},
  totalRows: null,
  cancelToken: CancelToken.source(),

  /** Cancels any ongoing requests. */
  cancel() {
    this.cancelToken.cancel()
  },

  async getRows({ request, failCallback, successCallback }) {
    this.params = this.getParams(request)
    const config = {
      params: this.params,
      cancelToken: this.cancelToken.token,
    }
    const [err, res] = await api.get("transactions/", config)

    if (axios.isCancel(err)) {
      return
    } else if (err) {
      options.onError()
      gridApi.showNoRowsOverlay()
      failCallback()
    } else if (res.data.count < 1) {
      gridApi.showNoRowsOverlay()
      failCallback()
    } else {
      gridApi.hideOverlay()
      this.totalRows = res.data.count
      successCallback(res.data.results, res.data.count)
    }
  },

  getParams(request) {
    const { startRow, endRow, sortModel } = request
    const params = {
      ...this.defaultParams,
      ...this.getFilterParams(),
      offset: startRow,
      limit: endRow - startRow,
      search: store.state.search,
    }
    const ordering = this.parseSortModel(sortModel)
    if (ordering) params.ordering = ordering
    return params
  },

  getFilterParams() {
    const params = {}
    Object.values(this.filters).forEach(f => {
      params[f.key + f.lookup] = f.value
    })
    return params
  },

  /** Transforms agGrid's sort model into a comma-separated string. */
  parseSortModel(sortModel) {
    return sortModel
      .map(({ colId, sort }) => {
        const col = store.state.columnApi.getColumn(colId)
        let field = colId.replace(/\./, "__")
        const relatedField = col.colDef.__metadata__?.sortField
        if (relatedField) field += `__${relatedField}`
        return (sort === "desc" ? "-" : "") + field
      })
      .join(",")
  },

  /** Takes a field or dotted path and returns the related filter. */
  getFilter(field) {
    const key = field.replace(".", "__")
    return this.filters[key]
  },

  /**
   * Update or remove filter and purge cache.
   * @param {Object} colDef - an agGrid column definition.
   * @param {string} rawValue - raw value for the filter.
   */
  updateFilter(colDef, rawValue) {
    const filter = this.createFilter(colDef, rawValue)
    if (filter.raw && filter.raw.length) {
      this.filters[filter.key] = filter
    } else {
      delete this.filters[filter.key]
    }
    store.state.gridApi.purgeServerSideCache()
  },

  /**
   * Accepts a column definition and its raw filter value, and
   * returns an object dercsribing a filter for the Datasource.
   *
   * Does any value transformation necessary.
   *
   * @param {Object} colDef - an agGrid column definition.
   * @param {string} rawValue - raw value for the filter.
   * @returns {Filter} Filter for datasource
   */
  createFilter(colDef, rawValue) {
    const key = colDef.field.replace(".", "__") // Transfrom dot notation to Django lookup
    let lookup = ""
    let value = rawValue

    if (rawValue === "(Blanks)" || rawValue.includes("(Blanks)")) {
      lookup = "__isnull"
      value = true
    } else {
      switch (colDef.__metadata__.type) {
        case "datetime":
          value += "T00:00:00"
          break
        case "string":
          if (Array.isArray(value)) {
            lookup = value.length > 1 ? "__in" : "__icontains"
            value = value.map(x => x.trim()).join()
          } else {
            value = value.trim()
            lookup = "__icontains"
          }
          break
        case "status_codes":
        case "type_codes":
          lookup = "__code__in"
          value = value.join()
          break
        case "sample":
          lookup = "__id"
          break
        default:
          break
      }
    }

    return {
      raw: rawValue,
      value,
      key,
      lookup,
    }
  },
})

export default createDatasource
