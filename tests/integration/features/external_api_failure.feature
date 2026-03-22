Feature: External API Failure
  Scenario: External API failure returns appropriate error response
    Given the application is running
    And the external API is unavailable
    When I make a GET request to "/api/v1/clubs"
    Then the response status code should be 503
    And the response should contain an error message
