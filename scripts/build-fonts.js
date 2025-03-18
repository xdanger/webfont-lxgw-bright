/**
 * LXGW Bright Webfont Builder using fonttools
 *
 * This script uses fonttools (pyftsubset) to efficiently create font subsets
 * It should produce much smaller files than the Fontmin approach
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execPromise = promisify(exec);

// =======================================================
// Public API & Constants
// =======================================================

// Font family constants
const LXGWBright = 'LXGW Bright';

/**
 * Helper function to configure font
 * @param {Object} options Font options
 * @param {string} options.weight Font weight (default: '400')
 * @param {string} options.style Font style (default: 'normal')
 * @returns {Object} Font configuration
 */
function configureLXGWBright(options = {}) {
  const { weight = '400', style = 'normal' } = options;

  return {
    fontFamily: LXGWBright,
    fontWeight: weight,
    fontStyle: style,
  };
}

// =======================================================
// Shared Configuration
// =======================================================

const PACKAGE_ROOT = path.join(__dirname, '..');
const FONTS_DIR = path.join(PACKAGE_ROOT, 'fonts');
const CSS_FILE = path.join(PACKAGE_ROOT, 'index.css');

// Font processing configuration
const SRC_FONTS_DIR = path.join(PACKAGE_ROOT, 'src-fonts');
const TEMP_DIR = path.join(PACKAGE_ROOT, 'temp');

// =======================================================
// Unicode Ranges
// =======================================================

// Path to unicode ranges JSON file
const UNICODE_RANGES_JSON = path.join(__dirname, 'unicode-ranges.json');

/**
 * Reads unicode ranges from the JSON file
 * @returns {Array} Array of unicode range objects
 */
function readUnicodeRanges() {
  try {
    if (!fs.existsSync(UNICODE_RANGES_JSON)) {
      console.warn(`Unicode ranges JSON file not found at: ${UNICODE_RANGES_JSON}`);
      console.warn('Using default unicode ranges.');
      // Return default ranges if file doesn't exist
      return getDefaultUnicodeRanges();
    }

    const jsonContent = fs.readFileSync(UNICODE_RANGES_JSON, 'utf8');
    const data = JSON.parse(jsonContent);

    console.log(`Read ${data.totalRanges} unicode ranges from ${UNICODE_RANGES_JSON}`);
    return data.ranges.map(range => ({
      name: range.name.replace(/\s*\(Range \d+\)$/, ''),
      range: range.range
    }));
  } catch (error) {
    console.error(`Error reading unicode ranges: ${error.message}`);
    console.warn('Using default unicode ranges instead.');
    return getDefaultUnicodeRanges();
  }
}

/**
 * Provides default unicode ranges if JSON file can't be read
 * @returns {Array} Default unicode ranges
 */
function getDefaultUnicodeRanges() {
  return [
    { name: 'Basic Latin', range: 'U+0000-007F' },
    { name: 'Latin-1 Supplement', range: 'U+0080-00FF' },
    { name: 'Latin Extended-A', range: 'U+0100-017F' },
    { name: 'Latin Extended-B', range: 'U+0180-024F' },
    { name: 'IPA Extensions', range: 'U+0250-02AF' },
    { name: 'Spacing Modifier Letters', range: 'U+02B0-02FF' },
    { name: 'CJK Symbols and Punctuation', range: 'U+3000-303F' },
    { name: 'Hiragana', range: 'U+3040-309F' },
    { name: 'Katakana', range: 'U+30A0-30FF' },
    { name: 'CJK Unified Ideographs', range: 'U+4E00-9FFF' },
    { name: 'CJK Compatibility Ideographs', range: 'U+F900-FAFF' }
  ];
}

// Unicode block ranges for splitting - load from JSON file or use defaults
const unicodeRanges = readUnicodeRanges();

// =======================================================
// Helpers for Font Subsetting
// =======================================================

/**
 * Creates a temporary directory if it doesn't exist
 */
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    console.log(`Creating temporary directory at ${TEMP_DIR}`);
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

/**
 * Creates the fonts directory if it doesn't exist
 */
function ensureFontsDir() {
  if (!fs.existsSync(FONTS_DIR)) {
    console.log(`Creating fonts directory at ${FONTS_DIR}`);
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }
}

