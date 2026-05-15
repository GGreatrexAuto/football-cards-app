Feature: External API smoke tests

  Scenario: Health endpoint reports external API status
    Given the application is running
    When I make a GET request to "/api/v1/health"
    Then the response status code should be 200
    And the response should include an "external_api" field

  @external
  Scenario: Football-Data.org API returns leagues data
    Given the application is running
    And the Football-Data.org API key is configured
    When I make a GET request to "/api/v1/leagues"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"

  @external
  Scenario: Football-Data.org API returns nations data
    Given the application is running
    And the Football-Data.org API key is configured
    When I make a GET request to "/api/v1/nations"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"

  @external
  Scenario: Football-Data.org API returns clubs with league IDs
    Given the application is running
    And the Football-Data.org API key is configured
    When I make a GET request to "/api/v1/clubs"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"
    And each item in the array should have a "league_id" field
