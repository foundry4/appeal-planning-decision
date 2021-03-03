Cypress.Commands.add(
  'provideAcceptNotNecessaryCookies',
  require('./provideAcceptNotNecessaryCookies'),
);

Cypress.Commands.add(
  'provideRejectNotNecessaryCookies',
  require('./provideRejectNotNecessaryCookies'),
);

Cypress.Commands.add(
  'confirmAcceptedCookieBannerVisible',
  require('./confirmAcceptedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmRejectedCookieBannerVisible',
  require('./confirmRejectedCookieBannerVisible'),
);

Cypress.Commands.add(
  'confirmNoDecisionCookieBannerVisible',
  require('./confirmNoDecisionCookieBannerVisible'),
);

Cypress.Commands.add('confirmCookiePolicy', require('./confirmCookiePolicy'));
