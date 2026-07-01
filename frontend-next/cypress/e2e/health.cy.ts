describe('Health Check', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the homepage', () => {
    cy.contains('MindSpace').should('be.visible')
  })

  it('should have a working navigation bar', () => {
    cy.get('nav').should('be.visible')
  })

  it('should navigate to chat page', () => {
    cy.contains('Chat').click()
    cy.url().should('include', '/chat')
  })
})
