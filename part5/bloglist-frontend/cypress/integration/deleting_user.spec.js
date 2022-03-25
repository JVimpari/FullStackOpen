describe('Deleting user', function () {
    var defaultUser
    var newUser
    var defaultBlog
    before(function () {
        cy.fixture('defaultUser.json').then((user) => {
            defaultUser = user
        })
        cy.fixture('newUser.json').then((user) => {
            newUser = user
        })
        cy.fixture('defaultBlog.json').then((blog) => {
            defaultBlog = blog
        })
    })
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', defaultUser)
        cy.visit('http://localhost:3000')
        cy.login(defaultUser.username, defaultUser.password)
    })

    it('Deleting user succeeds', function () {
        cy.contains('button[id=deleteUserButton]', 'Delete User').click()
        cy.on('window.confirm', () => true)

        cy.messagesDisplayed(
            { type: '.notification', message: `Credentials for user: ${defaultUser.name} have been deleted` },
            { type: '.notification', message: `User '${defaultUser.name}' logged out!` }
        )
    })

    it('Deleted user can no longer login', function () {
        cy.contains('button[id=deleteUserButton]', 'Delete User').click()
        cy.on('window.confirm', () => true)

        cy.login(defaultUser.username, defaultUser.password)

        cy.messagesDisplayed({ type: '.error', message: 'Invalid username or password' })
    })

    it('Deleting user also deletes blogs added by the user', function () {
        cy.request('POST', 'http://localhost:3003/api/users/', newUser)
        cy.addBlogs(defaultBlog)
        cy.contains('button[id=deleteUserButton]', 'Delete User').click()
        cy.on('window.confirm', () => true)

        cy.login(newUser.username, newUser.password)

        cy.get('#renderBlogs')
            .find('li')
            .should('not.exist')
    })
})