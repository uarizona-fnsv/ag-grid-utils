context("ColumnFilter", () => {
  before(() => {
    cy.visitStorybook()
  })
  context("String", () => {
    beforeEach(() => {
      cy.loadStory("Filters/ColumnFilter", "Primary")
    })

    it("filters the grid", () => {
      cy.get(`.ag-header-cell[col-id="athlete"] .ag-header-icon`)
        .first()
        .click()

      cy.get(`.ag-filter input`).type("Phelps{enter}")
      cy.get(`.ag-filter input`).should("not.exist")

      cy.get(`.ag-center-cols-container .ag-row`)
        .find(`[col-id="athlete"]`)
        .should("contain", "Phelps")
    })
  })
})
