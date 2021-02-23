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

    // Submits & closes on enter
    cy.grab("ai-input")
      .as("filter")
      .type("Phelps{enter}")
    cy.get("@filter").should("not.exist")
    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .should("contain", "Phelps")

    // Value is retained
    cy.get("@menu").click()
    cy.get("@filter").should("have.value", "Phelps")

    // Clears value & submits on close
    cy.grab("ai-clear").click()
    cy.get("@filter").should("have.value", "")
    cy.get(".ag-header-viewport").click() // click outside
    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .should("to.have.length.greaterThan", 3)
  })
})
