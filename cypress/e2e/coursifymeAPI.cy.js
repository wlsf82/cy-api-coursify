const API_URL = Cypress.env('API_URL')
const Authorization = Cypress.env('API_KEY')

describe('Coursify.me API', { env: { hideCredentials: true } }, () => {
  it('GET /courses', () => {
    cy.api({
      method: 'GET',
      url: `${API_URL}/courses`,
      headers: { Authorization }
    }).should(({ status, body }) => {
      const { data } = body
      expect(status).to.equal(200)
      expect(data.length).to.equal(7)

      // Do not do this
      cy.get('[data-cy="status"]').should('contain', '200 (OK)')

      data.forEach(item => {
        const { currency_symbol, is_active, is_archived } = item
        expect(currency_symbol).to.eq('R$')
        expect(is_active).to.eq(true)
        expect(is_archived).to.eq(false)

        // Do not do this
        cy.get('[data-cy="responseBody"]')
          .should('contain', 'R$')
          .and('contain', '"is_active": true')
          .and('contain', '"is_archived": false')
      })
    })
  })

  context('GET /courses/:id', () => {
    it('GET free course', () => {
      cy.api({
        method: 'GET',
        url: `${API_URL}/courses/${Cypress.env('FREE_COURSE_ID')}`,
        headers: { Authorization }
      }).should(({ status, body }) => {
        const { data } = body
        expect(status).to.equal(200)
        expect(data.name).to.eq(Cypress.env('FREE_COURSE_NAME'))
        expect(data.price_type).to.eq('free')

        // Do not do this
        cy.get('[data-cy="status"]').should('contain', '200 (OK)')
        cy.get('[data-cy="responseBody"]')
          .should('contain', Cypress.env('FREE_COURSE_NAME'))
          .and('contain', 'free')
      })
    })

    it('GET paid course', () => {
      cy.api({
        method: 'GET',
        url: `${API_URL}/courses/${Cypress.env('PAID_COURSE_ID')}`,
        headers: { Authorization }
      }).should(({ status, body }) => {
        const { data } = body
        expect(status).to.equal(200)
        expect(data.name).to.eq(Cypress.env('PAID_COURSE_NAME'))
        expect(data.price_type).to.eq('paid')

        // Do not do this
        cy.get('[data-cy="status"]').should('contain', '200 (OK)')
        cy.get('[data-cy="responseBody"]')
          .should('contain', Cypress.env('PAID_COURSE_ID'))
          .and('contain', 'paid')
      })
    })
  })
})

describe('Coursify.me API', () => {
  context('Do not hide "sensitive" data', () => {
    it('GET /courses - failure scenario', () => {
      cy.api({
        method: 'GET',
        url: `${API_URL}/courses`,
        headers: { Authorization: Cypress.env('LEAK_API_KEY') },
        failOnStatusCode: false,
      }).should(({ status, body }) => {
        expect(status).not.to.equal(200)
        expect(body.errors).not.to.be.undefined
      })
    })
  })
})
