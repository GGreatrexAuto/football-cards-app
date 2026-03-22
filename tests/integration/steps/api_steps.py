from unittest.mock import patch

from behave import given, then, when  # pylint: disable=import-error


@given("the application is running")  # pylint: disable=not-callable
def step_given_app_is_running(context):
    """
    This step is a placeholder for ensuring the test client is ready.
    The actual client is set up in environment.py.
    """
    assert context.client is not None


@when('I make a GET request to "{endpoint}"')  # pylint: disable=not-callable
def step_when_make_get_request(context, endpoint):
    context.response = context.client.get(endpoint)


@then("the response status code should be {status_code:d}")  # pylint: disable=E1102
def step_then_status_code(context, status_code):
    assert context.response.status_code == status_code


@then("the response should be a JSON array")  # pylint: disable=not-callable
def step_then_json_array(context):
    response_json = context.response.json()
    assert isinstance(response_json, list)


@then('each item in the array should have an "id" and "name"')  # pylint: disable=E1102
def step_then_each_item_has_id_and_name(context):
    response_json = context.response.json()
    for item in response_json:
        assert "id" in item
        assert "name" in item


@given("the external API is unavailable")  # pylint: disable=not-callable
def step_given_external_api_unavailable(context):
    context.mock_patch = patch(
        "app.services.football_api.get_clubs", side_effect=Exception("API is down")
    )
    context.mock_patch.start()


@then("the response should contain an error message")  # pylint: disable=not-callable
def step_then_response_contains_error(context):
    response_json = context.response.json()
    assert "detail" in response_json
