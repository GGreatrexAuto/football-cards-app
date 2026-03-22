Feature: Nations API
  Scenario: Successful data retrieval for nations
    Given the application is running
    When I make a GET request to "/api/v1/nations"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have an "id" and "name"
