import { cloneDeep } from "lodash"
import formatters from "../../utils/formatters"

/** Return value for an annotated transaction field. Original data takes precedence over annotations. */
const annotatedValueGetter = ({ data, colDef }) => {
  // dummy transaction for non-transactional annotation
  if (!data.edoc_number) return data?.annotation?.[colDef.field]
  // prefer original data
  return data[colDef.field] || data?.annotation?.[colDef.field]
}

/** ag-Grid column definitions which also serve as a schema for the data coming from the backend.
 * The __metadata__ field can be safely used to store arbitrary data.
 */
export const columns = {
  pcholder_name: {
    headerName: "Cardholder Last, First",
    field: "pcholder_name",
    __metadata__: {
      type: "string",
      editable: true,
      edsEndpoint: "search/",
    },
    valueGetter: annotatedValueGetter,
  },
  pcholder_netid: {
    headerName: "Cardholder NetID",
    field: "pcholder_netid",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      pattern: "[a-z0-9]{3,16}",
      title: "Valid netid",
      editable: true,
      edsEndpoint: "person/",
    },
    valueGetter: annotatedValueGetter,
  },
  pcholder_emplid: {
    headerName: "Cardholder EmplID",
    field: "pcholder_emplid",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      pattern: "[0-9]{8}",
      title: "8 digit numeric EmplId",
      editable: true,
      edsEndpoint: "person/",
    },
    valueGetter: annotatedValueGetter,
    hide: true,
  },
  responsible_pcholder_name: {
    headerName: "Responsible Cardholder Name",
    field: "responsible_pcholder_name",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      editable: true,
      edsEndpoint: "search/",
    },
    valueGetter: annotatedValueGetter,
  },
  responsible_user_name: {
    headerName: "Responsible User Last, First",
    field: "annotation.responsible_user_name",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      editable: true,
      edsEndpoint: "search/",
    },
  },
  responsible_user_emplid: {
    headerName: "Responsible User EmplID",
    field: "annotation.responsible_user_emplid",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      pattern: "[0-9]{8}",
      title: "8 digit numeric EmplId",
      editable: true,
      edsEndpoint: "person/",
    },
  },
  transaction_post_date: {
    headerName: "Transaction Post Date",
    field: "transaction_post_date",
    __metadata__: { type: "datetime" },
    type: "date",
  },
  transaction_date: {
    headerName: "Transaction Date",
    field: "transaction_date",
    columnGroupShow: "open",
    __metadata__: { type: "datetime" },
    hide: true,
    type: "date",
  },
  statement_period: {
    headerName: "Statement Period",
    field: "statement_period",
    columnGroupShow: "open",
    valueFormatter: ({ value }) => formatters.statementPeriod(value),
    sortable: false,
    type: "date",
    filter: "ColumnFilter",
    __metadata__: { type: "datetime" },
  },
  doc_create_date: {
    headerName: "Doc. Create Date",
    field: "doc_create_date",
    columnGroupShow: "open",
    __metadata__: { type: "date" },
    type: "date",
  },
  suspension_date: {
    headerName: "Suspension Date",
    field: "annotation.suspension_date",
    columnGroupShow: "open",
    __metadata__: { type: "date", editable: true },
    type: "date",
  },
  suspension_lifted_date: {
    headerName: "Suspension Lifted Date",
    field: "annotation.suspension_lifted_date",
    columnGroupShow: "open",
    __metadata__: { type: "date", editable: true },
    type: "date",
  },
  request_date: {
    headerName: "Request Date",
    field: "annotation.request_date",
    columnGroupShow: "open",
    __metadata__: { type: "date", editable: true },
    type: "date",
  },
  received_date: {
    headerName: "Received Date",
    field: "annotation.received_date",
    columnGroupShow: "open",
    __metadata__: { type: "date", editable: true },
    type: "date",
  },
  notification_date: {
    headerName: "Notification Date",
    field: "annotation.notification_date",
    columnGroupShow: "open",
    __metadata__: { type: "date", editable: true },
    type: "date",
  },
  pcard: {
    headerName: "PCARD (Last Four)",
    field: "pcard",
    __metadata__: {
      type: "string",
      editable: true,
      pattern: "[0-9]{4}",
      title: "Last four digits of PCARD",
    },
    valueGetter: annotatedValueGetter,
    type: "number",
  },
  transaction_id: {
    headerName: "Transaction ID",
    field: "transaction_id",
    columnGroupShow: "open",

    __metadata__: {
      type: "string",
      pattern: "[0-9]{1,13}",
      title: "Max 13 digit Transaction ID",
    },
    type: "number",
  },
  edoc_number: {
    headerName: "Reference (Edoc)",
    field: "edoc_number",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      editable: true,
      pattern: "[0-9]{1,8}",
      title: "Max 8 digit Edoc Number",
    },
    type: "number",
  },
  transaction_amount: {
    headerName: "Transaction Amount",
    field: "transaction_amount",
    columnGroupShow: "open",
    __metadata__: { type: "dollar" },
    type: "number",
  },
  base_dept_name: {
    headerName: "PC Org. Name",
    field: "base_dept_name",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
  },
  dept_name: {
    headerName: "PC Unofficial Org. Name",
    field: "dept_name",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
  },
  base_dept_number: {
    headerName: "PC Org. #",
    field: "base_dept_number",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      editable: true,
      pattern: "[0-9]{4}",
      title: "4 digit PC Org. Number",
    },
    valueGetter: annotatedValueGetter,
    type: "number",
  },
  dept_number: {
    headerName: "PC Unofficial Org. #",
    field: "dept_number",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
      editable: true,
      pattern: "[a-zA-Z0-9]{1,4}",
      title: "4 (max) alphnumeric PC Unofficial Org. Number",
    },
    valueGetter: annotatedValueGetter,
    type: "number",
  },
  account_org_numbers: {
    headerName: "AL Org. #",
    field: "account_org_numbers",
    columnGroupShow: "open",
    __metadata__: {
      type: "string",
    },
    type: "number",
  },
  account_number: {
    headerName: "PC Account #",
    field: "account_number",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
    type: "number",
  },
  transaction_line_account_numbers: {
    headerName: "AL Account #",
    field: "transaction_line_account_numbers",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
    type: "number",
  },
  object_codes: {
    headerName: "Object Codes",
    field: "object_codes",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
    type: "number",
    valueFormatter: ({ value }) => value?.replaceAll(",", ", "),
  },
  original_vendor_name: {
    headerName: "Original Vendor Name",
    field: "original_vendor_name",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
  },
  vendor_name: {
    headerName: "Vendor Name",
    field: "vendor_name",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
  },
  vendor_id: {
    headerName: "Vendor ID",
    field: "vendor_id",
    columnGroupShow: "open",
    __metadata__: { type: "string" },
    type: "number",
    hide: true,
  },
  status_codes: {
    headerName: "Status",
    field: "annotation.status_codes",
    filter: "ColumnFilterCodes",
    __metadata__: {
      type: "status_codes",
      sortField: "code",
    },
    valueFormatter: ({ value }) => value?.join(", "),
  },
  type_codes: {
    headerName: "Type",
    field: "annotation.type_codes",
    filter: "ColumnFilterCodes",
    __metadata__: {
      type: "type_codes",
      sortField: "code",
    },
    valueFormatter: ({ value }) => value?.join(", "),
  },
  comments: {
    headerName: "Comments",
    field: "annotation.comments",
    filter: false,
    sortable: false,
    __metadata__: { type: "comments" },
  },
  sample: {
    field: "annotation.sample",
    headerName: "Sample",
    hide: true,
    __metadata__: { type: "sample", sortField: "id" },
  },
  department_communication: {
    headerName: "Department Communication",
    field: "annotation.department_communication",
    __metadata__: { type: "department_communication", editable: true },
  },
  updated_date: {
    headerName: "Date Updated",
    field: "annotation.updated_date",
    type: "datetime",
    __metadata__: { type: "datetime" },
    hide: true,
  },
  updated_by: {
    headerName: "Updated By",
    field: "annotation.updated_by",
    __metadata__: { type: "string", sortField: "username" },
    hide: true,
  },
  created_date: {
    headerName: "Date Created",
    field: "annotation.created_date",
    type: "datetime",
    __metadata__: { type: "datetime" },
    hide: true,
  },
  created_by: {
    headerName: "Created By",
    field: "annotation.created_by",
    __metadata__: { type: "string", sortField: "username" },
    hide: true,
  },
}

