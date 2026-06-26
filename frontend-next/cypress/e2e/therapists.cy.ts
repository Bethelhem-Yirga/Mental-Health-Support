describe('Therapists Directory Tests', () => {
  beforeEach(() => {
    cy.visit('/therapists')
  })

  it('should load therapists page', () => {
    cy.contains('Find a Therapist').should('be.visible')
  })

  it('should display therapist cards', () => {
    cy.contains('Dr. Sarah Chen').should('be.visible')
    cy.contains('Michael Okonkwo').should('be.visible')
  })

  it('should filter by specialty', () => {
    cy.contains('Anxiety & Depression').click()
    cy.contains('Dr. Sarah Chen').should('be.visible')
  })

  it('should search for a therapist', () => {
    cy.get('input[placeholder*="Search"]').type('Sarah')
    cy.contains('Dr. Sarah Chen').should('be.visible')
  })

  it('should open therapist profile modal', () => {
    cy.contains('View Profile').first().click()
    cy.contains('Therapist Profile').should('be.visible')
    cy.contains('Book Session').should('be.visible')
  })
})
