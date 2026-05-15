Feature: Positions API
  Scenario: Successful data retrieval for positions
    Given the application is running
    When I make a GET request to "/api/v1/positions"
    Then the response status code should be 200
    And the response should be a JSON array
    And each item in the array should have a "code" field
    And each item in the array should have a "name" field
