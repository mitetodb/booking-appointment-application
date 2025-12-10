# 🧪 Testing Guide

This project uses **Vitest** and **React Testing Library** for unit testing.

## 📦 Test Dependencies

- **Vitest** - Fast test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for tests

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm run test:ui
```

## 📁 Test Structure

Tests are located next to the files they test:

```
utils/
  ├── validation.js
  └── validation.test.js

components/
  └── common/
      ├── Loading.jsx
      └── Loading.test.jsx
```

## ✅ Test Coverage

### Current Test Coverage

- **Validation Utilities** (`utils/validation.test.js`)
  - ✅ Email validation
  - ✅ Password validation
  - ✅ Name validation
  - ✅ URL validation
  - ✅ Time validation
  - ✅ Date validation
  - ✅ UUID validation
  - ✅ Appointment type validation
  - ✅ Payment type validation
  - ✅ Helper functions (sanitize, parse, etc.)
  - **Total: 57 tests**

- **Date Utilities** (`utils/dateUtils.test.js`)
  - ✅ Locale conversion
  - ✅ Date formatting
  - ✅ Date input value conversion
  - ✅ Error handling
  - **Total: 17 tests**

- **React Components**
  - ✅ `NotFoundPage` - 4 tests
  - ✅ `Loading` - 4 tests
  - **Total: 8 tests**

**Grand Total: 82 tests** ✅

## 🧩 Test Examples

### Testing Utility Functions

```javascript
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validation';

describe('validateEmail', () => {
  it('should return valid for a valid email', () => {
    expect(validateEmail('test@example.com')).toEqual({ valid: true });
  });

  it('should return invalid for invalid email', () => {
    expect(validateEmail('invalid')).toEqual({ 
      valid: false, 
      error: 'Invalid email format' 
    });
  });
});
```

### Testing React Components

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 📝 Writing New Tests

### Guidelines

1. **Test file naming**: Use `.test.js` or `.test.jsx` extension
2. **Test location**: Place test files next to the files they test
3. **Test structure**: Use `describe` blocks for grouping related tests
4. **Test names**: Use descriptive test names that explain what is being tested
5. **Assertions**: Use clear, specific assertions

### Example Test Template

```javascript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './fileToTest';

describe('functionToTest', () => {
  it('should handle valid input', () => {
    const result = functionToTest('valid input');
    expect(result).toBe(expected);
  });

  it('should handle invalid input', () => {
    const result = functionToTest(null);
    expect(result).toEqual({ valid: false, error: 'Error message' });
  });

  it('should handle edge cases', () => {
    const result = functionToTest('');
    expect(result).toBeDefined();
  });
});
```

## 🔍 Test Configuration

Configuration is in `vitest.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
    css: true,
    include: ['**/*.{test,spec}.{js,jsx}'],
  },
});
```

The setup file (`test/setup.js`) configures:
- Cleanup after each test
- Jest DOM matchers

## 📊 Continuous Integration

Tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --run
```

## 🎯 Best Practices

1. **Test behavior, not implementation**: Test what the function/component does, not how it does it
2. **Test edge cases**: Test invalid inputs, null values, empty strings, etc.
3. **Keep tests simple**: Each test should test one thing
4. **Use descriptive names**: Test names should describe what is being tested
5. **Test error cases**: Don't just test happy paths
6. **Mock external dependencies**: Use mocks for API calls, timers, etc.

## 🚧 Future Test Additions

Potential areas for additional tests:

- [ ] More component tests (forms, modals)
- [ ] Custom hooks tests (`useAuth`, `useTranslation`)
- [ ] Integration tests for user flows
- [ ] E2E tests with Playwright or Cypress
- [ ] API service tests (with mocks)

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

