/**
 * LXGW Bright Webfont Builder and CLI
 *
 * This script has two functions:
 * 1. When run as a build script (node scripts/build-fonts.js), it processes font files and creates subsets
 * 2. When run as CLI (npx webfont-lxgw-bright), it copies processed fonts to user's project
 */

const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { execSync } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// =======================================================
// Public API & Constants
// =======================================================

// Font family constants
const LXGWBright = 'LXGWBright';

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
const MAX_CHUNK_SIZE = 350 * 1024; // 350KB in bytes

// =======================================================
// Helper Functions
// =======================================================

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${FONTS_DIR}`);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    console.log(`📁 Created temp directory: ${TEMP_DIR}`);
  }
}

/**
 * Check if pyftsubset is installed
 */
async function checkPyftsubset() {
  try {
    await exec('pyftsubset --help');
    console.log('✓ pyftsubset is available');
    return true;
  } catch (error) {
    console.error('❌ pyftsubset not found. Installing fonttools...');
    try {
      await exec('pip install fonttools');
      console.log('✓ fonttools installed successfully');
      return true;
    } catch (pipError) {
      console.error('❌ Failed to install fonttools:', pipError.message);
      console.log('\nThis script requires fonttools to be installed. Please install it manually:');
      console.log('  pip install fonttools');
      console.log('\nNote: This is only required for package maintainers, not for end users.');
      return false;
    }
  }
}

/**
 * Determine font weight from font name
 */
function getFontWeight(fontName) {
  if (fontName.includes('Light')) return 300;
  if (fontName.includes('Medium')) return 500;
  return 400; // Regular
}

// =======================================================
// Unicode Ranges
// =======================================================

// Unicode block ranges for splitting
const unicodeRanges = [
  // Basic ranges (Latin, European, etc.)
  { name: 'Basic Latin', range: 'U+0000-007F' },
  { name: 'Latin-1 Supplement', range: 'U+0080-00FF' },
  { name: 'Latin Extended-A', range: 'U+0100-017F' },
  { name: 'Latin Extended-B', range: 'U+0180-024F' },
  { name: 'IPA Extensions', range: 'U+0250-02AF' },
  { name: 'Spacing Modifier Letters', range: 'U+02B0-02FF' },
  { name: 'Combining Diacritical Marks', range: 'U+0300-036F' },
  { name: 'Greek and Coptic', range: 'U+0370-03FF' },
  { name: 'Cyrillic', range: 'U+0400-04FF' },
  { name: 'Cyrillic Supplement', range: 'U+0500-052F' },
  { name: 'General Punctuation', range: 'U+2000-206F' },

  // CJK Symbols and Japanese syllabaries
  { name: 'CJK Symbols and Punctuation', range: 'U+3000-303F' },
  { name: 'Hiragana', range: 'U+3040-309F' },
  { name: 'Katakana', range: 'U+30A0-30FF' },

  // CJK Extensions - divided into smaller chunks
  { name: 'CJK Unified Ideographs Extension A', range: 'U+3400-3BFF' },
  { name: 'CJK Unified Ideographs Extension A 2', range: 'U+3C00-4DBF' },

  // CJK Unified Ideographs - divided into many smaller chunks for more granular control
  { name: 'CJK Unified Ideographs 1-1', range: 'U+4E00-4FFF' },
  { name: 'CJK Unified Ideographs 1-2', range: 'U+5000-51FF' },
  { name: 'CJK Unified Ideographs 1-3', range: 'U+5200-53FF' },
  { name: 'CJK Unified Ideographs 1-4', range: 'U+5400-55FF' },
  { name: 'CJK Unified Ideographs 1-5', range: 'U+5600-57FF' },
  { name: 'CJK Unified Ideographs 1-6', range: 'U+5800-59FF' },
  { name: 'CJK Unified Ideographs 1-7', range: 'U+5A00-5BFF' },
  { name: 'CJK Unified Ideographs 1-8', range: 'U+5C00-5DFF' },
  { name: 'CJK Unified Ideographs 1-9', range: 'U+5E00-5FFF' },

  { name: 'CJK Unified Ideographs 2-1', range: 'U+6000-61FF' },
  { name: 'CJK Unified Ideographs 2-2', range: 'U+6200-63FF' },
  { name: 'CJK Unified Ideographs 2-3', range: 'U+6400-65FF' },
  { name: 'CJK Unified Ideographs 2-4', range: 'U+6600-67FF' },
  { name: 'CJK Unified Ideographs 2-5', range: 'U+6800-69FF' },
  { name: 'CJK Unified Ideographs 2-6', range: 'U+6A00-6BFF' },
  { name: 'CJK Unified Ideographs 2-7', range: 'U+6C00-6DFF' },
  { name: 'CJK Unified Ideographs 2-8', range: 'U+6E00-6FFF' },

  { name: 'CJK Unified Ideographs 3-1', range: 'U+7000-71FF' },
  { name: 'CJK Unified Ideographs 3-2', range: 'U+7200-73FF' },
  { name: 'CJK Unified Ideographs 3-3', range: 'U+7400-75FF' },
  { name: 'CJK Unified Ideographs 3-4', range: 'U+7600-77FF' },
  { name: 'CJK Unified Ideographs 3-5', range: 'U+7800-79FF' },
  { name: 'CJK Unified Ideographs 3-6', range: 'U+7A00-7BFF' },
  { name: 'CJK Unified Ideographs 3-7', range: 'U+7C00-7DFF' },
  { name: 'CJK Unified Ideographs 3-8', range: 'U+7E00-7FFF' },

  { name: 'CJK Unified Ideographs 4-1', range: 'U+8000-81FF' },
  { name: 'CJK Unified Ideographs 4-2', range: 'U+8200-83FF' },
  { name: 'CJK Unified Ideographs 4-3', range: 'U+8400-85FF' },
  { name: 'CJK Unified Ideographs 4-4', range: 'U+8600-87FF' },
  { name: 'CJK Unified Ideographs 4-5', range: 'U+8800-89FF' },
  { name: 'CJK Unified Ideographs 4-6', range: 'U+8A00-8BFF' },
  { name: 'CJK Unified Ideographs 4-7', range: 'U+8C00-8DFF' },
  { name: 'CJK Unified Ideographs 4-8', range: 'U+8E00-8FFF' },

  { name: 'CJK Unified Ideographs 5-1', range: 'U+9000-91FF' },
  { name: 'CJK Unified Ideographs 5-2', range: 'U+9200-93FF' },
  { name: 'CJK Unified Ideographs 5-3', range: 'U+9400-95FF' },
  { name: 'CJK Unified Ideographs 5-4', range: 'U+9600-97FF' },
  { name: 'CJK Unified Ideographs 5-5', range: 'U+9800-99FF' },
  { name: 'CJK Unified Ideographs 5-6', range: 'U+9A00-9BFF' },
  { name: 'CJK Unified Ideographs 5-7', range: 'U+9C00-9DFF' },
  { name: 'CJK Unified Ideographs 5-8', range: 'U+9E00-9FFF' },

  // Other CJK blocks
  { name: 'CJK Compatibility Ideographs', range: 'U+F900-FAFF' },
];

// =======================================================
// Font Subsetting Functions
// =======================================================

/**
 * Create a font subset using pyftsubset
 * @param {string} fontPath Path to the font file
 * @param {string} unicodeRange Unicode range to include
 * @param {string} outputPath Path to save the subset font
 * @returns {boolean} Whether the subset was created successfully
 */
async function createFontSubset(fontPath, unicodeRange, outputPath) {
  try {
    // Extract format from file extension
    const format = path.extname(fontPath).substring(1).toLowerCase();

    // Check if format is supported
    if (!['woff', 'woff2'].includes(format)) {
      console.error(`❌ Unsupported font format: ${format}`);
      return false;
    }

    console.log(`📋 Creating subset with format: ${format.toUpperCase()} → ${format.toUpperCase()} (source → target)`);

    // Create the subset command
    const command = `pyftsubset "${fontPath}" --unicodes="${unicodeRange}" --output-file="${outputPath}" --flavor=${format} --layout-features='*'`;

    // For debugging
    console.log(`🔧 Command: ${command}`);

    // Execute the command
    const { stdout, stderr } = await exec(command);

    if (stderr && stderr.includes('error')) {
      console.error(`⚠️ Warning during subsetting: ${stderr}`);
    }

    if (stdout && stdout.trim()) {
      console.log(`ℹ️ Subsetting output: ${stdout.trim()}`);
    }

    // Verify file exists and check its format
    if (fs.existsSync(outputPath)) {
      const outputFormat = path.extname(outputPath).substring(1).toLowerCase();
      console.log(`✓ Format preserved: ${format.toUpperCase()} → ${outputFormat.toUpperCase()}`);
      return true;
    } else {
      console.error(`❌ Failed to create subset file: ${outputPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error creating subset: ${error.message}`);
    if (error.stderr) {
      console.error(`📜 Command output: ${error.stderr}`);
    }
    return false;
  }
}

/**
 * Process a single font file
 * @param {string} fontPath Path to the font file
 * @returns {Array} Font entries
 */
async function processFont(fontPath) {
  try {
    const fontFileName = path.basename(fontPath);
    const fontFileExtension = path.extname(fontPath).substring(1).toLowerCase();
    const fontNameWithoutExtension = path.basename(fontPath, path.extname(fontPath));

    console.log(`\n🔤 Processing font: ${fontFileName}`);
    console.log(`📝 Format: ${fontFileExtension.toUpperCase()}`);

    // Start timing the processing
    const startTime = Date.now();

    // Each subset range will become a separate file
    let entries = [];

    // Split font into chunks
    for (let i = 0; i < unicodeRanges.length; i++) {
      const range = unicodeRanges[i];
      const outPath = path.join(
        FONTS_DIR,
        `${fontNameWithoutExtension}.${i}.${fontFileExtension}`
      );

      console.log(`\n⏳ Creating subset ${i + 1}/${unicodeRanges.length}: ${range.name}`);
      console.log(`👉 Unicode range: ${range.range}`);
      console.log(`🔠 Output format: ${fontFileExtension.toUpperCase()}`);

      const result = await createFontSubset(fontPath, range.range, outPath);

      if (result) {
        const fontSizeKb = (fs.statSync(outPath).size / 1024).toFixed(2);
        console.log(`✅ Created: ${path.basename(outPath)} (${fontSizeKb}KB)`);

        entries.push({
          subset: i,
          unicodeRange: range.range,
          path: path.basename(outPath),
          name: fontNameWithoutExtension,
          format: fontFileExtension
        });
      }
    }

    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Completed processing ${fontFileName} in ${processingTime} seconds`);
    console.log(`📦 Created ${entries.length} subset files`);

    return entries;
  } catch (error) {
    console.error(`❌ Error processing font ${fontPath}:`, error);
    return null;
  }
}

