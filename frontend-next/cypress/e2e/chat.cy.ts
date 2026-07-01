describe('Chat Tests', () => {
  beforeEach(() => {
    cy.visit('/chat')
  })

  it('should load chat page', () => {
    cy.contains('Support Circle').should('be.visible')
    cy.contains('No messages yet').should('be.visible')
  })

  it('should allow typing a message', () => {
    cy.get('textarea').first().type('Hello, this is a test message!')
    cy.get('textarea').first().should('have.value', 'Hello, this is a test message!')
  })

  it('should send a message', () => {
    cy.get('textarea').first().type('Hello world!')
    cy.get('button[type="submit"]').click()
    cy.get('textarea').first().should('have.value', '')
  })

  it('should show connection status', () => {
    cy.contains('Connected').should('be.visible')
  })
})
