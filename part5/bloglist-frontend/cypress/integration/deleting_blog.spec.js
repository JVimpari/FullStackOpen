describe('Deleting a blog', function () {

    var defaultUser
    var defaultBlog
    var newUser
    before(function () {
        cy.fixture('defaultUser.json').then((user) => {
            defaultUser = user
        })
        cy.fixture('defaultBlog.json').then((blog) => {
            defaultBlog = blog
        })
        cy.fixture('newUser.json').then((user) => {
            newUser = user
        })
    })

    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', defaultUser)
        cy.visit('http://localhost:3000')
        cy.login(defaultUser.username, defaultUser.password)
        cy.addBlogs(defaultBlog)
    })

    it('Deleting a blog succeeds if logged user is creator', function () {
        cy.contains('button[class=blogDetailsButton]', 'Show').click()
        cy.contains('button[class=deleteBlogButton]', 'Delete').click()
        cy.on('window.confirm', () => true)

        cy.messagesDisplayed({
            type: '.notification',
            message: `User ${defaultUser.name} deleted blog ${defaultBlog.title} by ${defaultBlog.author}`
        })

        cy.get('#renderBlogs')
            .find('li')
            .should('not.exist')
    })

    it('Delete blog button is not shown if logged user is non creator', function () {
        cy.request('POST', 'http://localhost:3003/api/users/', newUser)
        cy.contains('button[id=logoutButton]', 'Logout').click()
        cy.login(newUser.username, newUser.password)

        cy.contains('button[class=blogDetailsButton]', 'Show').click()

        cy.get('.details')
            .contains('button[class=deleteBlogButton]', 'Delete')
            .should('not.exist')
    })
})