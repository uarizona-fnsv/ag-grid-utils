<template>
  <AgGridVue
    :style="{ width: 'calc(100vw - 30px)', height: 'calc(100vh - 3.5rem)' }"
    class="ag-theme-balham"
    :grid-options="gridOptions"
    :row-data="rowData"
    :debug="false"
  />
</template>

<script>
import { AgGridVue } from "ag-grid-vue"
import "ag-grid-enterprise"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"

// import Panel from "../../components/Panel"
import NoRowsOverlay from "../../components/NoRowsOverlay"
import ColumnFilter from "../../components/ColumnFilter"
// import ColumnFilterSet from "../../components/ColumnFilterSet"

export default {
  name: "Grid",
  components: {
    AgGridVue,
    /* eslint-disable vue/no-unused-components */
    NoRowsOverlay,
    // Panel,
    ColumnFilter,
    // ColumnFilterSet,
    /* eslint-enable vue/no-unused-components */
  },
  props: {
    gridOptions: { type: Object, required: true },
    rowData: { type: Array, required: true },
  },
}
</script>
