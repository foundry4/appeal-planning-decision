module.exports = (planningApplicationNumber) => {
  cy.get('[data-cy="application-number"]').type(
    `{selectall}{backspace}${planningApplicationNumber}`,
  );
  cy.wait(Cypress.env('demoDelay'));
  cy.get('[data-cy="button-save-and-continue"]').click();
  cy.wait(Cypress.env('demoDelay'));
};
