describe('Logging in', function () {
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
    })

    it('Login form is shown by default', function () {
        cy.contains('h2', 'Login to application')
        cy.get('#loginForm')
            .within(() => {
                cy.contains('label', 'Username')
                cy.get('input[id=Username]')
                cy.contains('label', 'Password')
                cy.get('input[id=Password]')
                cy.get('button[id=loginButton]')
            })
        cy.contains('#createUserForm>button[class=toggleVisible]', 'Create new user')
    })

    it('Login succeeds with correct credentials', function () {
        cy.login(defaultUser.username, defaultUser.password)

        cy.get('#loginForm')
            .should('not.exist')
            .and(() => {
                expect(localStorage.getItem('loggedBlogAppUser')).to.exist
            })

        cy.messagesDisplayed({ type: '.notification', message: `User '${defaultUser.name}' logged in!` })

        cy.contains('h1', 'Blogs')

        cy.get('#loggedIn')
            .within(() => {
                cy.contains(`Logged in as: ${defaultUser.name}`)
                cy.contains('button[id=logoutButton]', 'Logout')
                cy.contains('button[id=deleteUserButton]', 'Delete User')
            })
        cy.contains('#createBlogForm>button[class=toggleVisible]', 'Create new blog')
    })

    it('Login fails with wrong credentials', function () {
        cy.login(defaultUser.username, 'notsecret')

        cy.get('#loginForm')
            .should('exist')
            .and(() => {
                expect(localStorage.getItem('loggedBlogAppUser')).to.be.null
            })

        cy.messagesDisplayed({ type: '.error', message: 'Invalid username or password' })

        cy.get('#loggedIn').should('not.exist')
    })
})