import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { AgGridVue } from "ag-grid-vue"

import Datasource from "../utils/datasource"
import ColumnFilter from "../components/ColumnFilter"
import data from "./grid/olympicWinners.json"

export default {
  title: "Components/ColumnFilter",
  component: ColumnFilter,
}

const mock = new MockAdapter(axios)
mock.onGet(/.*/).reply(config => {
  const { limit, offset, ...filterParams } = config.params
  const filters = Object.entries(filterParams)
  if (filters.length) console.log("Request filters:", filterParams)
  const filterFn = row => {
    return filters
      .map(([key, value]) => {
        const [field, lookup] = key.split("__")
        let target = row[field]
        if (typeof target === "string") {
          target = target.toLowerCase()
          value = value.toLowerCase()
        }
        if (lookup === "icontains") {
          return target.includes(value)
        } else if (!lookup) {
          return target == value
        }
      })
      .every(x => x)
  }
  let results = data.filter(filterFn).slice(offset, offset + limit)
  return [200, { results, count: results.length }]
})

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { AgGridVue, ColumnFilter },
  template: `<AgGridVue
      class="ag-theme-balham"
      :grid-options="gridOptions"
      @grid-ready="onReady"
      style="width: calc(100vw - 30px); height: calc(100vh - 3.5rem);"
      />`,
  methods: {
    onReady() {
      const gridApi = this.gridOptions.api
      const ds = new Datasource({ gridApi, path: "/" })
      gridApi.setServerSideDatasource(ds)
    },
  },
  data() {
    return {
      gridOptions: {
        rowModelType: "serverSide",
        defaultColDef: { filter: "ColumnFilter" },
        frameworkComponents: { ColumnFilter: "ColumnFilter" },
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
