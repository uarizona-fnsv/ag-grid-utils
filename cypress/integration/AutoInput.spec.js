context("AutoInput", () => {
  beforeEach(() => {
    cy.visitStorybook()
  })

  context("String", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "String")
    })

    it("validates value and provides suggestions", () => {
      cy.grab("ai-input")
        .as("input")
        .focus()
      cy.get("datalist option").should("have.length.greaterThan", 0)
      cy.grab("ai-input")
        .type("Ju")
        .blur()
        .should("have.value", "Ju")
        .then($input => expect($input[0].validity.valid).to.be.true)
      cy.storyAction("change").should("be.calledWith", ["Ju"])
      cy.get("datalist option").should("contain", "Ju")
      cy.get("@input")
        .type("!")
        .blur()
        .then($input => expect($input[0].validity.valid).to.be.false)
      cy.grab("ai-clear").click()
      cy.grab("ai-input").should("have.value", "")
      cy.storyAction("change").should("be.calledWith", [""])
    })
  })

  context("Multistring", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Multistring")
    })

    it("validates multiple values", () => {
      const value = ["Jason", "Dan", "Chris"]
      cy.grab("ai-input")
        .as("input")
        .type(value.join(";"))
        .blur()
        .should("have.value", value.join(";"))
        .then($input => expect($input[0].validity.valid).to.be.true)
      cy.storyAction("change").should("have.been.calledWith", [[...value]])
      cy.get("@input")
        .type("!@#$%^;Carl")
        .blur()
        .then($input => expect($input[0].validity.valid).to.be.false)
      cy.grab("ai-clear").click()
      cy.get("@input").should("have.value", "")
      cy.storyAction("change").should("have.been.calledWith", [[""]])
    })
  })

  context("Number", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Number")
    })

    it("accepts and clears a value", () => {
      cy.grab("ai-input")
        .type("42")
        .blur()
        .should("have.value", "42")
      cy.storyAction("change").should("have.been.calledWith", ["42"])
      cy.grab("ai-clear").click()
      cy.grab("ai-input").should("have.value", "")
      cy.storyAction("change").should("have.been.calledWith", [""])
    })
  })

  context("Date", () => {
    beforeEach(() => {
      cy.loadStory("Support/AutoInput", "Date")
    })

    it("accepts and clears a value", () => {
      cy.grab("ai-input")
        .type("1993-10-13")
        .blur()
        .should("have.value", "1993-10-13")
      cy.get("#json").should("have.text", `"1993-10-13"`)
      cy.storyAction("change").should("have.been.calledWith", ["1993-10-13"])
      cy.grab("ai-clear").click()
      cy.grab("ai-input").should("have.value", "")
      cy.get("#json").should("have.text", `""`)
      cy.storyAction("change").should("have.been.calledWith", [""])
    })
  })
})
