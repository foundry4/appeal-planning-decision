@wip
Feature: Cookie consent bar

  As a performance analyst working on the appeals service
  I want users to be able to say Yes to GA cookies
  So that I will receive analytics data for the service

  @as-98 @as-98-1a
  Scenario: Cookie banner available until actioned - no decision
    Given a user has not previously submitted cookie preferences
    When the user neither accepts nor rejects not necessary cookies
    Then the cookie banner remains visible

  @as-98 @as-98-1b
  Scenario: Cookie banner available until actioned - accepted
    Given a user has not previously submitted cookie preferences
    When the user accepts not necessary cookies
    Then the accepted cookie banner becomes visible

  @as-98 @as-98-1c
  Scenario: Cookie banner available until actioned - rejected
    Given a user has not previously submitted cookie preferences
    When the user rejects not necessary cookies
    Then the rejected cookie banner becomes visible

  @as-98 @as-98-2
  Scenario: Accept not necessary cookies
    Given a user has not previously submitted cookie preferences
    When the user accepts not necessary cookies
    Then the GA cookies are enabled

  @as-98 @as-98-3
  Scenario: Reject Not necessary Cookies
    Given a user has not previously submitted cookie preferences
    When the user rejects not necessary cookies
    Then the GA cookies remain disabled
