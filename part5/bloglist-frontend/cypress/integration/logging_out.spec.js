describe('Logging out', function () {
    var defaultUser
    before(function () {
        cy.fixture('defaultUser.json').then((user) => {
            defaultUser = user
        })
    })
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', defaultUser)
        cy.visit('http://localhost:3000')
        cy.login(defaultUser.username, defaultUser.password)
    })

    it('Logout succeeds', function () {
        cy.contains('button[id=logoutButton]', 'Logout')
            .click()
            .should(() => {
                expect(localStorage.getItem('loggedBlogAppUser')).to.be.null
            })

        cy.messagesDisplayed({ type: '.notification', message: `User '${defaultUser.name}' logged out!` })

        cy.get('#loggedIn').should('not.exist')
        cy.get('#loginForm')
    })
})