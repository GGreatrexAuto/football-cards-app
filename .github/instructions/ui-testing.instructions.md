---
name: ui-component-testing
description: "Use when: writing component tests in football-cards-ui/src/**/*.test.tsx - React Testing Library patterns, mocking services, testing user interactions"
applyTo: "football-cards-ui/src/**/*.test.tsx"
---

# UI/Component Testing Context

## 📍 Scope

This applies to React component unit/integration tests in `football-cards-ui/src/**/*.test.tsx` files using React Testing Library + Jest.

These tests verify that **React components render correctly and respond properly to user interactions**, with all external services mocked for speed and isolation.

---

## 🔺 Where UI Tests Fit in Test Pyramid

```
          /\
         /E2E\              ← Few (real backend, Playwright)
        /------\            
       /  BDD   \           ← More (backend API with TestClient)
      /----------\          
     / Contracts  \         ← Property-based (API schema)
    /   (API)      \        
   /     UI       \         ← Many (MOCKED services, fast)
  /   Component    \        ← YOU ARE HERE
 / Tests           \
/   Unit Tests      \       ← Single functions (pytest/backend)
/====================\      
```

### Key Characteristics of UI Tests

| Aspect | Detail |
|--------|--------|
| **Purpose** | Test component rendering & user interactions |
| **Services** | ✓ ALL mocked (api.ts, storage.ts, axios) |
| **Backend** | Not running; all calls intercepted |
| **Speed** | ⚡ Fast (< 100ms per test) |
| **Count** | Many (~60-70% of frontend tests) |
| **Tools** | React Testing Library + Jest |
| **Database** | Not used; mocked local storage |

---

## ✅ What UI Tests MUST Cover

### 1. Rendering
- Component renders without errors
- Props are applied correctly
- Loading states display
- Error states display

### 2. User Interactions
- Button clicks trigger actions
- Form input changes update state
- Dropdowns open/close and select items
- Checkboxes toggle
- Text inputs update values

### 3. Form Validation
- Required fields show errors
- Email validation
- Number ranges (0-100 for stats)
- Custom validation rules

### 4. State Management
- Initial state is correct
- State updates on user interaction
- Derived state (calculated values)
- Context state updates

### 5. Conditional Rendering
- Elements show/hide based on conditions
- Disabled states work
- Visibility toggling

### 6. Integration with Context
- Context values are accessed correctly
- Context updates trigger re-renders
- Multiple consumers work together

### 7. Error Handling
- API errors display user-friendly messages
- Network failures are handled
- Invalid data is caught

---

## ❌ What UI Tests Should NOT Test

| Should NOT Test | Reason | Alternative |
|-----------------|--------|-------------|
| Real API calls | Tests are isolated, services mocked | Mock the service call |
| Backend business logic | That's integration tests | Test via integration tests |
| Real browser navigation (href links) | Use fixtures instead | E2E tests cover real navigation |
| Real database/storage | Mock local storage | Mock the storage.ts service |
| Authentication flows | Mock the auth service | E2E tests cover real auth |
| Payment/external APIs | Out of scope for MVP | Mock these services |

---

## 🎭 React Testing Library Principles

### Query Priority (use in this order)

```typescript
// 1. Queries that reflect user experience (BEST)
screen.getByRole('button', { name: /submit/i })           // Role + accessible name
screen.getByRole('textbox', { name: /email/i })           // For inputs
screen.getByRole('combobox', { name: /club/i })           // For selects

// 2. Queries tied to user intent
screen.getByLabelText(/player name/i)                     // Associated with label
screen.getByPlaceholderText(/search/i)                    // Placeholder text
screen.getByText(/submit/i)                               // Visible text
screen.getByTestId('unique-element')                      // Last resort, use sparingly

// 3. Queries to avoid (WORST - brittle)
screen.getByClass('.submit-button')                       // ❌ Class names change
screen.getByTag('div.card')                               // ❌ HTML structure changes
```

### Queries Available in RTL

```typescript
// Single element queries (throw if not found)
screen.getByRole(role, options?)
screen.getByLabelText(text, options?)
screen.getByPlaceholderText(text, options?)
screen.getByText(text, options?)
screen.getByTestId(id)

// Multiple element queries
screen.getAllByRole(role, options?)
screen.getAllByLabelText(text, options?)
screen.getAllByText(text, options?)

// Query* (returns null if not found)
screen.queryByRole(role, options?)
screen.queryByText(text, options?)

// findBy (async, waits for element)
screen.findByRole(role, options?)                         // Use with await
screen.findByText(text, options?)
```

