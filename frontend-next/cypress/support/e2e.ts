// Import commands.js
import './commands'

// Cypress configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

// Handle Next.js route changes
Cypress.on('window:before:load', (win) => {
  win.__NEXT_DATA__ = win.__NEXT_DATA__ || {}
})
