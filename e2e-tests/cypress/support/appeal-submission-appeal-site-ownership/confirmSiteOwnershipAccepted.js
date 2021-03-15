module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/appeal-householder-decision/site-access');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
