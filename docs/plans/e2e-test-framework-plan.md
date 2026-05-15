#### E2E Test Base Framework Setup Plan

**Objective:** Establish a robust, maintainable E2E testing foundation using Playwright that supports the football-cards application's testing needs.

**Key Components:**

1. **Playwright Configuration Setup** High
   - [x] Create `playwright.config.ts` in `football-cards-ui/` root
   - [x] Configure test directory: `football-cards-ui/tests/e2e/`
   - [x] Set base URL to `http://localhost:3000` (React dev server)
   - [x] Configure browsers: Chromium, Firefox, WebKit
   - [x] Set test timeout: 30 seconds
   - [x] Enable video recording for failed tests
   - [x] Configure screenshot capture on failure
   - [x] Set up parallel test execution (2 workers)
   - [x] Configure retries: 2 for CI, 0 for local
   - [x] Add global setup/teardown hooks

2. **Base Test Infrastructure** High
   - [x] Create `football-cards-ui/tests/e2e/base/` directory for shared utilities
   - [x] Create `football-cards-ui/tests/e2e/base/test-base.ts` - base test class with common setup
   - [x] Create `football-cards-ui/tests/e2e/base/page-objects/` directory
   - [x] Create `football-cards-ui/tests/e2e/base/fixtures/` directory for test data
   - [x] Create `football-cards-ui/tests/e2e/base/helpers/` directory for utility functions

3. **Page Object Models (POM)** High
   - [x] Create `CardCreatorPage.ts` - encapsulates card creation form interactions
   - [x] Create `CardGalleryPage.ts` - encapsulates gallery view interactions  
   - [x] Create `CardPreviewPage.ts` - encapsulates card preview interactions
   - [x] Create `NavigationPage.ts` - encapsulates app navigation
   - [x] Define consistent locator strategies (data-testid, aria-label, text content)
   - [x] Implement fluent API patterns for better test readability

4. **Test Data Management** High
   - [x] Create `football-cards-ui/tests/e2e/base/fixtures/test-data.ts` with sample card data
   - [x] Create `football-cards-ui/tests/e2e/base/fixtures/api-mock-data.ts` for backend API responses
   - [x] Implement data builders for generating test variations
   - [x] Create test data cleanup utilities

5. **Environment Configuration** High
   - [x] Create `.env.test` for test-specific environment variables
   - [x] Configure backend API URL for tests
   - [x] Set up test database isolation (if needed)
   - [x] Configure test user credentials/data

6. **Test Utilities & Helpers** High
   - [x] Create `waitForAppReady()` helper for app initialization
   - [x] Create `clearLocalStorage()` helper for test isolation
   - [x] Create `mockApiResponse()` helper for API mocking
   - [x] Create `takeScreenshot()` utility for debugging
   - [x] Create `generateRandomCardData()` helper
   - [x] Implement visual regression testing helpers

8. **Reporting & Debugging** Medium
   - [x] Configure Playwright HTML reporter
   - [ ] Set up Allure reporting integration
   - [x] Configure test result retention (30 days)
   - [x] Create test debugging guide in README
   - [x] Set up test video/screenshot archival

9. **Test Conventions & Best Practices** Medium
   - [x] Define naming conventions: `*.spec.ts` for test files
   - [x] Establish test structure: `describe > context > it`
   - [x] Implement consistent assertion patterns
   - [x] Create test tagging system (@smoke, @regression, @slow)
   - [x] Document test isolation principles
   - [ ] Set up test code linting rules

10. **Backend Integration Testing** Medium
    - [x] Configure backend startup for E2E tests
    - [x] Implement API health checks before test runs
    - [ ] Create database seeding for consistent test data
    - [ ] Set up backend log capture for test debugging
    - [ ] Document that E2E requires backend running alongside frontend before test execution

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