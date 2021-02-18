import { AgGridVue } from "ag-grid-vue"
import axios from "axios"

import Datasource from "../src/Datasource"
import ColumnFilter from "../src/components/ColumnFilter.vue"
import columnDefs from "./mocks/olympicColumnDefs"

export default {
  title: "Filters/ColumnFilter",
  component: ColumnFilter,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AgGridVue, ColumnFilter },
  template: `
    <AgGridVue
      class="ag-theme-balham"
      :grid-options="gridOptions"
      @grid-ready="onReady"
      style="width: calc(100vw - 30px); height: calc(100vh - 3.5rem);"
    />`,
  methods: {
    onReady() {
      const gridApi = this.gridOptions.api
      const ds = new Datasource({ gridApi, path: "/olympic/" })
      gridApi.setServerSideDatasource(ds)
    },
    getOptions: async (field, value) => {
      const res = await axios.get("/autocomplete/", {
        params: { field, value, limit: 25 },
      })
      return res.data
    },
  },
  data() {
    return {
      gridOptions: {
        rowModelType: "serverSide",
        defaultColDef: {
          filter: "ColumnFilter",
          menuTabs: ["filterMenuTab"],
          filterParams: { getOptions: this.getOptions },
        },
        frameworkComponents: { ColumnFilter: "ColumnFilter" },
        columnDefs,
      },
    }
  },
})

export const Primary = Template.bind({})
Primary.storyName = "ColumnFilter"
