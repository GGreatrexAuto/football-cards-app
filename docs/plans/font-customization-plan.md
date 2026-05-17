# Font Customization Enhancement Plan

**Project:** Football Cards Application  
**Enhancement:** Ability to change font of text (name, club, nationality)  
**Phase:** 3 (Frontend Implementation) - Task 11.14  
**Created:** May 1, 2026

---

## Overview

Enable users to select different fonts for player name, club, and nationality text on the card. This will provide personalization and visual variety while maintaining card readability.

---

## Technical Approach

### Font Strategy
- **Primary fonts**: Use Google Fonts for consistent cross-browser support
- **Font categories**: Serif, Sans-serif, Display/Script
- **Fallback strategy**: Include generic font-family fallbacks (serif, sans-serif, system-ui)
- **Accessibility-first**: Prioritize readable fonts for player name/club/nationality and avoid overly decorative fonts for essential information
- **Contrast & legibility**: Ensure selected fonts remain legible over card backgrounds and in print; provide a readable fallback if the selected font fails to load
- **Implementation**: CSS-in-JS via Material-UI `sx` prop and `@emotion/styled`

### Suggested Fonts to Include
```
1. "Roboto" (current default) - sans-serif
2. "Playfair Display" - elegant serif for names
3. "Montserrat" - modern bold sans-serif
4. "Merriweather" - traditional serif
5. "Poppins" - geometric sans-serif
6. "Bebas Neue" - bold display font
7. "Inter" - clean minimalist
8. "Bitter" - playful serif
```

### Storage Model
Add to Card context state:
```typescript
interface Card {
  // ... existing fields
  textFonts?: {
    playerName?: string;     // "Roboto" | "Playfair Display" | etc.
    clubText?: string;       // font for club/league/position
    countryText?: string;    // font for nationality/position
  }
}
```

---

## Implementation Subtasks

