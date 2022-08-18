describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('body').then((readingList) => {
      if (readingList.find('.reading-list-item').length > 0) {
        cy.get('[data-testing="remove-book"]').click({ multiple: true });
        cy.get('[data-testing="close-reading-list"]').click();
      } else {
        cy.get('[data-testing="close-reading-list"]').click();
      }
    });
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to add book to the reading list and remove it', () => {
    cy.get('input[type="search"]').type('test');

    cy.get('[data-testing="search-button"]').click();

    cy.wait(5000);

    cy.get('[data-testing="add-book"]').first().click();

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should('have.length', 1);

    cy.get('[data-testing="remove-book"]').last().click();

    cy.get('[data-testing="reading-list-item"]').should('have.length', 0);
  });
});