// =======================================================
// CSS Generation
// =======================================================

/**
 * Generate CSS with @font-face declarations
 */
function generateCSS(fontEntries) {
  console.log(`\n🎨 Generating CSS file with @font-face declarations...`);
  let css = '/* LXGW Bright Webfont */\n\n';

  // Process and normalize entries first
  const processedEntries = fontEntries.map(entry => {
    // Extract font metadata from the font name
    const nameParts = entry.name.split('-');
    const fontFamily = nameParts[0];
    const fontStyle = entry.name.toLowerCase().includes('italic') ? 'italic' : 'normal';
    const fontWeight = getFontWeight(entry.name);

    return {
      fontFamily,
      fontWeight,
      fontStyle,
      unicodeRange: entry.unicodeRange,
      src: `fonts/${entry.path}`,
      format: entry.format,
      index: entry.subset
    };
  });

  // Group by font properties
  const fontGroups = {};
  processedEntries.forEach(entry => {
    const key = `${entry.fontFamily}-${entry.fontWeight}-${entry.fontStyle}`;
    if (!fontGroups[key]) fontGroups[key] = [];
    fontGroups[key].push(entry);
  });

  // Count the number of font face declarations
  let fontFaceCount = 0;

  // Generate @font-face declarations for each font group
  Object.values(fontGroups).forEach(group => {
    if (group.length === 0) return;

    const { fontFamily, fontWeight, fontStyle } = group[0];

    // Log group info
    console.log(`📝 Creating @font-face rules for: ${fontFamily} (weight: ${fontWeight}, style: ${fontStyle})`);
    console.log(`   Generating ${group.length} subset declarations`);

    // For each font subset
    group.forEach(entry => {
      css += `@font-face {\n`;
      css += `  font-family: '${fontFamily}';\n`;
      css += `  font-style: ${fontStyle};\n`;
      css += `  font-weight: ${fontWeight};\n`;
      css += `  src: url('./${entry.src}') format('${entry.format}');\n`;
      css += `  unicode-range: ${entry.unicodeRange};\n`;
      css += `}\n\n`;
      fontFaceCount++;
    });
  });

  fs.writeFileSync(CSS_FILE, css);
  console.log(`✅ Generated CSS at ${CSS_FILE}`);
  console.log(`   Created ${fontFaceCount} @font-face declarations`);
}

