/**
 * LXGW Bright Webfont - Next.js Integration
 *
 * This file provides an optimized font loading solution for Next.js projects
 * It directly uses font files from node_modules without copying them to the project
 */

// Export font name constant
export const LXGWBright = 'LXGW Bright';

/**
 * Provides LXGW Bright font for Next.js projects
 *
 * This module provides two ways to use:
 * 1. createLXGWBrightFont(): Create font loader function
 * 2. CSS rules for slice fonts: Import 'webfont-lxgw-bright/next/styles.css' to get
 */

/**
 * Create LXGW Bright font loader
 *
 * This function creates a font loader compatible with next/font/local
 * Only import a few core font files, and the rest of the slice fonts will be handled automatically via CSS
 *
 * @param {Object} options Font configuration options
 * @param {string} options.variable CSS variable name (default: '--font-lxgw-bright')
 * @param {boolean} options.preload Whether to preload (default: false, recommended for CJK fonts)
 * @param {string} options.display Font display method (default: 'swap')
 * @param {boolean} options.fallback Whether to use fallback font (default: true)
 * @returns {Function} Returns a function to create font loader, which needs to be called in Next.js projects
 *
 * @example
 * // In the fonts.js file of Next.js project:
 * import { createLXGWBrightFont } from 'webfont-lxgw-bright/next';
 * import localFont from 'next/font/local';
 *
 * export const lxgwBright = createLXGWBrightFont()(localFont);
 */
export function createLXGWBrightFont(options = {}) {
  const {
    variable = '--font-lxgw-bright',
    preload = false,
    display = 'swap',
    fallback = true
  } = options;

  // Return a function that accepts localFont
  return (localFont) => {
    // Validate arguments
    if (typeof localFont !== 'function') {
      throw new Error('createLXGWBrightFont must be passed a next/font/local function');
    }

    // Create font configuration
    return localFont({
      src: [
        // Only include core font files, the rest will be handled automatically via CSS
        {
          path: require.resolve('webfont-lxgw-bright/fonts/LXGWBright-Regular.0.woff2'),
          weight: '400',
          style: 'normal',
        }
      ],
      variable,
      preload,
      display,
      fallback: fallback ? ['system-ui', 'sans-serif'] : undefined,
    });
  };
}