export const getColumnDefs = columns => {
  return [
    {
      headerName: "Cardholder",
      openByDefault: true,
      children: [
        columns.pcholder_name,
        columns.pcholder_netid,
        columns.pcholder_emplid,
        columns.responsible_pcholder_name,
        columns.responsible_user_name,
        columns.responsible_user_emplid,
      ],
    },
    {
      headerName: "Dates",
      openByDefault: true,
      children: [
        columns.transaction_post_date,
        columns.transaction_date,
        columns.statement_period,
        columns.doc_create_date,
        columns.suspension_date,
        columns.suspension_lifted_date,
        columns.request_date,
        columns.received_date,
        columns.notification_date,
      ],
    },
    {
      headerName: "Transaction",
      openByDefault: true,
      children: [
        columns.pcard,
        columns.transaction_id,
        columns.edoc_number,
        columns.transaction_amount,
        columns.base_dept_name,
        columns.dept_name,
        columns.base_dept_number,
        columns.dept_number,
        columns.account_org_numbers,
        columns.account_number,
        columns.transaction_line_account_numbers,
        columns.object_codes,
        columns.original_vendor_name,
        columns.vendor_name,
        columns.vendor_id,
      ],
    },
    {
      headerName: "Codes",
      openByDefault: true,
      children: [columns.status_codes, columns.type_codes],
    },
    {
      headerName: "Comments",
      openByDefault: true,
      children: [columns.comments],
      __metadata__: { hideInSearch: true },
    },
    {
      headerName: "Sample",
      openByDefault: true,
      children: [columns.sample],
    },
    {
      headerName: "Department Communication",
      openByDefault: true,
      children: [columns.department_communication],
    },
    {
      headerName: "Other",
      openByDefault: true,
      children: [
        columns.updated_date,
        columns.updated_by,
        columns.created_date,
        columns.created_by,
      ],
      __metadata__: { hideInSearch: true },
    },
  ]
}