// =======================================================
// Main Build Function
// =======================================================

/**
 * Build fonts - process all font files and generate CSS
 */
async function buildFonts() {
  console.log('🚀 LXGW Bright Webfont Builder');
  console.log('===============================');
  console.log('This script prepares font files for the webfont-lxgw-bright package.');
  console.log('It is intended for package maintainers only.\n');

  try {
    // Ensure directories exist
    ensureDirectories();

    // Check if fonttools is installed
    const hasPyftsubset = await checkPyftsubset();
    if (!hasPyftsubset) {
      console.error('❌ Cannot continue without fonttools. Please install it and try again.');
      process.exit(1);
    }

    // Empty the fonts directory to remove old files
    if (fs.existsSync(FONTS_DIR)) {
      const existingFiles = fs.readdirSync(FONTS_DIR);
      if (existingFiles.length > 0) {
        console.log(`🧹 Cleaning output directory (${existingFiles.length} files)...`);
        for (const file of existingFiles) {
          if (file !== '.gitkeep') {
            fs.unlinkSync(path.join(FONTS_DIR, file));
          }
        }
      }
    }

    // Check if source fonts exist
    if (!fs.existsSync(SRC_FONTS_DIR)) {
      console.error(`❌ Source fonts directory not found: ${SRC_FONTS_DIR}`);
      console.log('Please create this directory and add your font files.');
      process.exit(1);
    }

    // Get all font files
    const fontFiles = fs.readdirSync(SRC_FONTS_DIR)
      .filter(file => /\.(woff|woff2)$/i.test(file))
      .map(file => path.join(SRC_FONTS_DIR, file));

    if (fontFiles.length === 0) {
      console.error('❌ No .woff or .woff2 files found in source directory.');
      process.exit(1);
    }

    // Count fonts by format
    const woffFiles = fontFiles.filter(file => file.toLowerCase().endsWith('.woff'));
    const woff2Files = fontFiles.filter(file => file.toLowerCase().endsWith('.woff2'));

    console.log('\n📊 Font Format Statistics:');
    console.log(`- WOFF  files: ${woffFiles.length}`);
    console.log(`- WOFF2 files: ${woff2Files.length}`);
    console.log(`- Total files: ${fontFiles.length}\n`);

    console.log(`📦 Starting processing of ${fontFiles.length} font files...`);

    // Process each font
    const fontEntries = [];
    const formatSummary = {
      woff: { inputs: 0, outputs: 0 },
      woff2: { inputs: 0, outputs: 0 }
    };

    for (const fontPath of fontFiles) {
      const format = path.extname(fontPath).substring(1).toLowerCase();
      formatSummary[format].inputs++;

      const entries = await processFont(fontPath);
      if (entries) {
        if (Array.isArray(entries)) {
          formatSummary[format].outputs += entries.length;
        } else {
          formatSummary[format].outputs++;
        }
        fontEntries.push(entries);
      }
    }

    // Generate CSS
    generateCSS(fontEntries.flat());

    console.log('\n📊 Processing Summary:');
    console.log('---------------------');
    console.log('Input files:');
    console.log(`- WOFF:  ${formatSummary.woff.inputs} files`);
    console.log(`- WOFF2: ${formatSummary.woff2.inputs} files`);
    console.log('\nOutput files (after subsetting):');
    console.log(`- WOFF:  ${formatSummary.woff.outputs} files`);
    console.log(`- WOFF2: ${formatSummary.woff2.outputs} files`);
    console.log(`- Total: ${formatSummary.woff.outputs + formatSummary.woff2.outputs} files`);
    console.log('\n✅ Font processing complete!');
    console.log('The processed font files and CSS are ready for distribution.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// =======================================================
// CLI Tool
// =======================================================

/**
 * CLI tool - copy font files to user's project
 */
function runCliTool() {
  try {
    // Get user's current directory
    const userDir = process.cwd();
    const targetFontsDir = path.join(userDir, 'fonts');

    // Create fonts directory if it doesn't exist
    if (!fs.existsSync(targetFontsDir)) {
      fs.mkdirSync(targetFontsDir, { recursive: true });
      console.log(`✓ Created fonts directory at ${targetFontsDir}`);
    }

    // Copy CSS file
    const targetCssPath = path.join(targetFontsDir, 'lxgw-bright.css');
    fs.copyFileSync(CSS_FILE, targetCssPath);
    console.log(`✓ CSS file copied to ${targetCssPath}`);

    // Copy font files
    const fontFiles = fs.readdirSync(FONTS_DIR).filter(file => /\.(woff|woff2)$/i.test(file));
    console.log(`Copying ${fontFiles.length} font files...`);

    let filesCopied = 0;
    for (const file of fontFiles) {
      const sourceFile = path.join(FONTS_DIR, file);
      const targetFile = path.join(targetFontsDir, file);

      fs.copyFileSync(sourceFile, targetFile);
      filesCopied++;
    }

    console.log(`✓ Copied ${filesCopied} font files to ${targetFontsDir}`);
    console.log('\nTo use the fonts in your project:');
    console.log(`CSS import: @import url('./fonts/lxgw-bright.css');`);
    console.log(`HTML: <link rel="stylesheet" href="./fonts/lxgw-bright.css">`);
    console.log(`CSS usage: font-family: 'LXGWBright', sans-serif;`);
  } catch (err) {
    console.error('❌ Error installing fonts:', err);
    process.exit(1);
  }
}

// =======================================================
// Module Entry Point
// =======================================================

// If this script is run directly
if (require.main === module) {
  // Check if it's being run as a CLI tool
  const isCliTool = process.argv[1].includes('cli');

  if (isCliTool) {
    runCliTool();
  } else {
    buildFonts();
  }
}

// Export the public API
module.exports = {
  LXGWBright,
  configureLXGWBright,
  buildFonts,
  runCliTool
};
