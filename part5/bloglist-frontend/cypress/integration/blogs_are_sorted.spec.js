const { _ } = Cypress

describe('Blogs are sorted in descending order according to likes', function () {

    var defaultUser
    var blogsForSorting = []
    before(function () {
        cy.fixture('defaultUser.json').then((user) => {
            defaultUser = user
        })
        cy.fixture('blogsForSorting.json').then((blogs) => {
            blogsForSorting = blogs
        })
    })

    before(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.request('POST', 'http://localhost:3003/api/users/', defaultUser)
        cy.visit('http://localhost:3000')
        cy.login(defaultUser.username, defaultUser.password)
        cy.addBlogs(blogsForSorting[0], blogsForSorting[1], blogsForSorting[2])
        cy.get('#renderBlogs>li')
            .should('have.length', blogsForSorting.length)
            .find('button[class=blogDetailsButton]')
            .click({ multiple: true })
    })

    const simplify = (objects$) => {
        return _.map(objects$, (object$) => {
            return {
                title: object$.querySelector('b[class=blogTitle]').textContent,
                likes: Number(object$.querySelector('span[class=numberOfLikes]').textContent)
            }
        })
    }

    const sortBlogs = () => {
        return (
            cy.get('#renderBlogs>li')
                .then(simplify)
                .then(simplified => {
                    const sorted = _.orderBy(simplified, 'likes', 'desc')
                    return { simplified, sorted }
                })
        )
    }

    const addLike = (title) => {
        cy.get('#renderBlogs')
            .contains('li', title)
            .contains('button[class=likeButton]', 'Like').click()
            .prev()
            .contains('.numberOfLikes', '1')
    }

    it('Sorts 3rd blog to the top when it is liked', function() {
        addLike(blogsForSorting[2].title)
        sortBlogs()
            .then(blogs => {
                expect(blogs.simplified).to.deep.equal(blogs.sorted)
            })
    })

    it('Sorts 2nd blog to 2nd from the top when its liked (stable sort)', function () {
        addLike(blogsForSorting[1].title)
        sortBlogs()
            .then(blogs => {
                expect(blogs.simplified).to.deep.equal(blogs.sorted)
            })
    })
})