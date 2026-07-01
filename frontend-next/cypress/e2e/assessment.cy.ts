describe('Assessment Tests', () => {
  beforeEach(() => {
    cy.visit('/assessment')
  })

  it('should display assessment page', () => {
    cy.contains('PHQ-9 Depression Assessment').should('be.visible')
    cy.contains('Question 1 of 9').should('be.visible')
  })

  it('should allow answering questions', () => {
    // Answer all 9 questions
    for (let i = 0; i < 9; i++) {
      cy.contains('Not at all').click()
      cy.contains('Next').click()
      cy.wait(500)
    }
  })

  it('should show results after completion', () => {
    // Answer all questions with "Several days" (value 1)
    for (let i = 0; i < 9; i++) {
      cy.contains('Several days').click()
      if (i < 8) cy.contains('Next').click()
      cy.wait(300)
    }
    
    cy.contains('See Results').click()
    cy.contains('Your Assessment Results').should('be.visible')
    cy.contains('Score: 9/27').should('be.visible')
  })
})