/**
 * Finds the first available font file for the given weight and style
 * @param {string} fontFamily Font family name
 * @param {string} weight Font weight
 * @param {string} style Font style
 * @returns {string|null} Path to font file or null if not found
 */
function findSourceFont(fontFamily, weight, style) {
  const styleStr = style !== 'normal' ? style.charAt(0).toUpperCase() + style.slice(1) : '';
  const weightName = weight === '400' ? 'Regular' :
    weight === '700' ? 'Bold' :
      weight === '300' ? 'Light' :
        weight === '500' ? 'Medium' : weight;

  const baseName = `${fontFamily.replace(/\s+/g, '')}`;

  // Check for different name formats and file extensions (woff2, woff, ttf in order of preference)
  const possibleNames = [
    // Weight as name format (Regular, Bold, etc.)
    `${baseName}-${weightName}${styleStr}`,
    // Weight as number format (400, 700, etc.)
    `${baseName}-${weight}${styleStr}`,
  ];

  const extensions = ['.ttf', '.woff2', '.woff'];

  for (const name of possibleNames) {
    for (const ext of extensions) {
      const filePath = path.join(SRC_FONTS_DIR, `${name}${ext}`);
      if (fs.existsSync(filePath)) {
        console.log(`Found source font: ${filePath}`);
        return filePath;
      }
    }
  }

  return null;
}

/**
 * Convert WOFF/WOFF2 font to TTF format using fonttools
 * @param {string} srcFont Source font path (WOFF/WOFF2)
 * @returns {Promise<string>} Path to converted TTF file
 */
async function convertToTTF(srcFont) {
  const ext = path.extname(srcFont).toLowerCase();

  // If already TTF, return the path
  if (ext === '.ttf') {
    return srcFont;
  }

  // Create temp directory if it doesn't exist
  ensureTempDir();

  // Define output TTF path
  const baseName = path.basename(srcFont, ext);
  const ttfPath = path.join(TEMP_DIR, `${baseName}.ttf`);

  // Convert using fontTools
  const command = `fonttools ttLib.woff2 decompress "${srcFont}" "${ttfPath}"`;

  try {
    console.log(`Converting ${ext} to TTF: ${command}`);
    await execPromise(command);

    // Check if the file was created
    if (fs.existsSync(ttfPath)) {
      console.log(`Successfully converted to TTF: ${ttfPath}`);
      return ttfPath;
    } else {
      console.error(`Conversion failed: TTF file not created at ${ttfPath}`);
      throw new Error(`Conversion failed: TTF file not created`);
    }
  } catch (error) {
    console.error(`Error converting to TTF: ${error.message}`);

    // Try alternative conversion method
    try {
      const altCommand = `fonttools ttx -o "${ttfPath}" "${srcFont}"`;
      console.log(`Trying alternative conversion method: ${altCommand}`);
      await execPromise(altCommand);

      if (fs.existsSync(ttfPath)) {
        console.log(`Successfully converted to TTF using alternative method: ${ttfPath}`);
        return ttfPath;
      } else {
        throw new Error(`Alternative conversion also failed`);
      }
    } catch (altError) {
      console.error(`Alternative conversion failed: ${altError.message}`);
      throw new Error(`Failed to convert ${srcFont} to TTF format`);
    }
  }
}

/**
 * Builds a font using fonttools pyftsubset
 * @param {string} srcFont Source font path
 * @param {string} destFont Destination font path
 * @param {string} unicodeRange Unicode range to include
 * @returns {Promise<string>} Promise resolving to command output
 */
