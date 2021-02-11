import axios from "axios"

/**
 * @typedef {Object} Filter
 * @property {string[]} raw - Value entered by the user
 * @property {string} value - Value transformed for filtering
 * @property {string} key - The Annotation/Transaction field to filter on
 * @property {string} lookup = The Django lookup to filter by
 */

/**
 * Callback for responding to an error when fetching rows.
 * @callback errorCallback
 * @param {Error} error
 * @param {Object} gridApi
 */

/**
 * Callback for accessing fetched rows before they are passed to the grid.
 * @callback rowsCallback
 * @param {Error} rows - Rows fetched from api
 * @param {Object} gridApi
 * @returns {Object[]} Rows to add to grid
 */

/**
 * @property {Object} defaultParams: options.defaultParams || {},
 * @property {Object} params: {},
 * @property {Object} filters: {},
 * @property {number} totalRows: null,
 * @property {Object} cancelToken: CancelToken.source(),
 */

/**
 * Server-side datasource for agGrid.
 * Handles construction of query string for limit, offset, sorting, and filtering.
 */
class Datasource {
  options
  client
  /** @type {{ [key: string]: string }} */
  defaultParams = {}
  /** @type {{ [key: string]: string }} */
  params = {}
  /** @type {{ [lookup: string]: Filter }} */
  filters = {}
  /**
   * Total number of rows matching the current params.
   * @type {number}
   */
  totalRows = null
  cancelToken = axios.CancelToken.source()

  /**
   * @constructor
   * @param {Object} options
   * @param {import('ag-grid-community').GridApi} options.gridApi
   * @param {string} options.path - Path from which to request options
   * @param {Object} [options.axios] - The axios instance to use for queries
   */
  constructor(options) {
    this.gridApi = options.gridApi
    this.columnApi = this.gridApi.columnController.columnApi
    this.options = options
    this.client = options.axios || axios
  }

  /** Cancels any ongoing requests. */
  cancel() {
    this.cancelToken.cancel()
  }

  /**
   * @param {import('ag-grid-community').IServerSideGetRowsParams} params
   */
  async getRows({ request, failCallback, successCallback }) {
    this.params = this.getParams(request)
    const config = {
      params: this.params,
      cancelToken: this.cancelToken.token,
    }
    let response
    try {
      response = await this.client.get(this.options.path, config)
    } catch (err) {
      if (axios.isCancel(err)) return
      this.gridApi.showNoRowsOverlay()
      failCallback()
    }

    if (response.data.count < 1) {
      this.gridApi.showNoRowsOverlay()
      failCallback()
    } else {
      this.gridApi.hideOverlay()
      this.totalRows = response.data.count
      successCallback(response.data.results, response.data.count)
    }
  }

  /**
   * @param {import('ag-grid-community').IServerSideGetRowsRequest} request
   * @returns {Object} querystring parameters
   * @private
   */
  getParams(request) {
    const { startRow, endRow, sortModel } = request
    const params = {
      ...this.defaultParams,
      ...this.getFilterParams(),
      offset: startRow,
      limit: endRow - startRow,
      // search: store.state.search,es
    }
    const ordering = this.parseSortModel(sortModel)
    // @ts-ignore
    if (ordering) params.ordering = ordering
    return params
  }

  /**
   * Transforms filter object into querystring {key: value} object.
   * @private
   * @returns {Object}
   */
  getFilterParams() {
    const params = {}
    Object.values(this.filters).forEach(f => {
      params[f.key + f.lookup] = f.value
    })
    return params
  }

  /**
   * Transforms agGrid's sort model into a comma-separated string.
   * @param {import('ag-grid-community').IServerSideGetRowsRequest['sortModel']} sortModel
   * @private
   */
  parseSortModel(sortModel) {
    return sortModel
      .map(({ colId, sort }) => {
        const col = this.columnApi.getColumn(colId)
        let field = colId.replace(/\./, "__")
        const relatedField = col.colDef.__metadata__?.sortField
        if (relatedField) field += `__${relatedField}`
        return (sort === "desc" ? "-" : "") + field
      })
      .join(",")
  }

  /**
   * Takes a field or dotted path and returns the related filter.
   * @param {string} field
   * @returns {Filter}
   */
  getFilter(field) {
    const key = field.replace(".", "__")
    return this.filters[key]
  }

  /**
   * Update or remove filter and purge cache.
   * @param {Object} colDef - an agGrid column definition.
   * @param {string} rawValue - raw value for the filter.
   */
  updateFilter(colDef, rawValue) {
    const filter = this.createFilter(colDef, rawValue)
    const { raw } = filter
    if ((typeof raw === "string" && raw.length) || raw) {
      this.filters[filter.key] = filter
    } else {
      delete this.filters[filter.key]
    }
    this.gridApi.purgeServerSideCache()
  }

  /**
   * Accepts a column definition and its raw filter value, and
   * returns an object dercsribing a filter for the Datasource.
   *
   * Does any value transformation necessary.
   *
   * @param {Object} colDef - an agGrid column definition.
   * @param {string[]} rawValue - raw value for the filter.
   * @returns {Filter} Filter for datasource
   */
  createFilter(colDef, rawValue) {
    const key = colDef.field.replace(".", "__") // Transfrom dot notation to Django lookup
    let lookup = ""
    /** @type any */
    let value = rawValue

    if (rawValue.includes("(Blanks)")) {
      lookup = "__isnull"
      value = true
    } else {
      lookup = value.length > 1 ? "__in" : "__icontains"
      if (colDef.__metadata__.type === "datetime") {
        value = value.map(v => v + "T00:00:00")
      }
      value = value.join()
    }

    return {
      raw: rawValue,
      value,
      key,
      lookup,
    }
  }
}

export default Datasource
