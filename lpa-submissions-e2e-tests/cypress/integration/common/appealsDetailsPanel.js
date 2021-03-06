Then('the appeal details panel is displayed on the right hand side of the page', () => {
  cy.get('@appeal').then((appeal) => {
    const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

    cy.verifyAppealDetailsSidebar({
      applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
      applicationAddress: address.join(', '),
      apellantName: appeal.aboutYouSection.yourDetails.name,
    });
  });
});
