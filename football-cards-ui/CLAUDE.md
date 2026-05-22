# Frontend (React + TypeScript) — Claude Code Context

Applies to all code under `football-cards-ui/src/` including component tests (`*.test.tsx`).

## Directory Layout

```
src/
├── components/          # React components — PascalCase.tsx + PascalCase.test.tsx
├── context/             # CardContext.tsx (global state)
├── services/
│   ├── api.ts           # Axios client (baseURL: http://localhost:8000/api/v1)
│   └── storage.ts       # localStorage wrapper (key: 'football-cards')
├── types/               # TypeScript interfaces
├── styles/              # Global CSS (print.css, etc.)
├── hooks/               # Custom hooks (use* prefix)
├── theme.ts             # MUI theme — customise here, not inline
├── App.tsx
└── index.tsx
```

## TypeScript — Strict Mode is ON

`tsconfig.json` has `"strict": true`. Rules:
- **No `any` types** — use explicit types or generics
- All function parameters and return types must be typed
- Unused variables are compile errors

```typescript
// correct
const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  setName(event.target.value);
};
```

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `CardForm.tsx` |
| Tests | Adjacent, same name | `CardForm.test.tsx` |
| Services/utils | `camelCase.ts` | `api.ts`, `storage.ts` |
| Interfaces | `PascalCase` | `CardState`, `CardFormProps` |
| Custom hooks | `use` prefix | `useCard()` |

## Component Structure

One component per file. Define the props interface before the component:

```typescript
interface CardFormProps {
  onSave: (card: Card) => void;
  initialCard?: Card;
}

const CardForm: React.FC<CardFormProps> = ({ onSave, initialCard }) => {
  // ...
};

export default CardForm;
```

## State Management — Context API

Global state lives in `src/context/CardContext.tsx`. Consume via the `useCard()` hook:

```typescript
const { card, updateCard, resetCard } = useCard();
```

`useCard()` throws if called outside `<CardProvider>` — always wrap components in tests.

## Material-UI Usage

- Import components from `@mui/material`, icons from `@mui/icons-material`
- Use `sx` prop for component-level styles
- Global theme customisation goes in `src/theme.ts` — not inline

## API Service

`src/services/api.ts` — axios instance with `baseURL: 'http://localhost:8000/api/v1'`. Wrap calls in try/catch and set loading/error state.

## Storage Service

`src/services/storage.ts` — thin localStorage wrapper. Key: `'football-cards'`. Always import from this module; never call `localStorage` directly in components.

---

## UI / Component Testing (`*.test.tsx`)

Tests use **React Testing Library + Jest** with **all external services mocked**. No backend required.

### Query Priority (use in this order)

```typescript
screen.getByRole('button', { name: /save/i })      // 1. role (best)
screen.getByLabelText(/player name/i)              // 2. label
screen.getByText(/submit/i)                        // 3. visible text
screen.getByTestId('unique-id')                    // 4. testid (last resort)
```

### Mocking Pattern

```typescript
// At file top — mock ALL external services
jest.mock('../services/api');
jest.mock('../services/storage');

// In beforeEach — reset and set return values
beforeEach(() => {
  jest.clearAllMocks();
  (getClubs as jest.Mock).mockResolvedValue([{ id: 1, name: 'Arsenal' }]);
});
```

### Async Patterns

```typescript
// Wait for element after async operation
const el = await screen.findByText('Arsenal');

// Wait for condition
await waitFor(() => expect(mockFn).toHaveBeenCalled());
```

### Test Template

```typescript
describe('CardForm', () => {
  const renderComponent = () =>
    render(<CardProvider><CardForm /></CardProvider>);

  test('shows validation error when name is empty', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
```

### What to Test
- Component renders without errors
- User interactions (clicks, form fills, dropdowns)
- Form validation messages
- Loading and error states
- Context state updates

### What NOT to Test
- Real API calls (mock them)
- Real localStorage (mock `storage.ts`)
- Backend business logic (covered by integration tests)

## Accessibility Requirements

Every new component must satisfy these before merging:

- Every interactive element has `aria-label` or an associated `<label>`
- Required fields declare `aria-required="true"`; invalid fields set `aria-invalid="true"` with `aria-describedby` pointing to the error element
- Error/success alerts use `role="alert"`; loading regions use `role="status"` and `aria-live="polite"`
- Related inputs (e.g. stats) are wrapped in `<fieldset>` with `<legend>`
- Meaningful images have descriptive `alt` text; decorative images use `alt=""`
- Dialogs trap focus on open and restore it to the trigger element on close

See `.github/instructions/frontend.instructions.md` for code patterns and `.github/instructions/ui-testing.instructions.md` for jest-axe assertion examples.

## New Component Checklist

- [ ] `ComponentName.tsx` with `ComponentNameProps` interface
- [ ] Default export for component, named exports for utilities
- [ ] Handle loading and error states
- [ ] **A11y**: ARIA attributes on all interactive elements (`aria-label`, `aria-required`, `aria-invalid`, `aria-describedby`)
- [ ] **A11y**: `role="alert"` on notifications; `role="status"` on loading regions
- [ ] **A11y**: `<fieldset>` + `<legend>` for grouped inputs
- [ ] `ComponentName.test.tsx` with mocked services including `toHaveNoViolations()` (jest-axe)
- [ ] No TypeScript errors: `tsc --noEmit`
- [ ] Tests pass: `npm test`
