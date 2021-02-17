import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('The Householder planning appeal questionnaire page is presented', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
});

Given('the user is on the Tell us about any appeals in the immediate area page', () => {
  cy.goToTellUsAboutAppealsInImmediateAreaPage();
  cy.validateAppealsPageTitle();
});

When(`the user selects the link Tell us about any appeals in the immediate area`, () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('otherAppeals');
});

When(`the user selects Save and Continue`, () => {
  cy.clickSaveAndContinue();
});

Then(
  `the user is presented with the page 'Tell us about any appeals in the immediate area'`,
  () => {
    cy.verifyAboutAppealCaption();
    cy.validateOtherAppealsAdjacentToSiteQuestionText();
  }
);

Then(
  `the page title is 'Are there any other appeals adjacent or close to the site still being considered? - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK'`,
  () => {
    cy.validateAppealsPageTitle();
  }
);

Then('Then the user is shown the error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage);
});

Then(`the user remains on 'Tell us about any appeals in the immediate area' page`, () => {
  cy.validateAppealsPageTitle();
});

When('the user selects the option {string}', (radioButtonValue) => {
  cy.appealsAreaRadioButton(radioButtonValue);
});

Then('the user navigates to the Task List', () => {
  cy.verifyTaskListPageTitle();
});

Then('a Completed status is populated for the task', () => {
  cy.verifyCompletedStatus('otherAppeals');
});

Then('the user is provided with a free text field to input the appeal reference numbers', () => {
  cy.verifyAppealsSelectionYesHelpText();
  cy.inputAppealsReferenceNumber();
});

When(`the user enters {string}`, (appeal_reference_number) => {
  cy.inputAppealsReferenceNumber().type(appeal_reference_number);
});

When('user does not provide appeal reference numbers', () => {
  cy.inputAppealsReferenceNumber().should('have.value', '');
});

Then('the user is shown the error message {string}', (errorMessage) => {
  cy.validateErrorMessage(errorMessage);
});

Given('a user has completed the information needed on the appeals in immediate area page', () => {
  cy.goToAppealsQuestionnaireTasklistPage();
  cy.verifyTaskListPageTitle();
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('otherAppeals');
  cy.validateAppealsPageTitle();
  cy.appealsAreaRadioButton('No');
  cy.clickSaveAndContinue();
});

When(
  `the user returns to the 'Tell us about any appeals in the immediate area' page from the Task List`,
  () => {
    cy.verifyTaskListPageTitle();
    cy.clickOnLinksOnAppealQuestionnaireTaskListPage('otherAppeals');
    cy.validateAppealsPageTitle();
  }
);

Then('the information they previously entered is still populated', () => {
  cy.verifyRadioButtonSelection('No');
});

When('the user selects the back link', () => {
  cy.clickBackButton();
});

Then('any information they have entered will not be saved', () => {
  cy.clickOnLinksOnAppealQuestionnaireTaskListPage('otherAppeals');
  cy.validateAppealsPageTitle();
  cy.get('input[data-cy=adjacent-appeals-no]').should('not.be.checked');
});