async function buildFont(srcFont, destFont, unicodeRange) {
  // Convert srcFont to TTF if it's not already
  const ttfSrcFont = await convertToTTF(srcFont);

  // Supported font formats: ttf,woff,woff2
  // pyftsubset command format: pyftsubset [options] font.ttf
  const fontFormat = path.extname(destFont).substring(1);
  const command = `pyftsubset "${ttfSrcFont}" --output-file="${destFont}" --flavor=${fontFormat} --unicodes=${unicodeRange} --layout-features='*' --no-hinting --ignore-missing-glyphs`;

  try {
    console.log(`Running command: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error);
    throw error;
  }
}

// =======================================================
// Font Building Functions
// =======================================================

/**
 * Builds all font variations for a given weight and style
 * @param {Object} fontConfig Font configuration
 * @param {string} fontConfig.fontFamily Font family name
 * @param {string} fontConfig.fontWeight Font weight
 * @param {string} fontConfig.fontStyle Font style
 * @returns {Promise<Object>} Promise resolving to an object with font information
 */
async function buildFontVariations(fontConfig) {
  const { fontFamily, fontWeight, fontStyle } = fontConfig;

  // Find source font file
  const sourceFontPath = findSourceFont(fontFamily, fontWeight, fontStyle);

  if (!sourceFontPath) {
    console.error(`No suitable source font found for ${fontFamily} ${fontWeight} ${fontStyle}`);
    throw new Error(`No suitable source font found for ${fontFamily} ${fontWeight} ${fontStyle}`);
  }

  console.log(`Building font variations for ${fontFamily} ${fontWeight} ${fontStyle}`);

  // Ensure directories exist
  ensureTempDir();
  ensureFontsDir();

  // Build each unicode range variant
  const fontSubsets = [];

  // Map numeric weight to name
  const weightName = fontWeight === '400' ? 'Regular' :
    fontWeight === '700' ? 'Bold' :
      fontWeight === '300' ? 'Light' :
        fontWeight === '500' ? 'Medium' : fontWeight;

  for (const [index, rangeObj] of unicodeRanges.entries()) {
    const { name, range } = rangeObj;

    // Create output filenames
    const outputBaseName = `${fontFamily.replace(/\s+/g, '')}-${weightName}`;

    // Generate font files for all formats
    const outputName = `${outputBaseName}.${index}`;
    const woffFontPath = path.join(FONTS_DIR, `${outputName}.woff`);
    const woff2FontPath = path.join(FONTS_DIR, `${outputName}.woff2`);

    // Build WOFF and WOFF2 fonts
    await buildFont(sourceFontPath, woffFontPath, range);
    await buildFont(sourceFontPath, woff2FontPath, range);

    // Collect information about this font subset
    fontSubsets.push({
      name,
      range,
      unicodeRange: range,
      woff: path.relative(PACKAGE_ROOT, woffFontPath),
      woff2: path.relative(PACKAGE_ROOT, woff2FontPath)
    });

    console.log(`Built font subset ${index + 1}/${unicodeRanges.length}: ${name}`);
  }

  return {
    fontFamily,
    fontWeight,
    fontStyle,
    subsets: fontSubsets
  };
}

/**
 * Generates CSS for all font variants
 * @param {Array<Object>} fontVariants Array of font variant objects
 * @returns {string} CSS content
 */
function generateCSS(fontVariants) {
  let css = '/* LXGW Bright Webfont */\n\n';

  for (const variant of fontVariants) {
    const { fontFamily, fontWeight, fontStyle, subsets } = variant;

    for (const subset of subsets) {
      const { name, unicodeRange, woff, woff2 } = subset;

      css += `@font-face {\n`;
      css += `  font-family: '${fontFamily}';\n`;
      css += `  font-style: ${fontStyle};\n`;
      css += `  font-weight: ${fontWeight};\n`;
      css += `  font-display: swap;\n`;
      css += `  src: url('./${woff2}') format('woff2'),\n`;
      css += `       url('./${woff}') format('woff');\n`;
      css += `  unicode-range: ${unicodeRange};\n`;
      css += `}\n\n`;
    }
  }

  return css;
}

/**
 * Builds all fonts and generates CSS
 */
async function buildAllFonts() {
  console.log('Building all font variations...');

  // Configuration for all font variations to build
  const fontConfigs = [
    configureLXGWBright({ weight: '400', style: 'normal' }),
    // Add more configurations for different weights/styles as needed
  ];

  const fontVariants = [];

  for (const config of fontConfigs) {
    const variant = await buildFontVariations(config);
    fontVariants.push(variant);
  }

  // Generate CSS file
  const css = generateCSS(fontVariants);
  fs.writeFileSync(CSS_FILE, css, 'utf8');

  console.log(`Generated CSS file at ${CSS_FILE}`);
  console.log('All fonts have been built successfully!');
}

// =======================================================
// Main Function
// =======================================================

/**
 * Main function
 */
async function main() {
  try {
    await buildAllFonts();
  } catch (error) {
    console.error('Error building fonts:', error);
    process.exit(1);
  }
}

// Run the main function if this script is run directly
if (require.main === module) {
  main();
}

// Export public API
module.exports = {
  configureLXGWBright,
  buildFontVariations,
  buildAllFonts,
  unicodeRanges
};