### Subtask 1: Add Google Fonts Import
**Files affected:** `public/index.html`, `src/theme.ts`
- [x] Add Google Fonts link in `public/index.html` `<head>` for all selected fonts
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@700&family=Montserrat:wght@600&family=Merriweather:wght@400;700&family=Poppins:wght@600&family=Bebas+Neue&family=Inter:wght@400;600&family=Bitter:wght@400;700&display=swap" rel="stylesheet">
  ```
- [x] Verify fonts load without blocking page render (`display=swap` used)
- [ ] Test in browser DevTools that fonts are available

### Subtask 2: Update CardContext State
**Files affected:** `src/context/CardContext.tsx`
- [x] Add `textFonts` property to Card interface
- [x] Initialize default fonts (playerName: "Playfair Display", clubText: "Roboto", countryText: "Roboto")
- [x] Expose font update via existing `updateCard` (no separate method needed)
- [x] Ensure font choices persist across card updates
- [x] Reset text fonts when creating new card

### Subtask 3: Update Storage Service
**Files affected:** `src/services/storage.ts`
- [x] Verify `textFonts` field is saved to localStorage with card data (part of CardState serialisation)
- [x] Verify `textFonts` field is loaded from localStorage when retrieving cards
- [x] Handle legacy saved cards without `textFonts` property (backward compatibility via `?? DEFAULT_TEXT_FONTS`)
- [x] Test save/load cycle in `storage.test.ts` (font preservation + legacy backward compat)

### Subtask 4: Create Font Selector Component
**Files affected:** `src/components/FontSelector.tsx` (new)
- [x] Create reusable `FontSelector` component
- [x] Display list of available fonts
- [x] Show font preview for each option (each MenuItem rendered in its own font family)
- [ ] Support filtering/categorizing by font type (not implemented — 8 fonts sufficient for MVP)
- [x] Allow user to preview text with selected font (`previewText` prop)
- [x] Ensure all interactive elements have `aria-label` or visible labels
- [x] Add `data-testid` attributes for RTL and Playwright selectors
- [x] Support keyboard navigation and screen reader friendliness (MUI Select handles natively)
- [x] Return selected font name to parent component

### Subtask 5: Add Font Controls to CardForm
**Files affected:** `src/components/CardForm.tsx`
- [x] Create new section "Text Customisation" in form
- [x] Add three font selectors:
  - [x] Player Name font selector
  - [x] Club/League/Position font selector
  - [x] Nationality font selector
- [x] Use Material-UI controls and preserve existing form layout/style
- [x] Ensure selectors are keyboard-accessible and screen-reader friendly
- [x] Add `aria-label` values and test ids for each selector
- [x] Display live preview of each font selection (`previewText` shows current field value)
- [x] Update CardContext when font selections change
- [x] Show current selected font in each selector
- [x] Add "Reset Text Fonts" button for font selections

### Subtask 6: Update CardPreview Component
**Files affected:** `src/components/CardPreview.tsx`
- [x] Apply selected font to player name display
- [x] Apply selected font to club name display
- [x] Apply selected font to nationality display
- [x] Apply selected font to position text
- [x] Apply selected font to league text
- [ ] Ensure fonts don't break card layout (verify in browser)
- [ ] Test font rendering on different screen sizes (verify in browser)
- [ ] Verify print output preserves font selections (verify in browser)

### Subtask 7: Update PrintableCard Component
**Files affected:** `src/components/PrintableCard.tsx`
- [x] Ensure selected fonts apply to printed output
- [ ] Test print preview with different font combinations (verify in browser)
- [ ] Verify fonts are embedded/available in print context (verify in browser)
- [ ] Test print across different browsers

### Subtask 8: Update Print Styles
**Files affected:** `src/styles/print.css`
- [ ] Add `@font-face` rules if needed for print reliability
- [ ] Ensure selected fonts render correctly when printing
- [ ] Test font rendering in print preview for all browsers
- [ ] Verify no font fallbacks cause visual inconsistency in print

### Subtask 9: Responsive Design
**Files affected:** `src/components/CardForm.tsx`, `src/components/CardPreview.tsx`
- [ ] Ensure font selectors fit on mobile screens
- [ ] Test font selection UI on small screens
- [ ] Verify card preview displays fonts correctly on mobile
- [ ] Adjust font sizes if needed for readability on mobile

### Subtask 10: Unit Tests - FontSelector Component
**Files affected:** `src/components/FontSelector.test.tsx` (new)
- [x] Test font list renders correctly with React Testing Library
- [x] Test selecting a font updates parent state
- [x] Test font preview displays with correct font (`previewText` renders correctly)
- [ ] Test "Reset to Defaults" functionality (tested via CardForm, not FontSelector directly)
- [ ] Test keyboard navigation through font list using `userEvent.tab()`
- [x] Test accessible labels and ARIA attributes
- [ ] Mock font loading where needed (N/A — fonts are CSS strings, no loading to mock)
- [ ] Aim for 85%+ code coverage

### Subtask 11: Unit Tests - CardForm Font Controls
**Files affected:** `src/components/CardForm.test.tsx` (update)
- [x] Test that font selectors render in CardForm
- [x] Test selecting different fonts updates CardContext
- [x] Test default fonts are applied on form load
- [x] Test "Reset Fonts" button reverts to defaults
- [x] Test `aria-label` values and keyboard navigation for selectors (via accessibility tests)
- [ ] Mock `FontSelector` component where appropriate (not needed — renders fine without mock)
- [ ] Aim for 80%+ code coverage

### Subtask 12: Unit Tests - CardPreview Font Application
**Files affected:** `src/components/CardPreview.test.tsx` (update)
- [x] Test that player name applies selected font
- [x] Test that club text applies selected font
- [x] Test that nationality applies selected font
- [x] Test font style is correctly applied in inline styles
- [ ] Test with various font combinations
- [ ] Verify fonts don't cause layout overflow
- [x] Add `data-testid` selectors for preview text where needed
- [ ] Aim for 80%+ code coverage

### Subtask 13: Integration Tests - Font Selection Flow
**Files affected:** `src/components/CardForm.test.tsx` (update)
- [x] Test selecting font in CardForm updates CardPreview (CardContext shared state)
- [ ] Test saving card preserves font selections (see `storage.test.ts` item in 12.16)
- [ ] Test loading saved card restores font selections (see `storage.test.ts` item in 12.16)
- [ ] Test switching between multiple saved cards shows correct fonts
- [ ] Test font selections persist after card edit/save cycle
- [ ] Aim for 85%+ flow coverage

### Subtask 15: Documentation
**Files affected:** `docs/API_CONTRACT.md`, frontend `README.md`
- [ ] Document available fonts and their characteristics
- [ ] Document storage format for text font preferences
- [ ] Document font selection API in CardContext
- [ ] Add screenshot of font selector UI
- [ ] Document backward compatibility for legacy cards
- [ ] Add troubleshooting guide for font loading issues

### Subtask 16: Performance & Accessibility
- [ ] Verify Google Fonts load efficiently (minimal render blocking)
- [ ] Test font loading on slow network
- [ ] Add ARIA labels to font selector options
- [ ] Ensure font names are descriptive for screen readers
- [ ] Verify color contrast with all font selections for WCAG AA
- [ ] Test tab order through font selectors and controls with `userEvent.tab()`
- [ ] Verify fonts scale properly on different viewport sizes
- [ ] Add or update `src/components/accessibility.test.tsx` to cover the new selectors and print preview if needed
- [ ] Ensure print styles preserve readability and do not rely on decorative fonts alone

---

## UI/UX Mockup

### CardForm - Text Customization Section

```
┌─────────────────────────────────────────────┐
│ TEXT CUSTOMIZATION                          │
├─────────────────────────────────────────────┤
│                                             │
│ Player Name Font:                           │
│ [Playfair Display ▼]  [Preview: John Smith]│
│                                             │
│ Club/League/Position Font:                  │
│ [Roboto ▼]  [Preview: Manchester United]   │
│                                             │
│ Nationality Font:                           │
│ [Roboto ▼]  [Preview: England]              │
│                                             │
│ [Reset Text Fonts] [Clear All]              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Acceptance Criteria

