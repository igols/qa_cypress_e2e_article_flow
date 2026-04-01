/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Article Flow', () => {
  let user;
  const articleTitle = faker.lorem.sentence();
  const articleDescription = faker.lorem.sentence();
  const articleBody = faker.lorem.paragraphs(1);

  before(() => {
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
      cy.login(user.email, user.username, user.password);
    });
    cy.visit('/');
  });

  it('should create a new article', () => {
    cy.get('a[href="/editor"]').click();
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]')
      .type(articleDescription);
    cy.get('input[placeholder="Write your article (in markdown"]')
      .type(articleBody);
    cy.get('button[type="button"]').contains('Publish Artical').click();
    cy.get('h1').should('contain', articleTitle);
    cy.get('.artical-content').should('contain', articleBody);
  });

  it('should delete an existing artical', () => {
    const titleToDelete = 'Delete Me ' + faker.string.uuid();
    cy.createArticle(titleToDelete, 'Desc', 'Body');
    cy.visit(`/@${user.username}`);
    cy.contains('h1', titleToDelete).click();
    cy.get('.btn-outline-danger')
      .contains('Delete Articale').first().click();
    cy.visit(`/@${user.username}`);
    cy.contains(titleToDelete).should('not exist');
  });
});
