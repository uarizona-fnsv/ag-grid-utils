import { AgGridVue } from "ag-grid-vue"
import axios from "axios"

import Datasource from "../src/utils/datasource"
import SearchPanel from "../src/components/SearchPanel.vue"
import columnDefs from "./mocks/olympicColumnDefs"

export default {
  title: "Components/SearchPanel",
  component: SearchPanel,
}

// TODO controls, title

export const Primary = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AgGridVue, SearchPanel },
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
        frameworkComponents: { SearchPanel: "SearchPanel" },
        sideBar: {
          toolPanels: [
            {
              id: "searchPanel",
              labelDefault: "Search Panel",
              labelKey: "searchPanel",
              iconKey: "filter",
              toolPanelFramework: "SearchPanel",
            },
          ],
          defaultToolPanel: "searchPanel",
        },
        columnDefs,
      },
    }
  },
})
Primary.storyName = "SearchPanel"
