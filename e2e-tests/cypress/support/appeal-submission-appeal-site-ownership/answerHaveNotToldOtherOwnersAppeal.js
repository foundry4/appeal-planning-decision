module.exports = () => {
  cy.get('input[data-cy="answer-no"]').check();
  cy.wait(Cypress.env('demoDelay'));
};