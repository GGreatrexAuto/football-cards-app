# Backend Development Plan

This document outlines the detailed plan for developing the backend of the Football Cards application, aligning with Phase 2 of the `ARCHITECTURAL_PLAN.md`.

## 1. Project Scaffolding

The initial setup will create a clean, organized, and reproducible project structure.

*   **Virtual Environment:** A Python virtual environment will be created in a `.venv` directory to isolate project dependencies. All subsequent commands will be run within this environment.

*   **Dependency Management:** Project dependencies will be managed in a `requirements.txt` file. Initial dependencies will include:
    *   `fastapi`: The core web framework.
    *   `uvicorn`: The ASGI server to run the application.
    *   `pydantic`: For data validation and settings management.
    *   `requests` (or `httpx`): For making requests to the external football API.
    *   `pytest`: For unit testing.
    *   `schemathesis`: For API contract testing.
    *   `behave`: For integration testing.
    *   `black`, `isort`, `flake8`, `pylint`: For code linting and formatting.

*   **Directory Structure:** The backend code will be organized as follows:

    ```
    .
    ├── app/
    │   ├── __init__.py
    │   ├── main.py         # FastAPI application entry point
    │   ├── api/
    │   │   ├── __init__.py
    │   │   ├── endpoints/  # API endpoint definitions
    │   │   │   ├── __init__.py
    │   │   │   └── proxy.py
    │   │   └── models.py     # Pydantic models for API requests/responses
    │   ├── core/
    │   │   ├── __init__.py
    │   │   └── config.py     # Application configuration
    │   └── services/
    │       ├── __init__.py
    │       └── football_api.py # Logic for interacting with the external API
    ├── tests/
    │   ├── __init__.py
    │   ├── contract/
    │   ├── integration/
    │   └── unit/
    └── requirements.txt
    ```

## 2. API Design & Implementation (API Proxy)

The backend's primary role in the MVP is to act as a proxy to a free public football API. This avoids exposing API keys to the frontend and allows for caching.

*   **Framework:** We will use **FastAPI** for its modern features, automatic documentation, and Pydantic integration.

*   **Pydantic Models:** All data moving in and out of the API will be validated using Pydantic models defined in `app/api/models.py`. This ensures data integrity and provides clear, auto-generated API documentation.

*   **Endpoints:** The following RESTful endpoints will be created under the `/api/v1` path.

    *   `GET /api/v1/clubs`:
        *   **Purpose:** Fetch a list of football clubs.
        *   **Response Body:** A JSON array of club objects, e.g., `[{ "id": "123", "name": "Real Madrid" }]`.

    *   `GET /api/v1/nations`:
        *   **Purpose:** Fetch a list of nationalities.
        *   **Response Body:** A JSON array of nation objects, e.g., `[{ "id": "45", "name": "Spain" }]`.

    *   `GET /api/v1/leagues`:
        *   **Purpose:** Fetch a list of leagues.
        *   **Response Body:** A JSON array of league objects, e.g., `[{ "id": "789", "name": "La Liga" }]`.

*   **Service Layer:** The logic for fetching data from the external API, including handling API keys and any data transformation, will be encapsulated in `app/services/football_api.py`.

*   **Caching:** A simple in-memory cache will be implemented to store responses from the external API for a short duration (e.g., 1 hour). This will reduce latency and prevent hitting API rate limits.

## 3. Testing Strategy

Testing will be a critical part of the development process, following the test pyramid model.

*   **Unit Tests (`pytest`):**
    *   **Location:** `tests/unit/`
    *   **Scope:** Test individual functions and classes in isolation. We will mock external services, like the football API client, to ensure tests are fast and reliable. Focus will be on the service layer and any utility functions.

*   **Contract Tests (`schemathesis`):**
    *   **Location:** `tests/contract/`
    *   **Scope:** Automatically generate and run tests against the OpenAPI schema produced by FastAPI. This will validate that our API implementation adheres to its own specification, checking for edge cases and potential crashes.

*   **Integration Tests (`behave`):**
    *   **Location:** `tests/integration/`
    *   **Scope:** Test the application's components working together. These BDD-style tests will cover user stories from an API perspective, such as "when a client requests the list of clubs, the API should return a successful response containing club data." These tests will run against a live instance of our application but will use a mock of the external football API to ensure deterministic results.

## 4. Linting and Formatting

To maintain code quality and consistency, we will enforce a strict set of linting rules.

*   **Tools:** `black` for code formatting, `isort` for import sorting, `flake8` for style enforcement, and `pylint` for static code analysis.
*   **Configuration:** Configuration files (`.flake8`, `.pylintrc`) will be added to the project root to ensure consistent behavior across all development environments.
*   **Workflow:** Linters will be run as a pre-commit hook and in the CI pipeline to catch issues early.
