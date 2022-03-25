describe('Creating new blog', function () {

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
    })

    it('Shows create blog form when button is clicked', function () {
        cy.get('#createBlogForm')
            .within(() => {
                cy.contains('button[class=toggleVisible]', 'Create new blog').click()
                cy.get('form')
                    .within(() => {
                        cy.contains('label', 'Title')
                        cy.get('input[id=Title]')
                        cy.contains('label', 'Author')
                        cy.get('input[id=Author]')
                        cy.contains('label', 'Url')
                        cy.get('input[id=Url]')
                        cy.get('button[id=createBlogButton]')
                    })
                cy.contains('button[class=toggleHidden]', 'Cancel')
            })
    })

    it('Creating new blog succeeds', function () {
        cy.addBlogs(defaultBlog)

        cy.messagesDisplayed({
            type: '.notification',
            message: `User ${defaultUser.name} added a new blog: ${defaultBlog.title} by ${defaultBlog.author}`
        })

        cy.get('#createBlogForm')
            .find('form')
            .should('not.exist')

        cy.get('#renderBlogs>li')
            .within(() => {
                cy.contains('.blogTitle', defaultBlog.title)
                cy.contains('.blogAuthor', defaultBlog.author)
                cy.contains('button[class=blogDetailsButton]', 'Show')
            })
    })
})