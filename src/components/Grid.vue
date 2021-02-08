<template>
  <AgGridVue
    :style="{ width: 'calc(100vw - 70px)', height: 'calc(100vh - 3.5rem)' }"
    class="ag-theme-balham"
    :grid-options="gridOptions"
    :debug="false"
    @grid-ready="onGridReady"
  />
</template>

<script>
import { mapActions } from "vuex"
import { AgGridVue } from "ag-grid-vue"
import { debounce } from "lodash"
import "ag-grid-enterprise"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"

import createDatasource from "./datasource.js"
import NoRowsOverlay from "./NoRowsOverlay"
import PanelModify from "../PanelModify"
import PanelSearch from "../PanelSearch"
import PanelLink from "../PanelLink"
import PanelUnlink from "../PanelUnlink"
import PanelRelated from "../PanelRelated"
import ColumnFilter from "../ColumnFilter"
import ColumnFilterCodes from "../ColumnFilterCodes"
import ColumnFilterSet from "../ColumnFilterSet"

export default {
  name: "Grid",
  components: {
    AgGridVue,
    /* eslint-disable vue/no-unused-components */
    NoRowsOverlay,
    PanelModify,
    PanelSearch,
    PanelLink,
    PanelUnlink,
    PanelRelated,
    ColumnFilter,
    ColumnFilterCodes,
    ColumnFilterSet,
    /* eslint-enable vue/no-unused-components */
  },
  props: {
    defaultParams: { type: Object, default: () => {} },
    gridOptions: { type: Object, required: true },
  },
  methods: {
    ...mapActions(["gridInit"]),
    onGridReady() {
      const datasource = createDatasource({ defaultParams: this.defaultParams })
      this.gridOptions.api.setServerSideDatasource(datasource)
      this.gridInit({
        gridApi: this.gridOptions.api,
        columnApi: this.gridOptions.columnApi,
      })
      this.setupColumnState()
      this.$emit("grid-ready")
    },
    saveColumnState() {
      const { id } = this.gridOptions.__metadata__
      const columnState = this.gridOptions.columnApi.getColumnState()
      localStorage.setItem(`${id}ColumnState`, JSON.stringify(columnState))
    },
    /** Load column state from localstorage and add listeners to save on change. */
    setupColumnState() {
      const { api, columnApi, __metadata__ } = this.gridOptions
      api.addEventListener("displayedColumnsChanged", this.saveColumnState)
      api.addEventListener(
        "columnResized",
        debounce(this.saveColumnState, 1000),
      )
      const columnState = localStorage.getItem(`${__metadata__.id}ColumnState`)
      if (columnState) {
        columnApi.setColumnState(JSON.parse(columnState))
      }
    },
  },
}
</script>
