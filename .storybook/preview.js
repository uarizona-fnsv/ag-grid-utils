import "ag-grid-enterprise"
import "@uarizona-fnsv/bootstrap/dist/bootstrap.css"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import "./fixDocs.css"
import { LicenseManager } from "ag-grid-enterprise"

import "./cypress-storybook-vue"
import "../src/styles/grid.css"
import "../stories/mocks/api"

LicenseManager.setLicenseKey(
  "CompanyName=University of Arizona Financial Services Office,LicensedGroup=Financial Services-IT,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-015281,ExpiryDate=12_August_2022_[v2]_MTY2MDI1ODgwMDAwMA==116e7222abf2813c45918e7c8b238dd9",
)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  options: {
    storySort: {
      order: [
        "Docs",
        ["Introduction"],
        "JavaScript",
        "Filters",
        "Panels",
        "Support",
      ],
    },
  },
}
