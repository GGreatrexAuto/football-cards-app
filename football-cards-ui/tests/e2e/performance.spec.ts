import { expect } from '@playwright/test';
import { test } from './base/test-base';

test.describe('@performance Web Vitals', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Web Vitals APIs (largest-contentful-paint, layout-shift) only available in Chromium',
  );

  test('LCP, FCP, and CLS meet Core Web Vitals thresholds', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(
      (): Promise<{ fcp: number; lcp: number; cls: number }> =>
        new Promise((resolve) => {
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(
            (e) => e.name === 'first-contentful-paint',
          );
          const fcp = fcpEntry?.startTime ?? 0;

          // layout-shift entries are not in the standard PerformanceEntry type
          const shiftEntries = performance.getEntriesByType(
            'layout-shift',
          ) as unknown as Array<{ hadRecentInput: boolean; value: number }>;
          const cls = shiftEntries
            .filter((e) => !e.hadRecentInput)
            .reduce((sum, e) => sum + e.value, 0);

          // LCP is only reported after the page settles; use PerformanceObserver
          // with buffered:true to receive entries already dispatched before observe()
          let lcp = 0;
          const obs = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              lcp = entries[entries.length - 1].startTime;
            }
          });
          obs.observe({ type: 'largest-contentful-paint', buffered: true });
          setTimeout(() => {
            obs.disconnect();
            resolve({ fcp, lcp, cls });
          }, 300);
        }),
    );

    expect(metrics.lcp, `LCP was ${metrics.lcp} ms`).toBeLessThan(2500);
    expect(metrics.fcp, `FCP was ${metrics.fcp} ms`).toBeLessThan(1800);
    expect(metrics.cls, `CLS was ${metrics.cls}`).toBeLessThan(0.1);
  });
});
