module.exports = () => {
  return cy.get('@appealReply').then((appealReply) => appealReply.id);
};
