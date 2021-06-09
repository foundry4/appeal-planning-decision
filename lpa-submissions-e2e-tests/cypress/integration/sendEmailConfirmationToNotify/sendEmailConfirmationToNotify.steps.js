import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('a confirmation email is sent to the LPA', () => {
  cy.verifyPage('information-submitted');
  if (!Cypress.env('ASSUME_LIMITED_ACCESS')) {
    cy.request('GET', `${Cypress.env('EMAIL_NOTIFICATION_URL')}`).then((response) => {
      const lastEmailNotificationOnTheStack = response.body.length - 1;
      const emailNotification = response.body[lastEmailNotificationOnTheStack];
      expect(emailNotification.template_id).to.eq('937b4147-8420-42da-859d-d4a65bdf99bc');
      expect(emailNotification.email_address).to.eq('abby.bale@planninginspectorate.gov.uk');

      expect(Object.keys(emailNotification.personalisation).length).to.eq(4);
      expect(emailNotification.personalisation['Planning appeal number']).to.eq('fake-horizon-id');
      expect(emailNotification.personalisation['Name of local planning department']).to.eq(
        'System Test Borough Council',
      );
      expect(emailNotification.personalisation['Planning application number']).to.eq(
        'ValidNumber/12345',
      );

      expect(
        Object.keys(emailNotification.personalisation['link to appeal questionnaire pdf']).length,
      ).to.eq(2);
      expect(
        emailNotification.personalisation['link to appeal questionnaire pdf'].file.length,
      ).to.be.gt(1);
      expect(emailNotification.personalisation['link to appeal questionnaire pdf'].is_csv).to.eq(
        false,
      );

      expect(emailNotification.reference).to.eq(
        '15549118-106f-4394-95c6-c63887b7d4c9.SubmissionConfirmation',
      );
      expect(emailNotification.email_reply_to_id).to.eq('f1e6c8c5-786e-41ca-9086-10b67f31bc86');
      expect(response.status).to.eq(200);
    });
  }
});