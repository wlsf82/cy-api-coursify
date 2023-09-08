const API_URL = Cypress.env('API_URL')
const Authorization = Cypress.env('API_KEY')

describe('Coursify.me API', { env: { hideCredentials: true } }, () => {
  beforeEach(() => cy.exec('rm -rf cypress/screenshots/'))

  it('GET /courses', () => {
    cy.api({
      method: 'GET',
      url: `${API_URL}/courses`,
      headers: { Authorization }
    })
    
    cy.get('#api-view').screenshot('response')

    cy.get('[for="responseHeaders0"]').click()
    cy.get('#api-view').screenshot('headers')

    cy.contains('label', 'Cookies').click()
    cy.get('#api-view').screenshot('cookies',)
  })
})
