exports.questionTitle = () => {
  return cy.get('h1');
};

exports.sectionName = () => {
  return cy.get('.govuk-caption-l');
};

exports.saveAndContinueButton = () => {
  return cy.get('.govuk-button');
};

exports.backButton = () => {
  return cy.get('[data-cy="back"]');
};

exports.pageHeading = () => {
  return cy.get('.govuk-fieldset__heading');
};

exports.textArea = (textAreaId) => {
  return cy.get(`textarea[data-cy="${textAreaId}"]`);
};

exports.textBox = (textBoxId) => {
  return cy.get(`[data-cy="${textBoxId}"]`);
};

exports.labelText = (labelTextId) => {
  return cy.get(`[data-cy="${labelTextId}"]`);
};

exports.labelHint = (labelHintId) => {
  return cy.get(`div[data-cy="${labelHintId}"]`);
};

exports.input = (inputId) => {
  return cy.get(`input[data-cy="${inputId}"]`);
};

exports.errorMessage = (errorMessageId) => {
  return cy.get(`[data-cy="${errorMessageId}"]`);
};

exports.summaryErrorMessage = (summaryErrorMessageId) => {
  return cy.get(`a[href="#${summaryErrorMessageId}"]`);
};
