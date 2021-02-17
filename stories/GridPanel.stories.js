import Vue from "vue"
import { AgGridVue } from "ag-grid-vue"
import axios from "axios"

import Datasource from "../src/Datasource"
import GridPanel from "../src/components/GridPanel.vue"
import columnDefs from "./mocks/olympicColumnDefs"

export default {
  title: "Components/GridPanel",
  component: GridPanel,
}

export const CustomPanel = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { GridPanel },
  template: `
      <GridPanel :grid-params="params">
        <template v-slot:title>
          <h5 class="m-0">Custom</h5>
        </template>
        <template v-slot:extra-controls>
          <button class="btn btn-sm btn-primary mr-1">Reset</button>
        </template>
        <template>
          <p class="p-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </template>
      </GridPanel>`,
})

const GridPanelExample = Vue.extend(CustomPanel([], { argTypes: {} }))

export const InGrid = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AgGridVue, GridPanelExample },
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
        frameworkComponents: { GridPanelExample: "GridPanelExample" },
        sideBar: {
          toolPanels: [
            {
              id: "customPanel",
              labelDefault: "Custom Panel",
              labelKey: "customPanel",
              iconKey: "filter",
              toolPanelFramework: "GridPanelExample",
            },
          ],
          defaultToolPanel: "customPanel",
        },
        columnDefs,
      },
    }
  },
})
