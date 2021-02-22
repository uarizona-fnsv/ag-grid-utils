const basePath = "/iframe.html?id=support-autoinput--"

context("String", () => {
  beforeEach(() => {
    cy.visit(basePath + "string")
  })

  it("accepts a value", () => {
    cy.get("[data-cy=ai-input]")
      .type("crazier than a road lizard")
      .blur()
      .should("have.value", "crazier than a road lizard")
    cy.get("#json").should("have.text", `"crazier than a road lizard"`)
  })

  it("validates input", () => {
    cy.get("[data-cy=ai-input]")
      .type("cr@z!3r 7h@n @ ro@d l!z@rd")
      .blur()
    cy.get("form").then($form => expect($form[0].reportValidity()).to.be.false)
  })

  it("clears the input", () => {
    cy.get("[data-cy=ai-input]").type("hello world this is a test")
    cy.get("[data-cy=ai-clear").click()
    cy.get("[data-cy=ai-input]").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })

  it("provides autocomplete suggestions", () => {
    cy.get("[data-cy=ai-input]").focus()
    cy.get("datalist option").should("have.length.greaterThan", 0)
  })
})

context("Multistring", () => {
  beforeEach(() => {
    cy.visit(basePath + "multistring")
  })

  it("accepts a value", () => {
    const value = ["crazier", "than", "a", "road", "lizard"]
    cy.get("[data-cy=ai-input]")
      .type(value.join(";"))
      .blur()
      .should("have.value", value.join(";"))
    cy.get("#json").should("have.text", JSON.stringify(value))
  })

  it("validates input", () => {
    cy.get("[data-cy=ai-input]")
      .type("crazier;7h@n;a;road;l!z@rd")
      .blur()
    cy.get("form").then($form => expect($form[0].reportValidity()).to.be.false)
  })

  it("clears the input", () => {
    cy.get("[data-cy=ai-input]").type("hello;world;this;is;a;test")
    cy.get("[data-cy=ai-clear").click()
    cy.get("[data-cy=ai-input]").should("have.value", "")
    cy.get("#json").should("have.text", `[""]`)
  })
})

context("Number", () => {
  beforeEach(() => {
    cy.visit(basePath + "number")
  })

  it("accepts a value", () => {
    cy.get("[data-cy=ai-input]")
      .type("42")
      .blur()
      .should("have.value", "42")
    cy.get("#json").should("have.text", `"42"`)
  })

  it("clears the input", () => {
    cy.get("[data-cy=ai-input]").type("42")
    cy.get("[data-cy=ai-clear").click()
    cy.get("[data-cy=ai-input]").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })
})

context("Date", () => {
  beforeEach(() => {
    cy.visit(basePath + "date")
  })

  it("accepts a value", () => {
    cy.get("[data-cy=ai-input]")
      .type("1993-10-13")
      .blur()
      .should("have.value", "1993-10-13")
    cy.get("#json").should("have.text", `"1993-10-13"`)
  })

  it("clears the input", () => {
    cy.get("[data-cy=ai-input]").type("1993-10-13")
    cy.get("[data-cy=ai-clear").click()
    cy.get("[data-cy=ai-input]").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })
})
