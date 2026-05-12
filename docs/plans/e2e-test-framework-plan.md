#### E2E Test Base Framework Setup Plan

**Objective:** Establish a robust, maintainable E2E testing foundation using Playwright that supports the football-cards application's testing needs.

**Key Components:**

1. **Playwright Configuration Setup**
   - [ ] Create `playwright.config.ts` in `football-cards-ui/` root
   - [ ] Configure test directory: `tests/e2e/`
   - [ ] Set base URL to `http://localhost:3000` (React dev server)
   - [ ] Configure browsers: Chromium, Firefox, WebKit
   - [ ] Set test timeout: 30 seconds
   - [ ] Enable video recording for failed tests
   - [ ] Configure screenshot capture on failure
   - [ ] Set up parallel test execution (2 workers)
   - [ ] Configure retries: 2 for CI, 0 for local
   - [ ] Add global setup/teardown hooks

2. **Base Test Infrastructure**
   - [ ] Create `tests/e2e/base/` directory for shared utilities
   - [ ] Create `tests/e2e/base/test-base.ts` - base test class with common setup
   - [ ] Create `tests/e2e/base/page-objects/` directory
   - [ ] Create `tests/e2e/base/fixtures/` directory for test data
   - [ ] Create `tests/e2e/base/helpers/` directory for utility functions

3. **Page Object Models (POM)**
   - [ ] Create `CardCreatorPage.ts` - encapsulates card creation form interactions
   - [ ] Create `CardGalleryPage.ts` - encapsulates gallery view interactions  
   - [ ] Create `CardPreviewPage.ts` - encapsulates card preview interactions
   - [ ] Create `NavigationPage.ts` - encapsulates app navigation
   - [ ] Define consistent locator strategies (data-testid, aria-label, text content)
   - [ ] Implement fluent API patterns for better test readability

4. **Test Data Management**
   - [ ] Create `tests/e2e/fixtures/test-data.ts` with sample card data
   - [ ] Create `tests/e2e/fixtures/api-mock-data.ts` for backend API responses
   - [ ] Implement data builders for generating test variations
   - [ ] Create test data cleanup utilities

5. **Environment Configuration**
   - [ ] Create `.env.test` for test-specific environment variables
   - [ ] Configure backend API URL for tests
   - [ ] Set up test database isolation (if needed)
   - [ ] Configure test user credentials/data

6. **Test Utilities & Helpers**
   - [ ] Create `waitForAppReady()` helper for app initialization
   - [ ] Create `clearLocalStorage()` helper for test isolation
   - [ ] Create `mockApiResponse()` helper for API mocking
   - [ ] Create `takeScreenshot()` utility for debugging
   - [ ] Create `generateRandomCardData()` helper
   - [ ] Implement visual regression testing helpers

8. **Reporting & Debugging**
   - [ ] Configure Playwright HTML reporter
   - [ ] Set up Allure reporting integration
   - [ ] Configure test result retention (30 days)
   - [ ] Create test debugging guide in README
   - [ ] Set up test video/screenshot archival

9. **Test Conventions & Best Practices**
   - [ ] Define naming conventions: `*.spec.ts` for test files
   - [ ] Establish test structure: `describe > context > it`
   - [ ] Implement consistent assertion patterns
   - [ ] Create test tagging system (@smoke, @regression, @slow)
   - [ ] Document test isolation principles
   - [ ] Set up test code linting rules

10. **Backend Integration Testing**
    - [ ] Configure backend startup for E2E tests
    - [ ] Implement API health checks before test runs
    - [ ] Create database seeding for consistent test data
    - [ ] Set up backend log capture for test debugging

**Implementation Order:**
1. Playwright configuration (blocking for all other setup)
2. Base test infrastructure and page objects
3. Test utilities and data management
4. Environment configuration
5. CI/CD integration
6. Reporting setup
7. Documentation and conventions

**Success Criteria:**
- [ ] All existing tests pass with new framework
- [ ] Test execution time < 5 minutes for full suite
- [ ] 95%+ test reliability (no flaky tests)
- [ ] Clear test failure diagnostics
- [ ] Easy test maintenance and extension
- [ ] CI/CD integration working

**Risks & Mitigations:**
- Backend dependency: Implement API mocking for critical paths
- Test flakiness: Use proper waits and retries
- Maintenance overhead: Keep page objects simple and focused
- CI performance: Optimize parallel execution and resource usage
- [ ] Update precommit hook to run E2E tests