import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('globals.css', () => {
  let cssContent: string;
  let dom: JSDOM;
  let document: Document;

  beforeAll(() => {
    // Read the CSS file content
    const cssPath = path.join(__dirname, 'globals.css');
    cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    // Create a JSDOM instance for CSS testing
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssContent}</style>
        </head>
        <body>
          <div class="test-element">Test</div>
        </body>
      </html>
    `);
    document = dom.window.document;
  });

  afterAll(() => {
    dom.window.close();
  });

  describe('Tailwind CSS imports', () => {
    test('should import tailwindcss', () => {
      expect(cssContent).toContain('@import "tailwindcss"');
    });

    test('should import tw-animate-css', () => {
      expect(cssContent).toContain('@import "tw-animate-css"');
    });
  });

  describe('Custom variants', () => {
    test('should define dark custom variant', () => {
      expect(cssContent).toContain('@custom-variant dark (&:is(.dark *))');
    });
  });

  describe('Theme configuration', () => {
    test('should define theme inline block', () => {
      expect(cssContent).toContain('@theme inline {');
    });

    test('should define all required color variables in theme', () => {
      const requiredColorVars = [
        '--color-background',
        '--color-foreground',
        '--color-primary',
        '--color-secondary',
        '--color-accent',
        '--color-destructive',
        '--color-muted',
        '--color-border',
        '--color-input',
        '--color-ring'
      ];

      requiredColorVars.forEach(varName => {
        expect(cssContent).toContain(varName);
      });
    });

    test('should define font variables in theme', () => {
      expect(cssContent).toContain('--font-sans: var(--font-geist-sans)');
      expect(cssContent).toContain('--font-mono: var(--font-geist-mono)');
    });

    test('should define sidebar color variables', () => {
      const sidebarVars = [
        '--color-sidebar',
        '--color-sidebar-foreground',
        '--color-sidebar-primary',
        '--color-sidebar-accent',
        '--color-sidebar-border',
        '--color-sidebar-ring'
      ];

      sidebarVars.forEach(varName => {
        expect(cssContent).toContain(varName);
      });
    });

    test('should define chart color variables', () => {
      for (let i = 1; i <= 5; i++) {
        expect(cssContent).toContain(`--color-chart-${i}`);
      }
    });

    test('should define radius variables with correct calculations', () => {
      expect(cssContent).toContain('--radius-sm: calc(var(--radius) - 4px)');
      expect(cssContent).toContain('--radius-md: calc(var(--radius) - 2px)');
      expect(cssContent).toContain('--radius-lg: var(--radius)');
      expect(cssContent).toContain('--radius-xl: calc(var(--radius) + 4px)');
    });
  });

  describe(':root light theme variables', () => {
    test('should define base radius value', () => {
      expect(cssContent).toContain('--radius: 0.625rem');
    });

    test('should use oklch color format for all colors', () => {
      const colorVariables = cssContent.match(/--[^:]+:\s*oklch\([^)]+\)/g);
      expect(colorVariables).toBeTruthy();
      expect(colorVariables!.length).toBeGreaterThan(20);
    });

    test('should define primary color with correct oklch value', () => {
      expect(cssContent).toContain('--primary: oklch(0.63 0.1699 149.21)');
    });

    test('should define background and foreground colors', () => {
      expect(cssContent).toContain('--background: oklch(1 0 0)');
      expect(cssContent).toContain('--foreground: oklch(0.145 0 0)');
    });

    test('should define sidebar colors with proper oklch values', () => {
      expect(cssContent).toContain('--sidebar: oklch(0.2 0.0283 174.92)');
      expect(cssContent).toContain('--sidebar-foreground: oklch(0.82 0.0057 182.99)');
      expect(cssContent).toContain('--sidebar-accent: oklch(0.34 0.0601 171.21)');
    });

    test('should have comments for important color definitions', () => {
      expect(cssContent).toContain('/*Primary color (e.g button)*/');
      expect(cssContent).toContain('/*Sidebar background color*/');
      expect(cssContent).toContain('/*Sidebar text color*/');
      expect(cssContent).toContain('/*Sidebar active item background color*/');
      expect(cssContent).toContain('/*Sidebar active item text color*/');
    });
  });

  describe('.dark theme variables', () => {
    test('should define dark class selector', () => {
      expect(cssContent).toContain('.dark {');
    });

    test('should override light theme colors for dark mode', () => {
      const darkSection = cssContent.split('.dark {')[1].split('}')[0];
      
      expect(darkSection).toContain('--background: oklch(0.145 0 0)');
      expect(darkSection).toContain('--foreground: oklch(0.985 0 0)');
      expect(darkSection).toContain('--primary: oklch(0.922 0 0)');
    });

    test('should use alpha transparency for borders in dark mode', () => {
      expect(cssContent).toContain('--border: oklch(1 0 0 / 10%)');
      expect(cssContent).toContain('--input: oklch(1 0 0 / 15%)');
      expect(cssContent).toContain('--sidebar-border: oklch(1 0 0 / 10%)');
    });

    test('should define all chart colors for dark mode', () => {
      const darkSection = cssContent.split('.dark {')[1].split('}')[0];
      
      for (let i = 1; i <= 5; i++) {
        expect(darkSection).toContain(`--chart-${i}:`);
      }
    });

    test('should have different sidebar colors for dark mode', () => {
      const darkSection = cssContent.split('.dark {')[1].split('}')[0];
      
      expect(darkSection).toContain('--sidebar: oklch(0.205 0 0)');
      expect(darkSection).toContain('--sidebar-primary: oklch(0.488 0.243 264.376)');
      expect(darkSection).toContain('--sidebar-accent: oklch(0.269 0 0)');
    });
  });

  describe('Base layer styles', () => {
    test('should define base layer for universal styles', () => {
      expect(cssContent).toContain('@layer base {');
    });

    test('should apply border and outline to all elements', () => {
      expect(cssContent).toContain('* {');
      expect(cssContent).toContain('@apply border-border outline-ring/50');
    });

    test('should apply background and text color to body', () => {
      expect(cssContent).toContain('body {');
      expect(cssContent).toContain('@apply bg-background text-foreground');
    });

    test('should define cursor pointer for interactive elements', () => {
      expect(cssContent).toContain('button:not(:disabled),');
      expect(cssContent).toContain('[role="button"]:not(:disabled) {');
      expect(cssContent).toContain('cursor: pointer;');
    });
  });

  describe('CSS structure and formatting', () => {
    test('should have proper CSS syntax', () => {
      // Check for balanced braces
      const openBraces = (cssContent.match(/{/g) || []).length;
      const closeBraces = (cssContent.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });

    test('should have consistent indentation for readability', () => {
      const lines = cssContent.split('\n');
      const indentedLines = lines.filter(line => line.startsWith('  '));
      expect(indentedLines.length).toBeGreaterThan(50);
    });

    test('should not contain syntax errors', () => {
      // Basic syntax validation
      expect(cssContent).not.toContain(';;');
      expect(cssContent).not.toContain('{{');
      expect(cssContent).not.toContain('}}');
    });
  });

  describe('Color value validation', () => {
    test('should have valid oklch color values', () => {
      const oklchPattern = /oklch\(\s*[\d.]+\s+[\d.]*\s*[\d.]*\s*(?:\/\s*[\d%]+)?\s*\)/g;
      const oklchColors = cssContent.match(oklchPattern);
      
      expect(oklchColors).toBeTruthy();
      expect(oklchColors!.length).toBeGreaterThan(40);
      
      // Validate each oklch color has proper format
      oklchColors!.forEach(color => {
        expect(color).toMatch(/oklch\(\s*[\d.]+/);
      });
    });

    test('should use consistent color naming convention', () => {
      const colorVariables = cssContent.match(/--[\w-]*color[\w-]*:/g);
      expect(colorVariables).toBeTruthy();
      
      colorVariables!.forEach(variable => {
        expect(variable).toMatch(/^--[\w-]*color[\w-]*:$/);
      });
    });

    test('should have proper alpha transparency format', () => {
      const alphaColors = cssContent.match(/oklch\([^)]*\/\s*[\d%]+\s*\)/g);
      expect(alphaColors).toBeTruthy();
      
      alphaColors!.forEach(color => {
        expect(color).toMatch(/\/\s*[\d%]+/);
      });
    });
  });

  describe('Theme consistency', () => {
    test('should have matching variable names between light and dark themes', () => {
      const lightVars = cssContent.match(/:root\s*{([^}]*)}/s)?.[1] || '';
      const darkVars = cssContent.match(/\.dark\s*{([^}]*)}/s)?.[1] || '';
      
      const lightVariableNames = lightVars.match(/--[\w-]+/g) || [];
      const darkVariableNames = darkVars.match(/--[\w-]+/g) || [];
      
      // Most variables should exist in both themes
      const commonVars = lightVariableNames.filter(v => darkVariableNames.includes(v));
      expect(commonVars.length).toBeGreaterThan(20);
    });

    test('should have proper contrast ratios implied by color choices', () => {
      // Light theme: dark text on light background
      expect(cssContent).toContain('--background: oklch(1 0 0)'); // Light
      expect(cssContent).toContain('--foreground: oklch(0.145 0 0)'); // Dark
      
      // Dark theme: light text on dark background
      const darkSection = cssContent.split('.dark {')[1].split('}')[0];
      expect(darkSection).toContain('--background: oklch(0.145 0 0)'); // Dark
      expect(darkSection).toContain('--foreground: oklch(0.985 0 0)'); // Light
    });
  });

  describe('Responsive and accessibility considerations', () => {
    test('should include focus ring styles', () => {
      expect(cssContent).toContain('outline-ring');
      expect(cssContent).toContain('--ring:');
    });

    test('should have disabled state handling for interactive elements', () => {
      expect(cssContent).toContain(':not(:disabled)');
    });

    test('should support ARIA roles', () => {
      expect(cssContent).toContain('[role="button"]');
    });
  });

  describe('Integration with design system', () => {
    test('should reference external font variables', () => {
      expect(cssContent).toContain('var(--font-geist-sans)');
      expect(cssContent).toContain('var(--font-geist-mono)');
    });

    test('should use calc() for radius variations', () => {
      const calcUsages = cssContent.match(/calc\([^)]+\)/g);
      expect(calcUsages).toBeTruthy();
      expect(calcUsages!.length).toBeGreaterThanOrEqual(3);
    });

    test('should integrate with Tailwind CSS utilities', () => {
      expect(cssContent).toContain('@apply');
      expect(cssContent).toContain('border-border');
      expect(cssContent).toContain('bg-background');
      expect(cssContent).toContain('text-foreground');
    });
  });
});

// Note: You may need to install these testing dependencies:
// npm install --save-dev jsdom @types/jsdom