---

## 📝 Component Test Structure

### Template

```typescript
// src/components/MyComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from './MyComponent';
import { CardProvider } from '../context/CardContext';
import * as apiService from '../services/api';
import * as storageService from '../services/storage';

// ==================== MOCKING ====================
// Mock all external services upfront

jest.mock('../services/api');
jest.mock('../services/storage');
jest.mock('axios');

// Mock return values
const mockClubs = [
  { id: 1, name: 'Arsenal' },
  { id: 2, name: 'Chelsea' },
];

// ==================== SETUP ====================
// Reset mocks before each test

beforeEach(() => {
  jest.clearAllMocks();
  (apiService.getClubs as jest.Mock).mockResolvedValue(mockClubs);
  (storageService.saveCard as jest.Mock).mockResolvedValue(undefined);
});

// ==================== TEST SUITE ====================

describe('MyComponent', () => {
  // Helper: render component with required providers
  const renderComponent = (props = {}) =>
    render(
      <CardProvider>
        <MyComponent {...props} />
      </CardProvider>,
    );

  // Test: Rendering
  test('renders without errors', () => {
    renderComponent();
    expect(screen.getByText(/my component/i)).toBeInTheDocument();
  });

  // Test: User interaction
  test('updates input value on user typing', () => {
    renderComponent();
    
    const input = screen.getByLabelText(/player name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(input.value).toBe('John Doe');
  });

  // Test: Async API call
  test('loads clubs from API and displays them', async () => {
    renderComponent();

    // Wait for API call to complete and dropdown to populate
    const clubOption = await screen.findByText('Arsenal');
    expect(clubOption).toBeInTheDocument();

    expect(apiService.getClubs).toHaveBeenCalledTimes(1);
  });

  // Test: Form validation
  test('shows validation error when submitting without required field', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/player name is required/i),
    ).toBeInTheDocument();
  });

  // Test: Callback/state
  test('calls onSave callback with form data when submitting', async () => {
    const onSave = jest.fn();
    renderComponent({ onSave });

    const nameInput = screen.getByLabelText(/player name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });

    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ playerName: 'Test Player' }),
      );
    });
  });
});
```

---

## 🔗 Mocking Patterns

### Mocking API Services

```typescript
// src/services/api.ts (real)
export const getClubs = async (): Promise<Club[]> => {
  const response = await apiClient.get('/clubs');
  return response.data;
};

// src/components/MyComponent.test.tsx (test)
jest.mock('../services/api');

beforeEach(() => {
  // Mock successful response
  (getClubs as jest.Mock).mockResolvedValue([
    { id: 1, name: 'Arsenal' },
  ]);

  // Or mock error
  (getClubs as jest.Mock).mockRejectedValue(
    new Error('API Error'),
  );

  // Or mock not being called
  (getClubs as jest.Mock).mockClear();
});

test('handles API error gracefully', async () => {
  (getClubs as jest.Mock).mockRejectedValue(new Error('Network error'));

  render(<MyComponent />);

  expect(
    await screen.findByText(/failed to load clubs/i),
  ).toBeInTheDocument();
});
```

### Mocking Local Storage

```typescript
jest.mock('../services/storage');

beforeEach(() => {
  (saveCard as jest.Mock).mockResolvedValue(undefined);
  (getSavedCards as jest.Mock).mockResolvedValue([
    { id: '1', playerName: 'Test' },
  ]);
});

test('saves card to storage', async () => {
  render(<CardForm />);

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(saveCard).toHaveBeenCalledWith(
      expect.objectContaining({ playerName: 'Test' }),
    );
  });
});
```

### Mocking Axios

```typescript
jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockAxios.create.mockReturnValue({
    get: jest.fn().mockResolvedValue({
      data: { id: 1, name: 'Arsenal' },
    }),
  } as any);
});
```

---

## ⏳ Async Testing Patterns

### Waiting for Async Operations

```typescript
// Wait for element to appear (API call completes, etc)
const element = await screen.findByText('Arsenal');

// Wait for condition with timeout
await waitFor(() => {
  expect(screen.getByText('Saved')).toBeInTheDocument();
}, { timeout: 3000 });

// Wait for specific interval
await waitFor(() => {
  expect(mockFunction).toHaveBeenCalled();
});
```

### Testing Async State

