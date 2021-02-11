import { AgGridVue } from "ag-grid-vue"
import axios from "axios"

import Datasource from "../src/utils/datasource"
import ColumnFilterSet from "../src/components/ColumnFilterSet"

export default {
  title: "Components/ColumnFilterSet",
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
        params: { field, value },
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
        columnDefs: [
          {
            headerName: "Athlete",
            field: "athlete",
            width: 150,
            __metadata__: { type: "string" },
          },
          {
            headerName: "Age",
            field: "age",
            width: 90,
            __metadata__: { type: "number" },
          },
          {
            headerName: "Country",
            field: "country",
            width: 120,
            __metadata__: { type: "string" },
          },
          {
            headerName: "Year",
            field: "year",
            width: 90,
            __metadata__: { type: "number" },
          },
          {
            headerName: "Date",
            field: "date",
            width: 145,
            __metadata__: { type: "date" },
          },
          {
            headerName: "Sport",
            field: "sport",
            width: 110,
            __metadata__: { type: "string" },
          },
          {
            headerName: "Gold",
            field: "gold",
            width: 100,
            __metadata__: { type: "number" },
          },
          {
            headerName: "Silver",
            field: "silver",
            width: 100,
            __metadata__: { type: "number" },
          },
          {
            headerName: "Bronze",
            field: "bronze",
            width: 100,
            __metadata__: { type: "number" },
          },
          {
            headerName: "Total",
            field: "total",
            width: 100,
            __metadata__: { type: "number" },
          },
        ],
      },
    }
  },
})

export const grid = Template.bind({})
