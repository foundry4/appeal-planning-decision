import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('an appeal is ready to be submitted', () => {
  cy.goToPlanningDepartmentPage();
  cy.provideEligibleLocalPlanningDepartment();
  cy.clickSaveAndContinue();

  cy.goToWhoAreYouPage();
  cy.answerYesOriginalAppellant();
  cy.clickSaveAndContinue();

  cy.provideDetailsName('Valid Name');
  cy.provideDetailsEmail('valid@email.com');
  cy.clickSaveAndContinue();

  cy.promptUserToProvidePlanningApplicationNumber();
  cy.providePlanningApplicationNumber('ValidNumber/12345');
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile('appeal-statement-valid.doc');
  cy.clickSaveAndContinue();

  cy.goToSiteAddressPage();
  cy.provideAddressLine1('1 Taylor Road');
  cy.provideAddressLine2('Clifton');
  cy.provideTownOrCity('Bristol');
  cy.provideCounty('South Glos');
  cy.providePostcode('BS8 1TG');
  cy.clickSaveAndContinue();

  cy.goToWholeSiteOwnerPage();
  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToAccessSitePage();
  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasNoIssues();
  cy.clickSaveAndContinue();

  cy.goToSubmissionPage();
});
When('the declaration is not agreed', () => {
  cy.doNotAgreeToTheDeclaration();
});
When('the declaration is agreed', () => {
  cy.task('listenToQueue');
  cy.agreeToTheDeclaration();
});

Then('the submission confirmation is presented', () => {
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((document) => {
    const applicationId = document.appeal.id;

    cy.request('http://localhost:3001/api/v1/' + applicationId).then((resp) => {
      expect(resp.status).to.eq(200);

      const documents = resp.body;
      let appealPdfDocument = null;
      documents.forEach((doc) => {
        if (doc.name === applicationId + '.pdf') {
          appealPdfDocument = doc;
        }
      });

      expect(appealPdfDocument).to.not.eq(null);
    });
  });
});

Then('no submission confirmation is presented', () => {
  cy.confirmAppealNotSubmitted();
  cy.confirmDeclarationAreRequired();
});
