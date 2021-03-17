import 'cypress-file-upload';

module.exports = (path) => {
  cy.get('#appeal-upload').attachFile({ filePath: path, encoding: 'binary' });
  cy.wait(Cypress.env('demoDelay'));
};
