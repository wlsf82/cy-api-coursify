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
      data.forEach(item => {
        const { currency_symbol, is_active, is_archived } = item
        expect(currency_symbol).to.eq('R$')
        expect(is_active).to.eq(true)
        expect(is_archived).to.eq(false)
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

    it('POST /courses - failure scenario - 404', () => {
      cy.api({
        method: 'POST',
        url: `${API_URL}/courses`,
        headers: { Authorization: Cypress.env('LEAK_API_KEY') },
        body: {
          foo: 'foo',
          bar: 'bar'
        },
        failOnStatusCode: false,
      }).should(({ status, body }) => {
        expect(status).to.equal(404)
        expect(body.errors.detail).be.equal('Not Found')
      })
    })
  })
})
