describe('Mindfulness Tools Tests', () => {
  beforeEach(() => {
    cy.visit('/mindfulness')
  })

  it('should load mindfulness page', () => {
    cy.contains('Find Your Calm').should('be.visible')
  })

  it('should switch between tools', () => {
    cy.contains('Meditation').click()
    cy.contains('Meditation Timer').should('be.visible')
    
    cy.contains('Grounding').click()
    cy.contains('5-4-3-2-1 Grounding').should('be.visible')
    
    cy.contains('PMR').click()
    cy.contains('Muscle Relaxation').should('be.visible')
  })

  it('should start breathing exercise', () => {
    cy.contains('Start').click()
    cy.contains('Stop').should('be.visible')
  })
})