const sideBar = {
  defaultToolPanel: null,
  toolPanels: [
    {
      id: "modify",
      labelDefault: "Modify",
      labelKey: "modify",
      iconKey: "columns",
      toolPanelFramework: "PanelModify",
    },
    {
      id: "search",
      labelDefault: "Search",
      labelKey: "search",
      iconKey: "filter",
      toolPanelFramework: "PanelSearch",
    },
    {
      id: "columns",
      labelDefault: "Columns",
      labelKey: "columns",
      iconKey: "columns",
      toolPanel: "agColumnsToolPanel",
      toolPanelParams: {
        suppressPivots: true,
        suppressPivotMode: true,
        suppressRowGroups: true,
        suppressValues: true,
      },
    },
  ],
}

const getMainMenuItems = ({ api }) => {
  return [
    "pinSubMenu",
    "separator",
    "autoSizeThis",
    "autoSizeAll",
    {
      name: "Fit All Columns",
      action: () => api.sizeColumnsToFit(),
    },
    "separator",
    "resetColumns",
  ]
}

const defaultGridOptions = {
  animateRows: true,
  cacheBlockSize: 45,
  enableRangeSelection: true,
  rowModelType: "serverSide",
  suppressCopyRowsToClipboard: true,
  rowSelection: "multiple",
  rowDeselection: true,
  defaultColDef: {
    sortable: true,
    resizable: true,
    filter: "ColumnFilterSet",
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
    cellStyle: { textAlign: "left" },
  },
  columnTypes: {
    number: {
      cellStyle: { textAlign: "right" },
    },
    date: {
      valueFormatter: ({ value }) => formatters.date(value),
      filter: "ColumnFilter",
    },
    datetime: {
      valueFormatter: ({ value }) => formatters.datetime(value),
    },
  },
  sideBar,
  getMainMenuItems,
  noRowsOverlayComponent: "noRowsOverlayComponent",
  frameworkComponents: {
    PanelModify: "PanelModify",
    PanelSearch: "PanelSearch",
    ColumnFilter: "ColumnFilter",
    ColumnFilterCodes: "ColumnFilterCodes",
    ColumnFilterSet: "ColumnFilterSet",
    noRowsOverlayComponent: "NoRowsOverlay",
  },
}

/**
 * Create a new gridOptions object.
 *
 * The id is used to persist column state in localStorage.
 * Columns should be indicated by their `field` property (exclude `annotation.`)
 *
 * @param {string} id - Unique identifier for the grid instance.
 * @param {Object} [options] - gridOptions configuration.
 * @param {string} [options.sortBy] - The column for the default sort.
 * @param {('asc'|'desc')} [options.sortOrder='desc'] - The order of the default sorting.
 * @param {string[]} [options.show] - Columns to show.
 * @param {string[]} [options.hide] - Columns to hide.
 */
export default function getGridOptions(id, options) {
  const defaultOptions = { sortBy: null, sortOrder: "desc", show: [], hide: [] }
  const opts = { ...defaultOptions, ...options }
  const cols = cloneDeep(columns)
  opts.show.forEach(id => (cols[id].hide = false))
  opts.hide.forEach(id => (cols[id].hide = true))
  if (cols[opts.sortBy]) {
    cols[opts.sortBy].sort = opts.sortOrder
  }
  const columnDefs = getColumnDefs(cols)
  return {
    ...cloneDeep(defaultGridOptions),
    columnDefs,
    __metadata__: { id },
  }
}
