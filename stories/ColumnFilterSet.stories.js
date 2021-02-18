import { AgGridVue } from "ag-grid-vue"
import axios from "axios"

import Datasource from "../src/Datasource"
import ColumnFilterSet from "../src/components/ColumnFilterSet.vue"
import columnDefs from "./mocks/olympicColumnDefs"

export default {
  title: "Filters/ColumnFilterSet",
  component: ColumnFilterSet,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AgGridVue, ColumnFilterSet },
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
          filter: "ColumnFilterSet",
          menuTabs: ["filterMenuTab"],
          filterParams: { getOptions: this.getOptions },
        },
        frameworkComponents: { ColumnFilterSet: "ColumnFilterSet" },
        columnDefs,
      },
    }
  },
})

export const Primary = Template.bind({})
Primary.storyName = "ColumnFilterSet"
