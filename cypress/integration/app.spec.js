describe('App', () => {
  it('should have correct heading', () => {
    cy.visit('http://localhost:3000/')

    cy.title().should('eq', 'Vinh Vu - Remitano Assessment Test')
  })
})
