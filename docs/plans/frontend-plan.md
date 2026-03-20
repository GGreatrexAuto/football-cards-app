# Frontend Implementation Plan (Phase 3)

This document outlines the detailed plan for implementing the frontend of the Football Cards application, as per the `ARCHITECTURAL_PLAN.md` and `REQUIREMENTS.md`.

## 1. Project Scaffolding & Setup (Task 10)

1.  **Initialize Project:**
    *   Use `npx create-react-app football-cards-ui --template typescript` to create the React project.
2.  **Install Dependencies:**
    *   **Core:** `react`, `react-dom`
    *   **UI:** `@mui/material`, `@emotion/react`, `@emotion/styled`
    *   **API Communication:** `axios`
    *   **Development:** `@types/react`, `@types/react-dom`, `eslint`, `prettier`
3.  **Configure Linting:**
    *   Set up ESLint and Prettier to enforce the project's coding style, following the rules defined in the architectural plan.

## 2. Component-Based Architecture (Task 11)

The UI will be broken down into the following reusable components:

*   **`App.tsx`**: The root component, responsible for overall layout and routing (if needed in the future).
*   **`CardCreator.tsx`**: The main container for the card creation and editing interface.
    *   **`CardForm.tsx`**: A controlled component containing all form inputs for card customization.
        *   **Inputs**: Text fields, dropdowns (`<Select>`), and buttons for player details and stats.
        *   **Actions**: Handles user input and triggers state updates.
    *   **`CardPreview.tsx`**: A component that visually represents the football card.
        *   **Content**: Displays player name, stats, photo, and background based on the current state.
        *   **Styling**: Styled with Material-UI to look like a trading card.
*   **`CardGallery.tsx`**: A view to display all cards saved in Local Storage.
    *   Each card in the gallery will be a clickable/tappable item, which could load it back into the `CardCreator` for editing.
*   **`PrintableCard.tsx`**: A dedicated component, hidden from the main view, formatted specifically for printing via CSS.

## 2.1 UI/UX and Branding Implementation

The following guidelines from the `ARCHITECTURAL_PLAN.md` will be implemented:

*   **Color Palette:**
    *   A Material-UI theme will be created to use the defined color palette throughout the application.
    *   The primary color (`#1976D2`) will be used for buttons, links, and other interactive elements.
    *   The secondary color (`#FFC107`) will be used for highlights and accents.
*   **Typography:**
    *   The Material-UI theme will be configured to use `Roboto` as the default font.
    *   `Typography` components will be used to ensure consistent font styles for headings and body text.
*   **Card Design:**
    *   The `CardPreview.tsx` component will be styled using Material-UI's `Card` and `CardContent` components.
    *   The card background will be a CSS gradient using the primary and secondary colors.
    *   The player's name will be displayed using a `Typography` component with a `h5` variant.
    *   The stats will be displayed using `Typography` components with a `body1` variant.
*   **Iconography:**
    *   Material Icons will be imported and used as React components. For example, the "Randomize" button will use the `Casino` icon.

## 3. Services and State Management (Task 11)

*   **State Management:**
    *   Utilize React's `useState`, `useEffect`, and `useContext` hooks for managing local and global state.
    *   A `CardContext` will be created to provide the `currentCard` state and updater functions to the `CardForm` and `CardPreview` components, avoiding prop-drilling.
*   **API Service (`src/services/api.ts`):**
    *   A dedicated module using `axios` to interact with the backend's FastAPI proxy.
    *   Will contain functions like `getClubs()`, `getNationalities()`, etc., to populate the form's dropdowns.
*   **Local Storage Service (`src/services/storage.ts`):**
    *   A module to abstract all interactions with the browser's `localStorage`.
    *   Will include functions:
        *   `saveCard(cardData)`: Saves a single card.
        *   `getSavedCards()`: Retrieves all saved cards.
        *   `updateCard(cardId, cardData)`: Updates an existing card.
        *   `deleteCard(cardId)`: Deletes a specific card.

## 4. Feature Implementation (as per `REQUIREMENTS.md`)

*   **1. Card Creation & Editing (`CardCreator.tsx`):**
    *   **1.2 Player Name:** A Material-UI `<TextField>`.
    *   **1.3 Player Attributes:** Material-UI `<Select>` components, populated by the `api.ts` service.
    *   **1.4 Player Stats:** `<TextField>` components for manual entry and a `<Button>` to trigger a randomization function.
    *   **1.5 Calculated Total:** A read-only field that updates automatically whenever DEF, CTRL, or ATT change. The calculation `(DEF + CTRL + ATT) / 3` will be performed within the `CardCreator` component.
    *   **1.6 Player Photo:**
        *   Use a `<input type="file">` for local uploads.
        *   A `<TextField>` for image URLs.
        *   A set of selectable default images.
    *   **1.7 Card Background:** A grid or list of selectable background images.
*   **2. Card Storage (`CardGallery.tsx` & `storage.ts`):**
    *   **2.1 Save Button:** A `<Button>` in `CardCreator.tsx` that calls `storage.ts:saveCard()`.
    *   **2.3 Retrieve Cards:** The `CardGallery.tsx` component will call `storage.ts:getSavedCards()` on mount to display the saved cards.
*   **3. Card Output (`PrintableCard.tsx`):**
    *   **3.1 Print Button:** A `<Button>` that uses `window.print()` to open the print dialog.
    *   **Print Styling:** A dedicated CSS file (`print.css`) will be used with `@media print` rules to ensure only the `PrintableCard` component is visible and correctly sized for printing.

## 5. Security Considerations

*   **Preventing Injection Attacks:**
    *   All data from user-controlled, free-text input fields (e.g., Player Name, Image URL) will be treated as untrusted.
    *   React automatically escapes data rendered in JSX, which is the primary defense against Cross-Site Scripting (XSS) attacks. We will rely on this behavior and avoid using `dangerouslySetInnerHTML`.
    *   For the Image URL field, additional validation will be performed to ensure the URL points to a valid image file and does not contain malicious scripts (e.g., by checking the protocol and file extension).

## 6. Frontend Testing (Task 12)

*   **Unit/Component Tests:**
    *   Use `React Testing Library` and `Jest` to test individual components in isolation.
    *   **Examples:**
        *   Test that the "Rating" stat calculates correctly when input stats change.
        *   Test that form inputs correctly update the application's state.
        *   Mock the `api.ts` and `storage.ts` services to test components that rely on them.
*   **End-to-End (E2E) Tests:**
    *   Use `Playwright` to write E2E tests for critical user flows.
    *   **Scenarios:**
        1.  **Full Card Creation:** A user fills out all fields, randomizes stats, uploads a photo, and saves the card.
        2.  **View and Load Saved Card:** A user navigates to the gallery, sees the newly created card, and loads it back into the editor.
        3.  **Print a Card:** A user creates a card and clicks the "Print" button (test will verify the print dialog is invoked).

This plan will be executed in Phase 3 of the project.
