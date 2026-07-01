describe('Crisis Page Tests', () => {
  beforeEach(() => {
    cy.visit('/crisis')
  })

  it('should load crisis page', () => {
    cy.contains('Crisis Support').should('be.visible')
    cy.contains('Call 988').should('be.visible')
  })

  it('should display hotline numbers', () => {
    cy.contains('988 Suicide & Crisis Lifeline').should('be.visible')
    cy.contains('Crisis Text Line').should('be.visible')
  })
})
