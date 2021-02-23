context("AutoInput", () => {
  before(() => {
    cy.visitStorybook()
  })
  context("String", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "String")
    })

  it("accepts a value", () => {
    cy.grab("ai-input")
      .type("crazier than a road lizard")
      .blur()
      .should("have.value", "crazier than a road lizard")
    cy.get("#json").should("have.text", `"crazier than a road lizard"`)
  })

  it("validates input", () => {
    cy.grab("ai-input")
      .type("cr@z!3r 7h@n @ ro@d l!z@rd")
      .blur()
    cy.get("form").then($form => expect($form[0].reportValidity()).to.be.false)
  })

  it("clears the input", () => {
    cy.grab("ai-input").type("hello world this is a test")
    cy.grab("ai-clear").click()
    cy.grab("ai-input").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })

  it("provides autocomplete suggestions", () => {
    cy.grab("ai-input").focus()
    cy.get("datalist option").should("have.length.greaterThan", 0)
  })

  context("Multistring", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Multistring")
    })

  it("accepts a value", () => {
    const value = ["crazier", "than", "a", "road", "lizard"]
    cy.grab("ai-input")
      .type(value.join(";"))
      .blur()
      .should("have.value", value.join(";"))
    cy.get("#json").should("have.text", JSON.stringify(value))
  })

  it("validates input", () => {
    cy.grab("ai-input")
      .type("crazier;7h@n;a;road;l!z@rd")
      .blur()
    cy.get("form").then($form => expect($form[0].reportValidity()).to.be.false)
  })

  it("clears the input", () => {
    cy.grab("ai-input").type("hello;world;this;is;a;test")
    cy.grab("ai-clear").click()
    cy.grab("ai-input").should("have.value", "")
    cy.get("#json").should("have.text", `[""]`)
  })

  context("Number", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Number")
    })

  it("accepts a value", () => {
    cy.grab("ai-input")
      .type("42")
      .blur()
      .should("have.value", "42")
    cy.get("#json").should("have.text", `"42"`)
  })

  it("clears the input", () => {
    cy.grab("ai-input").type("42")
    cy.grab("ai-clear").click()
    cy.grab("ai-input").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })

  context("Date", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Date")
    })

  it("accepts a value", () => {
    cy.grab("ai-input")
      .type("1993-10-13")
      .blur()
      .should("have.value", "1993-10-13")
    cy.get("#json").should("have.text", `"1993-10-13"`)
  })

  it("clears the input", () => {
    cy.grab("ai-input").type("1993-10-13")
    cy.grab("ai-clear").click()
    cy.grab("ai-input").should("have.value", "")
    cy.get("#json").should("have.text", `""`)
  })
})
