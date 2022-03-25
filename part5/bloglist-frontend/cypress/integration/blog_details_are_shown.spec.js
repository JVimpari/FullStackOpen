describe('Blog details can be toggled between visible and hidden', function () {

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

    it('Details are shown when button is clicked', function () {
        cy.contains('#renderBlogs>li>button[class=blogDetailsButton]', 'Show').click()
        cy.get('.details')
            .within(() => {
                cy.contains('li', defaultBlog.url)
                cy.contains('li[class=likesContainer]', 'Likes:')
                    .within(() => {
                        cy.contains('.numberOfLikes', '0')
                        cy.contains('button[class=likeButton]', 'Like')
                    })
                cy.contains('li', defaultUser.name)
                cy.contains('li>button[class=deleteBlogButton]', 'Delete')
            })
    })

    it('Details are hidden when button is clicked', function () {
        cy.contains('#renderBlogs>li>button[class=blogDetailsButton]', 'Show').click()
        cy.contains('#renderBlogs>li>button[class=blogDetailsButton]', 'Hide').click()
        cy.get('.details')
            .should('not.exist')
    })
})