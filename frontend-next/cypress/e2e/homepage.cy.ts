describe('Homepage Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the homepage successfully', () => {
    cy.contains('MindSpace').should('be.visible')
    cy.contains('Your Mental Health Matters').should('be.visible')
  })

  it('should navigate to chat page', () => {
    cy.contains('Start Anonymous Chat').click()
    cy.url().should('include', '/chat')
    cy.contains('Support Circle').should('be.visible')
  })

  it('should navigate to therapists page', () => {
    cy.contains('Therapists').click()
    cy.url().should('include', '/therapists')
    cy.contains('Find a Therapist').should('be.visible')
  })

  it('should navigate to assessment page', () => {
    cy.contains('Take Self-Assessment').click()
    cy.url().should('include', '/assessment')
    cy.contains('PHQ-9 Depression Assessment').should('be.visible')
  })
})
