class CommonPageObjects {
  questionTitle() {
    return cy.get('h1');
  }

  sectionName() {
    return cy.get('.govuk-caption-l');
  }

  saveAndContinueButton() {
    return cy.get('[data-cy="save"]');
  }

  backButton() {
    return cy.get('[data-cy="back"]');
  }
}

export default CommonPageObjects;
