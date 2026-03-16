# Repository-Level Gemini Configuration

This file is for project-specific instructions and preferences for the Gemini CLI.

## Project Overview

*   **Name**: Football Cards App
*   **Description**: A web application for creating Ultimate team football/soccer style trading cards. See `REQUIREMENTS.md` for detailed functional requirements.
*   **Primary Language**: 
        - Python backend
        - React (TypeScript)

## Key Libraries & Frameworks

*   **Backend**: FastAPI
*   **Database**: None for MVP (using browser Local Storage).
*   **Frontend**: React, Material-UI

## Architectural Patterns

*   **Structure**: The project follows a standard Model-View-Controller (MVC) pattern.
*   **API**: The backend exposes a RESTful API for the frontend to consume.
*   **Frontend**: The frontend will be a single-page application (SPA) built with React, consuming the backend's RESTful API.
*   **Code Style**: Adhere to the existing code style. Use `black`, `flake8`, `pylint` and `isort` for formatting.

## Testing Strategy
All tests have an appropriate place on the test pyramid, tests should be shifted left wherever possible.

*   **Unit Tests**: Use `pytest` for unit tests. Test files are located in the `tests/unit` directory and should mirror the structure of the application code.
*   **Contract Tests**: API contracts should be tested using schemathesis `tests/contract`
*   **Integration Tests**: Integration tests are written with `behave` and are located in `tests/integration`.
*   **UI Tests**: Front end app tests should implemment `playwright` and are located in `tests/ui` 
*   **CI/CD**: To be decided, but we would be looking for a low cost / free option