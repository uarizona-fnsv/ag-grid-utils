context("SearchPanel", () => {
  beforeEach(() => {
    cy.visitStorybook()
    cy.loadStory("Panels/SearchPanel", "Primary")
  })

  it("quick filters the grid", () => {
    cy.grab("search-quick")
      .as("quick")
      .type("ryan{enter}")
      .should("have.value", "ryan")

    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .as("rows")
    cy.get("@rows").should("contain", "ryan")

    cy.grab("search-quick-clear").click()
    cy.get("@quick").should("have.value", "")
    cy.grab("search-go").click()
    cy.get("@rows").should("not.contain", "ryan")
  })

  it("syncs filters through the datasource", () => {
    cy.get("#athlete-panel")
      .type("ryan{enter}")
      .should("have.value", "ryan")
    cy.grab("panel-close").click()

    cy.get(".ag-header-cell[col-id=athlete] .ag-header-icon")
      .first()
      .as("column-menu")
      .click()

    cy.grab("cfs-selected")
      .first()
      .should("contain", "ryan")
      .click()

    cy.grab("cfs-unselected")
      .first()
      .click()
      .next()
      .click()

    cy.get(".ag-side-button").click()
    cy.get("#athlete-panel").should("have.value", "Aleksey Nemov;Alicia Coutts")
  })
})
