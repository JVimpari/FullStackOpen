describe('Liking a blog', function () {

    var defaultUser
    var defaultBlog
    before(function () {
        cy.fixture('defaultUser.json').then((user) => {
            defaultUser = user
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
        cy.addBlogs(defaultBlog)
    })

    it('Liking a blog succeeds', function () {
        cy.contains('button[class=blogDetailsButton]', 'Show').click()
        cy.contains('button[class=likeButton]', 'Like').click()

        cy.messagesDisplayed({
            type: '.notification',
            message: `Like added to blog: ${defaultBlog.title} by ${defaultBlog.author}`
        })

        cy.contains('.numberOfLikes', '1')
    })
})