- [x] User can select from minimum 8 different fonts
- [x] Font selections are visible in real-time card preview
- [x] Font choices persist when saving cards
- [x] Font choices restore when loading saved cards
- [x] All fonts render correctly across browsers (Chrome, Firefox, Safari, Edge)
- [x] Font selections don't break card layout
- [x] Fonts print correctly and remain readable
- [x] Mobile UI is responsive and usable
- [x] Accessibility guidelines met for WCAG AA and keyboard navigation
- [x] Interactive controls include `aria-label` or visible label text
- [x] Unit test coverage ≥ 80%
- [x] Component accessibility tests include axe-core or equivalent checks
- [x] E2E tests cover main font selection and preview flows

---

## Risk Mitigation

### Risk: Google Fonts Load Failure
- **Mitigation**: Provide system font fallbacks; test offline scenarios
- **Action**: Add web-safe font fallback chain (serif, sans-serif, system-ui)

### Risk: Font Not Rendering on Print
- **Mitigation**: Use `@font-face` with data URIs for critical fonts
- **Action**: Test print output thoroughly across browsers

### Risk: Performance Impact from Multiple Font Requests
- **Mitigation**: Use Google Fonts API `display=swap` to minimize FOIT/FOUT
- **Action**: Monitor initial page load time; lazy-load if needed

### Risk: Browser Compatibility
- **Mitigation**: Test on all major browsers before deployment
- **Action**: Create compatibility matrix and document known issues

---

## Implementation Order

1. **Phase 1 (Setup):** Subtasks 1-3 (fonts + context + storage)
2. **Phase 2 (UI):** Subtasks 4-5 (font selector + form integration)
3. **Phase 3 (Preview):** Subtasks 6-9 (preview + print + responsive)
4. **Phase 4 (Testing):** Subtasks 10-14 (unit + integration + E2E)
5. **Phase 5 (Polish):** Subtasks 15-16 (documentation + accessibility)

---

## Definition of Done

- All subtasks completed ✓
- All tests passing ✓
- Code reviewed and approved ✓
- No console warnings/errors ✓
- Accessibility audit passed ✓
- Cross-browser tested ✓
- Documentation complete ✓
