import "ag-grid-enterprise"
import "@fso/bootstrap/dist/bootstrap.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import Vue from "vue"
import { LicenseManager } from "ag-grid-enterprise"

import "../stories/mocks/api"

LicenseManager.setLicenseKey(
  "University_of_Arizona_Financial_Services_Office_MultiApp_3Devs21_September_2019__MTU2OTAyMDQwMDAwMA==c4380c2e713cbc8bf36a69bb01479b60",
)

Vue.prototype.$api = {
  get(path, options) {
    if (path.includes("autocomplete/")) {
      return [null, ["Bork Mackleboi", "JSON Leone", "Cats"]]
    } else {
      return [{ response: { data: "Not found" }, statusCode: 404 }, null]
    }
  },
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
