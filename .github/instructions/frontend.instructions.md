---
name: frontend-react
description: "Use when: building React components in football-cards-ui/src/ - TypeScript strict mode, Context API patterns, Material-UI, component structure"
applyTo: "football-cards-ui/src/**"
---

# Frontend (React + TypeScript) Context

## 📍 Scope
This applies to all TypeScript/React code in `football-cards-ui/src/` directory.

---

## 🔒 TypeScript Strict Mode

**Strict mode is ENABLED in `tsconfig.json`** - all type checking features are active:

```json
{
  "compilerOptions": {
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Strict Mode Rules
- **No `any` types**: Use explicit types or generics instead
- **Type everything**: All parameters, return types, and variables
- **All properties optional?** Explicitly use `?` or union types
- **Unused variables**: Will cause compilation errors

```typescript
// ✅ CORRECT: explicit types
const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  setName(event.target.value);
};

// ❌ WRONG: using 'any'
const handleChange = (event: any) => {
  setName(event.target.value);
};
```

---

## 📁 File Structure & Naming

### Directory Organization
```
src/
├── components/           # React components (PascalCase.tsx)
│   ├── CardForm.tsx
│   ├── CardForm.test.tsx
│   ├── CardPreview.tsx
│   └── CardPreview.test.tsx
├── context/              # React Context (e.g., CardContext.tsx)
│   ├── CardContext.tsx
│   └── CardContext.test.tsx
├── services/             # API & storage services (camelCase.ts)
│   ├── api.ts
│   ├── api.test.ts
│   ├── storage.ts
│   └── storage.test.ts
├── types/                # TypeScript definitions (camelCase.ts)
├── styles/               # Global & shared CSS
│   └── print.css
├── App.tsx               # Root component
├── index.tsx             # Entry point
└── theme.ts              # MUI theme configuration
```

### Naming Conventions
- **Components**: `PascalCase.tsx` (e.g., `CardForm.tsx`)
- **Utilities/Services**: `camelCase.ts` (e.g., `api.ts`, `storage.ts`)
- **Tests**: Adjacent to source file: `ComponentName.test.tsx`
- **Types/Interfaces**: `PascalCase` (e.g., `CardState`, `CardContextType`)

---

## ⚛️ React Component Patterns

### Component Structure
One component per file. Define props interface before component:

```typescript
// src/components/CardForm.tsx
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

interface CardFormProps {
  onSave: (card: Card) => void;
  initialCard?: Card;
}

const CardForm: React.FC<CardFormProps> = ({ onSave, initialCard }) => {
  const [name, setName] = useState(initialCard?.playerName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ playerName: name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Player Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit">Save</Button>
    </form>
  );
};

export default CardForm;
```

**Key Patterns**:
- Define `interface ComponentNameProps` for all props
- Use `React.FC<Props>` for type safety
- Add prop descriptions in JSDoc comments
- Default exports for components
- Named exports for utilities

### Hooks Pattern
Custom hooks start with `use` prefix:

```typescript
// ✅ CORRECT: custom hook naming
const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within CardProvider');
  }
  return context;
};

// ✅ USAGE in component
const { card, updateCard } = useCard();
```

---

## 🎨 Material-UI Usage

### Import Pattern
```typescript
import {
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
```

### Styling
- Use MUI `sx` prop for component-level styles
- Use emotion/styled for complex styled components
- Customize globally in `src/theme.ts`

```typescript
// ✅ CORRECT: sx prop for MUI components
<Box
  sx={{
    display: 'flex',
    gap: 2,
    padding: 2,
    backgroundColor: 'background.paper',
  }}
>

// ✅ CORRECT: custom theme in theme.ts
export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});
```

---

## 📦 State Management (Context API)

### Pattern: Context + Custom Hook
**File: `src/context/CardContext.tsx`**

```typescript
import React, { createContext, useContext, useState } from 'react';

// 1. Define state interface
export interface CardState {
  playerName: string;
  club: string;
  rating: number;
  cardId: string | null;
}

// 2. Define context type
interface CardContextType {
  card: CardState;
  updateCard: (updates: Partial<CardState>) => void;
  resetCard: () => void;
}

// 3. Create context with undefined default
const CardContext = createContext<CardContextType | undefined>(undefined);

// 4. Create Provider component
export const CardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [card, setCard] = useState<CardState>(initialState);

  const updateCard = (updates: Partial<CardState>) => {
    setCard((prev) => ({ ...prev, ...updates }));
  };

  const resetCard = () => {
    setCard(initialState);
  };

  return (
    <CardContext.Provider value={{ card, updateCard, resetCard }}>
      {children}
    </CardContext.Provider>
  );
};

// 5. Create custom hook for consuming context
export const useCard = (): CardContextType => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within CardProvider');
  }
  return context;
};
```

### Usage in Components
```typescript
const MyComponent: React.FC = () => {
  const { card, updateCard } = useCard();

  return (
    <TextField
      value={card.playerName}
      onChange={(e) => updateCard({ playerName: e.target.value })}
    />
  );
};
```

---

## 🌐 API Service Pattern

**File: `src/services/api.ts`**

```typescript
import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Define interfaces for API responses
export interface Club {
  id: number;
  name: string;
}

// Async functions with try/catch
export const getClubs = async (): Promise<Club[]> => {
  try {
    const response = await api.get('/clubs');
    return response.data;
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
};
```

### Error Handling in Components
```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const clubs = await getClubs();
      setClubs(clubs);
    } catch (error) {
      setError('Failed to load clubs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

---

## 💾 Storage Service Pattern

**File: `src/services/storage.ts`**

Uses Browser Local Storage for MVP (no backend database):

```typescript
import { Card } from '../types/Card';

const STORAGE_KEY = 'football-cards';

export const saveCard = (card: Card): void => {
  const cards = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  cards.push(card);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const getCards = (): Card[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};
```

---

## 🧪 Component Testing

**Pattern: React Testing Library + Jest**

```typescript
// src/components/CardForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardForm from './CardForm';
import { CardProvider } from '../context/CardContext';

describe('CardForm Component', () => {
  const renderWithProvider = () =>
    render(
      <CardProvider>
        <CardForm />
      </CardProvider>,
    );

  test('renders player name input', async () => {
    renderWithProvider();
    expect(await screen.findByLabelText(/Player Name/i)).toBeInTheDocument();
  });

  test('updates input value on change', async () => {
    renderWithProvider();
    const input = (await screen.findByLabelText(/Player Name/i)) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Test Player' } });
    expect(input.value).toBe('Test Player');
  });

  test('shows loading spinner while fetching', () => {
    renderWithProvider();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

**Key Patterns**:
- Test file adjacent to component: `CardForm.test.tsx`
- Wrap components with providers in tests
- Use `screen.findByLabelText()` for accessibility
- Mock API calls with Jest mocks
- Test user interactions, not implementation

---

## 📋 Quick Checklist

When creating a new component:
- [ ] Create `ComponentName.tsx` with PascalCase naming
- [ ] Define `ComponentNameProps` interface
- [ ] Export as default export
- [ ] Add JSDoc comments for complex props
- [ ] Create `ComponentName.test.tsx` with tests
- [ ] Use MUI components consistently
- [ ] Handle loading and error states
- [ ] Use `useCard()` for shared state when needed
- [ ] Run tests: `npm test`
- [ ] No TypeScript errors: `tsc --noEmit`
