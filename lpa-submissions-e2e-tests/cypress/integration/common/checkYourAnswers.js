import { Given, Before } from 'cypress-cucumber-preprocessor/steps';
import { getSubTaskInfo } from '../../support/common/subTasks';

const pageId = 'confirm-answers'

const preCannedAppeal = require('../../fixtures/anAppeal.json');

let currentSubTask = {};

Before(() => {
  currentSubTask = {};
});

Given('a change to answer {string} is requested from Change your answers page', (answer) => {
  cy.insertAppealAndCreateReply(preCannedAppeal.appeal).as('appealReply');

  cy.get('@appealReply').then( (appealReply) => {
    cy.goToCheckYourAnswersPage(appealReply.appealId);
    currentSubTask = getSubTaskInfo(answer);
    cy.clickOnSubTaskLink(currentSubTask.id);
  });
});

Then('progress is made to the Check Your Answers page', () => {
  cy.verifyPage(pageId);
});