```typescript
test('displays loading spinner while API call is in progress', () => {
  // Mock a delayed API call
  (getClubs as jest.Mock).mockImplementation(
    () => new Promise(resolve => 
      setTimeout(() => resolve([...]), 100)
    )
  );

  render(<CardForm />);

  // Loading spinner should be visible
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('hides loading spinner after API call completes', async () => {
  render(<CardForm />);

  // Wait for spinner to disappear
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
```

---

## 🎯 Common Test Scenarios

### Scenario 1: Form Input & Validation

```typescript
test('shows validation error for empty required field', async () => {
  render(
    <CardProvider>
      <CardForm />
    </CardProvider>,
  );

  // Try to submit without filling required field
  const submitButton = screen.getByRole('button', { name: /save/i });
  fireEvent.click(submitButton);

  // Error message should appear
  expect(
    await screen.findByText(/player name is required/i),
  ).toBeInTheDocument();
});
```

### Scenario 2: Dropdown/Select Interaction

```typescript
test('selects club from dropdown', async () => {
  render(
    <CardProvider>
      <CardForm />
    </CardProvider>,
  );

  // Wait for API to populate dropdown
  const clubSelect = await screen.findByRole('combobox', { name: /club/i });

  // Open dropdown and select
  fireEvent.click(clubSelect);
  fireEvent.click(screen.getByText('Arsenal'));

  // Verify selection
  expect(clubSelect).toHaveValue('Arsenal');
});
```

### Scenario 3: API Error Handling

```typescript
test('displays error message when API fails', async () => {
  (getClubs as jest.Mock).mockRejectedValue(
    new Error('Network error'),
  );

  render(
    <CardProvider>
      <CardForm />
    </CardProvider>,
  );

  // Should display error message
  expect(
    await screen.findByText(/failed to load data/i),
  ).toBeInTheDocument();
});
```

### Scenario 4: Context Updates

```typescript
test('updates card context when form is submitted', async () => {
  let capturedContext: any;

  const ContextCapture = () => {
    capturedContext = useCard();
    return null;
  };

  render(
    <CardProvider>
      <CardForm />
      <ContextCapture />
    </CardProvider>,
  );

  const nameInput = screen.getByLabelText(/player name/i);
  fireEvent.change(nameInput, { target: { value: 'New Player' } });

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(capturedContext.card.playerName).toBe('New Player');
  });
});
```

---

## 🔍 Debugging Tips

### Print Component DOM

```typescript
test('debug test', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints rendered DOM to console
});
```

### Find Elements Programmatically

```typescript
test('debug selectors', () => {
  render(<MyComponent />);

  // List all buttons
  const buttons = screen.getAllByRole('button');
  buttons.forEach(btn => console.log(btn.textContent));

  // List all inputs
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach(input => console.log(input));
});
```

### Inspect Mock Calls

```typescript
test('debug mock calls', () => {
  (getClubs as jest.Mock).mockResolvedValue([]);

  render(<CardForm />);

  // How many times was it called?
  console.log(getClubs.mock.calls.length);

  // What arguments were passed?
  console.log(getClubs.mock.calls[0]);

  // What was returned?
  console.log(getClubs.mock.results[0].value);
});
```

---

## ✨ Best Practices

1. **Mock at the top level**: Mock all services before the test suite runs
2. **Use `beforeEach` for reset**: Clear mocks between tests
3. **Avoid `within()`**: Use `screen` directly when possible
4. **Prefer `getByRole`**: Most accessible and reflects user perspective
5. **Test behavior, not implementation**: Don't test internal state, test user actions
6. **Keep tests focused**: One test per behavior
7. **Use descriptive test names**: Describe what user does, not what code does
8. **Clean up after tests**: Close modals, clear timeouts, etc

---

## ⚠️ Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Testing implementation | Brittle tests break on refactor | Test user-facing behavior |
| Not awaiting async | Tests pass but don't wait for API | Use `await findBy*` or `waitFor` |
| Mocking too much | Tests don't catch real bugs | Mock only external services |
| Complex test setup | Hard to maintain | Extract helpers, use factories |
| Ignoring accessibility | Tests miss real user issues | Use `getByRole` and `aria-label` |
| Not clearing mocks | State bleeds between tests | Call `jest.clearAllMocks()` in `beforeEach` |

---

## 📚 References

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Mock Documentation](https://jestjs.io/docs/manual-mocks)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Kent C. Dodds - Testing React](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessible Queries](https://testing-library.com/docs/queries/about/#priority)
