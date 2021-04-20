import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import defaultPathId from '../../utils/defaultPathId';

const preCannedAppeal = require('../../fixtures/anAppeal.json');

const page = {
  id: 'officersReport',
  heading: `Upload the Planning Officer's report`,
  section: 'Required documents',
  title: `Planning Officer's report - Appeal Questionnaire - Appeal a householder planning decision - GOV.UK`,
  url: 'officers-report',
}

let disableJs = false;

const goToOfficersReportPage = (appealId) => {
  cy.goToPage(page.url, appealId, disableJs);
};

Before(() => {
  cy.wrap(page).as('page');
  disableJs = false;
});

Before({ tags: '@nojs' }, () => {
  disableJs = true;
});

Given('Upload the Planning Officer’s report question is requested', () => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal);
  cy.get('@appealReply').then( (appealReply) => {
    goToOfficersReportPage(appealReply.appealId);
  });
});

When('LPA Planning Officer chooses to upload Planning Officer report', () => {
  cy.clickOnSubTaskLink(page.id);
  cy.verifyPage(page.url);
});

When('the Upload the Planning Officer’s report question is revisited', () => {
  cy.get('@appealReply').then( (appealReply) => {
    goToOfficersReportPage(appealReply.appealId);
  });
});

Then('LPA Planning Officer is presented with the ability to upload the Planning Officer’s report', () => {
  cy.verifyPage(page.url);
  cy.verifyPageTitle(page.title);
  cy.verifyPageHeading(page.heading);
  cy.verifySectionName(page.section);
  cy.get('@appealReply').then( (appealReply) => {
    cy.checkPageA11y(`/${appealReply.appealId}/${page.url}`);
  });
});

Then('Upload the Planning Officer’s report subsection is shown as completed', () => {
  cy.verifyCompletedStatus(page.id);
});

Then('Upload the Planning Officer’s report heading and the uploaded file name should be displayed', () => {
  cy.confirmCheckYourAnswersDisplayed('plansDecision', 'upload-file-valid.pdf');
});
