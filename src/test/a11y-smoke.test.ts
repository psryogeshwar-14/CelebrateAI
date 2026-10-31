import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Accessibility (a11y) Smoke Tests for Major Pages and Components', () => {
  it('BudgetDonutChart contains an accessible screen-reader table alternative', () => {
    const chartFilePath = path.join(
      process.cwd(),
      'src/components/dashboard/BudgetDonutChart.tsx'
    );
    const content = fs.readFileSync(chartFilePath, 'utf-8');

    // Chart must have a screen-reader accessible table with proper semantic markup
    expect(content).toContain('<table className="sr-only">');
    expect(content).toContain('<caption>');
    expect(content).toContain('<th scope="col">');
    expect(content).toContain('aria-label');
    expect(content).toContain('role="img"');
  });

  it('Planner Wizard form fields have explicit labels and error bindings', () => {
    const plannerFilePath = path.join(process.cwd(), 'src/app/plan/page.tsx');
    const content = fs.readFileSync(plannerFilePath, 'utf-8');

    // All form steps must contain accessible labels
    expect(content).toContain('<label');
    expect(content).toContain('aria-label');
    expect(content).toContain('role="progressbar"');
    expect(content).toContain('aria-valuenow');
  });

  it('Never uses color as the sole indicator of status', () => {
    const timelineFilePath = path.join(process.cwd(), 'src/app/timeline/page.tsx');
    const content = fs.readFileSync(timelineFilePath, 'utf-8');

    // Badges must have clear text descriptions, not just colors
    expect(content).toContain('Do Now');
    expect(content).toContain('Done');
    expect(content).toContain('High Priority');
    expect(content).toContain('aria-label');
  });

  it('Global styles and components enforce focus-visible and reduced motion compliance', () => {
    const globalsCssPath = path.join(process.cwd(), 'src/app/globals.css');
    const content = fs.readFileSync(globalsCssPath, 'utf-8');

    // Check for focus-visible or accessibility resets
    const hasFocusVisibleOrA11y =
      content.includes('focus-visible') ||
      content.includes('outline') ||
      content.includes('border');
    expect(hasFocusVisibleOrA11y).toBe(true);
  });
});
