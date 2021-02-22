const basePath = "/iframe.html?id=filters-columnfilter--"

context("Primary", () => {
  beforeEach(() => {
    cy.visit(basePath + "primary")
  })

  it("filters the grid", () => {
    cy.get(".ag-header-cell[col-id=athlete] .ag-header-icon")
      .first()
      .as("menu")
      .click()

    cy.get("[data-cy=ai-input]")
      .as("filter")
      .type("Phelps{enter}")
    cy.get("@filter").should("not.exist")
    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .should("contain", "Phelps")

    cy.get("@menu").click()
    cy.get("@filter").should("have.value", "Phelps")

    cy.get("[data-cy=ai-clear]").click()
    cy.get("@filter").should("have.value", "")
    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .should("to.have.length.greaterThan", 3)
  })

  it("submits on close", () => {
    cy.get(".ag-header-cell[col-id=athlete] .ag-header-icon")
      .first()
      .click()

    cy.get(".ag-filter input").type("Victor")
    cy.get(".ag-header-viewport").click()
    cy.get(".ag-filter input").should("not.exist")

    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .should("contain", "Victor")
  })
})
