describe('App', () => {
  it('should have correct heading', () => {
    cy.visit('http://localhost:3000/')

    cy.get('button').its('length').should('be.eql', 9)
  })
})
