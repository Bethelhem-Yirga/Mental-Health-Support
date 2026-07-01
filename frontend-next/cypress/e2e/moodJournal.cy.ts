describe('Mood Journal Tests', () => {
  beforeEach(() => {
    cy.visit('/journal')
  })

  it('should display mood journal page', () => {
    cy.contains('Mood Journal').should('be.visible')
    cy.contains('How are you feeling today?').should('be.visible')
  })

  it('should allow selecting a mood', () => {
    cy.contains('😊 Great').click()
    cy.contains('🙂 Good').click()
    cy.contains('😐 Okay').click()
    cy.contains('😔 Low').click()
    cy.contains('😢 Very Low').click()
  })

  it('should save a mood entry with note', () => {
    cy.contains('😊 Great').click()
    cy.get('textarea').type('Had a wonderful day! Feeling very positive.')
    cy.contains('Save Today\'s Mood').click()
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Mood saved')
    })
  })

  it('should switch to calendar view', () => {
    cy.contains('📅 Calendar').click()
    cy.contains('Mood Calendar').should('be.visible')
  })

  it('should switch to analytics view', () => {
    cy.contains('📊 Analytics').click()
    cy.contains('Mood Trend').should('be.visible')
  })
})
