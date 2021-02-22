import "ag-grid-enterprise"
import "@uarizona-fnsv/bootstrap/dist/bootstrap.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import { LicenseManager } from "ag-grid-enterprise"
import "cypress-storybook/vue"

import "./cypress-storybook-vue"
import "../src/styles/grid.css"
import "../stories/mocks/api"

LicenseManager.setLicenseKey(
  "University_of_Arizona_Financial_Services_Office_MultiApp_3Devs21_September_2019__MTU2OTAyMDQwMDAwMA==c4380c2e713cbc8bf36a69bb01479b60",
)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
