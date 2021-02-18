/// <reference types="cypress" />

const baseUrl = "http://localhost:6006/iframe.html?id=support-autoinput--"

context("Actions", () => {
  it("accepts a value", () => {
    cy.visit(baseUrl + "string")
    cy.get("input")
      .type("crazier than a road lizard")
      .blur()
      .should("have.value", "crazier than a road lizard")
  })

  it("validates input", () => {
    cy.visit(baseUrl + "string")
    cy.get("input")
      .type("42")
      .blur()
    cy.get("form").then($form => expect($form[0].reportValidity()).to.be.false)
  })
})
