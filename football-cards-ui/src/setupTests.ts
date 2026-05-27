// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

/**
 * MUI v7 + React 19 compatibility: MUI's SelectInput and Tooltip components
 * call setState from callback refs and Popper positioning effects during
 * React's commit phase. In React 19, these state updates fire in the gap
 * between the commit phase ending and act()'s cleanup, triggering a spurious
 * "not wrapped in act()" warning for internal MUI state that tests cannot
 * control. This filter suppresses only those known-safe MUI internal warnings
 * while allowing all other act() violations to surface normally.
 *
 * Upstream issue: https://github.com/mui/material-ui/issues/43568
 */
const originalConsoleError = console.error.bind(console);
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    const isMuiActWarning =
      message.includes('inside a test was not wrapped in act(') &&
      (message.includes('ForwardRef(SelectInput)') ||
        message.includes('ForwardRef(Tooltip)') ||
        message.includes('ForwardRef(Popper)'));
    if (isMuiActWarning) return;
    originalConsoleError(...args);
  });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});
