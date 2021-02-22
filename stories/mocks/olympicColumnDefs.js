export default [
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
    columnGroupShow: "open",
    __metadata__: { type: "date" },
  },
  {
    headerName: "Sport",
    field: "sport",
    width: 110,
    __metadata__: { type: "string" },
  },
  {
    headerName: "Medals",
    children: [
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
]
