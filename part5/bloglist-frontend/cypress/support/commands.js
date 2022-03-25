// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.get('#loginForm')
        .within(() => {
            cy.get('input[id=Username]').type(username)
            cy.get('input[id=Password]').type(password)
            cy.get('button[id=loginButton]').click()
        })
})

Cypress.Commands.add('messagesDisplayed', (...args) => {
    cy.get('#messages')
        .within(() => {
            args.forEach(arg => {
                cy.contains(arg.type, arg.message)
            })
        })
    cy.get('#messages', { timeout: 5500 }).should('not.exist')
})

Cypress.Commands.add('addBlogs', (...blogs) => {
    blogs.forEach(blog => {
        cy.contains('#createBlogForm>button[class=toggleVisible]', 'Create new blog').click()
        cy.get('#createBlogForm>form')
            .within(() => {
                cy.get('input[id=Title]').clear().type(blog.title)
                cy.get('input[id=Author]').clear().type(blog.author)
                cy.get('input[id=Url]').clear().type(blog.url)
                cy.get('button[id=createBlogButton]').click()
            })
    })
})