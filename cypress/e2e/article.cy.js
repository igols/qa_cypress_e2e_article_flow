/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Article Flow', () => {
  let user;
  beforeEach(() => {
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
      cy.login(user.email, user.username, user.password);
      cy.visit('/', { timeout: 120000, failOnStatusCode: false,
        onBeforeLoad(win) {
          win.addEventListener('load', () => {}, true);
        }
      });
    });
  });

  it('should create a new article', () => {
    const articleTitle = faker.lorem.sentence();
    const articleDescription = faker.lorem.sentence();
    const articleBody = faker.lorem.paragraphs(1);
    cy.get('a[href="/editor"]').click();
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]')
      .type(articleDescription);
    cy.get('textarea[placeholder="Write your article (in markdown)"]')
      .type(articleBody);
    cy.get('button[type="button"]').contains('Publish Article').click();
    cy.get('h1').should('contain', articleTitle);
    cy.get('.article-content').should('contain', articleBody);
  });

  it('should delete an existing article', () => {
    const titleToDelete = 'Delete Me ' + faker.string.uuid();
    cy.createArticle(titleToDelete, 'Desc', 'Body');
    cy.visit(`/@${user.username}`);
    cy.contains('h1', titleToDelete).click();
    cy.get('.btn-outline-danger')
      .contains('Delete Article').first().click();
    cy.visit(`/@${user.username}`);
    cy.contains(titleToDelete).should('not.exist');
  });
});
