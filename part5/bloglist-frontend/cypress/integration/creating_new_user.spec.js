describe('Creating new user', function () {

    var newUser
    before(function () {
        cy.fixture('newUser.json').then((user) => {
            newUser = user
        })
    })

    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        cy.visit('http://localhost:3000')
    })
    it('Shows create user form when button is clicked', function () {
        cy.get('#createUserForm')
            .within(() => {
                cy.contains('button[class=toggleVisible]', 'Create new user').click()
                cy.get('form')
                    .within(() => {
                        cy.contains('label', 'Username')
                        cy.get('input[id=newUsername]')
                        cy.contains('label', 'Name')
                        cy.get('input[id=newName]')
                        cy.contains('label', 'Password')
                        cy.get('input[id=newPassword]')
                        cy.get('button[id=createUserButton]')
                    })
                cy.contains('button[class=toggleHidden]', 'Cancel')
            })
    })

    it('Creating new user succeeds', function () {
        cy.contains('button[class=toggleVisible]', 'Create new user').click()
        cy.get('#createUserForm>form')
            .within(() => {
                cy.get('input[id=newUsername]').clear().type(newUser.username)
                cy.get('input[id=newName]').clear().type(newUser.name)
                cy.get('input[id=newPassword]').clear().type(newUser.password)
                cy.get('button[id=createUserButton]').click()
            })

        cy.messagesDisplayed({ type: '.notification', message: 'User: new_username created for New Name' })

        cy.get('#createUserForm')
            .find('form')
            .should('not.exist')
    })
})