// Custom commands for testing

// Login command (if you have authentication)
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-cy=email]').type(email)
  cy.get('[data-cy=password]').type(password)
  cy.get('[data-cy=login-btn]').click()
})

// Create test user command
Cypress.Commands.add('createTestUser', () => {
  cy.request('POST', 'http://localhost:5000/api/users/create')
    .then((response) => {
      window.localStorage.setItem('userId', response.body.data.userId)
    })
})

// Add mood entry command
Cypress.Commands.add('addMood', (moodValue: number, note: string) => {
  const userId = window.localStorage.getItem('userId')
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/moods/entry',
    body: { userId, moodValue, moodLabel: 'Test', note }
  })
})

// Clear database command
Cypress.Commands.add('clearDatabase', () => {
  const userId = window.localStorage.getItem('userId')
  if (userId) {
    cy.request('DELETE', `http://localhost:5000/api/users/${userId}/data`)
  }
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      createTestUser(): Chainable<void>
      addMood(moodValue: number, note: string): Chainable<void>
      clearDatabase(): Chainable<void>
    }
  }
}
