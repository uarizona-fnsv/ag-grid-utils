context("ColumnFilterSet", () => {
  before(() => {
    cy.visitStorybook()
  })

  beforeEach(() => {
    cy.loadStory("Filters/ColumnFilterSet", "Primary")
  })

  it("filters the grid", () => {
    cy.get(".ag-header-cell[col-id=athlete] .ag-header-icon")
      .first()
      .as("menu")
      .click()

    cy.grab("cfs-unselected")
      .as("unselected")
      .first()
      .click()
    cy.grab("cfs-filter")
      .as("filter")
      .type("brooke")
    cy.grab("cfs-unselected")
      .should("contain", "Brooke")
      .first()
      .click()

    cy.grab("cfs-selected")
      .as("selected")
      .should("contain", "Aleksey Nemov")
      .should("contain", "Brooke Bennett")
      .should("have.length", 2)
    cy.get(".ag-header-viewport").click() // click outside

    cy.get(".ag-center-cols-container .ag-row")
      .find("[col-id=athlete]")
      .as("rows")
      .should("contain", "Aleksey Nemov")
      .should("contain", "Brooke Bennett")
      .should("have.length", 2)

    cy.get("@menu").click()
    cy.get("@filter").should("have.value", "")
    cy.get("@selected")
      .should("contain", "Aleksey Nemov")
      .should("contain", "Brooke Bennett")
      .should("have.length", 2)

    cy.grab("cfs-clear").click()
    cy.get(".ag-header-viewport").click() // click outside
    cy.get("@rows").should("to.have.length.greaterThan", 2)
  })
})
