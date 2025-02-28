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

// Font family constants
const LXGWBright = 'LXGWBright';

// Helper function to configure font
function configureLXGWBright(options = {}) {
  const { weight = '400', style = 'normal' } = options;

  return {
    fontFamily: LXGWBright,
    fontWeight: weight,
    fontStyle: style,
  };
}

// Shared configuration
const PACKAGE_ROOT = path.join(__dirname, '..');
const FONTS_DIR = path.join(PACKAGE_ROOT, 'fonts');
const CSS_FILE = path.join(PACKAGE_ROOT, 'index.css');

// Font processing configuration
const SRC_FONTS_DIR = path.join(PACKAGE_ROOT, 'src-fonts');
const TEMP_DIR = path.join(PACKAGE_ROOT, 'temp');
const MAX_CHUNK_SIZE = 350 * 1024; // 350KB in bytes

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    console.log(`Created directory: ${FONTS_DIR}`);
  }

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    console.log(`Created temp directory: ${TEMP_DIR}`);
  }
}

// Unicode block ranges for splitting
const unicodeRanges = [
  // Basic ranges (Latin, European, etc.)
  { name: 'Basic Latin', start: 0x0000, end: 0x007F },
  { name: 'Latin-1 Supplement', start: 0x0080, end: 0x00FF },
  { name: 'Latin Extended-A', start: 0x0100, end: 0x017F },
  { name: 'Latin Extended-B', start: 0x0180, end: 0x024F },
  { name: 'IPA Extensions', start: 0x0250, end: 0x02AF },
  { name: 'Spacing Modifier Letters', start: 0x02B0, end: 0x02FF },
  { name: 'Combining Diacritical Marks', start: 0x0300, end: 0x036F },
  { name: 'Greek and Coptic', start: 0x0370, end: 0x03FF },
  { name: 'Cyrillic', start: 0x0400, end: 0x04FF },
  { name: 'Cyrillic Supplement', start: 0x0500, end: 0x052F },
  { name: 'General Punctuation', start: 0x2000, end: 0x206F },

  // CJK Symbols and Japanese syllabaries
  { name: 'CJK Symbols and Punctuation', start: 0x3000, end: 0x303F },
  { name: 'Hiragana', start: 0x3040, end: 0x309F },
  { name: 'Katakana', start: 0x30A0, end: 0x30FF },

  // CJK Extensions - divided into smaller chunks
  { name: 'CJK Unified Ideographs Extension A', start: 0x3400, end: 0x3BFF },
  { name: 'CJK Unified Ideographs Extension A 2', start: 0x3C00, end: 0x4DBF },

  // CJK Unified Ideographs - divided into many smaller chunks for more granular control
  { name: 'CJK Unified Ideographs 1-1', start: 0x4E00, end: 0x4FFF },
  { name: 'CJK Unified Ideographs 1-2', start: 0x5000, end: 0x51FF },
  { name: 'CJK Unified Ideographs 1-3', start: 0x5200, end: 0x53FF },
  { name: 'CJK Unified Ideographs 1-4', start: 0x5400, end: 0x55FF },
  { name: 'CJK Unified Ideographs 1-5', start: 0x5600, end: 0x57FF },
  { name: 'CJK Unified Ideographs 1-6', start: 0x5800, end: 0x59FF },
  { name: 'CJK Unified Ideographs 1-7', start: 0x5A00, end: 0x5BFF },
  { name: 'CJK Unified Ideographs 1-8', start: 0x5C00, end: 0x5DFF },
  { name: 'CJK Unified Ideographs 1-9', start: 0x5E00, end: 0x5FFF },

  { name: 'CJK Unified Ideographs 2-1', start: 0x6000, end: 0x61FF },
  { name: 'CJK Unified Ideographs 2-2', start: 0x6200, end: 0x63FF },
  { name: 'CJK Unified Ideographs 2-3', start: 0x6400, end: 0x65FF },
  { name: 'CJK Unified Ideographs 2-4', start: 0x6600, end: 0x67FF },
  { name: 'CJK Unified Ideographs 2-5', start: 0x6800, end: 0x69FF },
  { name: 'CJK Unified Ideographs 2-6', start: 0x6A00, end: 0x6BFF },
  { name: 'CJK Unified Ideographs 2-7', start: 0x6C00, end: 0x6DFF },
  { name: 'CJK Unified Ideographs 2-8', start: 0x6E00, end: 0x6FFF },

  { name: 'CJK Unified Ideographs 3-1', start: 0x7000, end: 0x71FF },
  { name: 'CJK Unified Ideographs 3-2', start: 0x7200, end: 0x73FF },
  { name: 'CJK Unified Ideographs 3-3', start: 0x7400, end: 0x75FF },
  { name: 'CJK Unified Ideographs 3-4', start: 0x7600, end: 0x77FF },
  { name: 'CJK Unified Ideographs 3-5', start: 0x7800, end: 0x79FF },
  { name: 'CJK Unified Ideographs 3-6', start: 0x7A00, end: 0x7BFF },
  { name: 'CJK Unified Ideographs 3-7', start: 0x7C00, end: 0x7DFF },
  { name: 'CJK Unified Ideographs 3-8', start: 0x7E00, end: 0x7FFF },

  { name: 'CJK Unified Ideographs 4-1', start: 0x8000, end: 0x81FF },
  { name: 'CJK Unified Ideographs 4-2', start: 0x8200, end: 0x83FF },
  { name: 'CJK Unified Ideographs 4-3', start: 0x8400, end: 0x85FF },
  { name: 'CJK Unified Ideographs 4-4', start: 0x8600, end: 0x87FF },
  { name: 'CJK Unified Ideographs 4-5', start: 0x8800, end: 0x89FF },
  { name: 'CJK Unified Ideographs 4-6', start: 0x8A00, end: 0x8BFF },
  { name: 'CJK Unified Ideographs 4-7', start: 0x8C00, end: 0x8DFF },
  { name: 'CJK Unified Ideographs 4-8', start: 0x8E00, end: 0x8FFF },

  { name: 'CJK Unified Ideographs 5-1', start: 0x9000, end: 0x91FF },
  { name: 'CJK Unified Ideographs 5-2', start: 0x9200, end: 0x93FF },
  { name: 'CJK Unified Ideographs 5-3', start: 0x9400, end: 0x95FF },
  { name: 'CJK Unified Ideographs 5-4', start: 0x9600, end: 0x97FF },
  { name: 'CJK Unified Ideographs 5-5', start: 0x9800, end: 0x99FF },
  { name: 'CJK Unified Ideographs 5-6', start: 0x9A00, end: 0x9BFF },
  { name: 'CJK Unified Ideographs 5-7', start: 0x9C00, end: 0x9DFF },
  { name: 'CJK Unified Ideographs 5-8', start: 0x9E00, end: 0x9FFF },

  // Other CJK blocks
  { name: 'CJK Compatibility Ideographs', start: 0xF900, end: 0xFAFF },
];

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

/**
 * Create a subset of a font for specific unicode ranges
 */
async function createFontSubset(fontPath, unicodeRange, outputPath) {
  const format = path.extname(fontPath).substring(1);

  // Create unicode range argument for pyftsubset
  const unicodes = unicodeRange.map(range => {
    return `U+${range.start.toString(16).toUpperCase()}-${range.end.toString(16).toUpperCase()}`;
  }).join(',');

  // Build the pyftsubset command - add layout features to preserve font behavior
  const command = `pyftsubset "${fontPath}" --unicodes="${unicodes}" --output-file="${outputPath}" --flavor=${format} --layout-features='*'`;

  try {
    await exec(command);

    // Verify the subset was created and is valid
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      return true;
    } else {
      console.error(`❌ Subsetting failed: Output file is empty or missing: ${outputPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error creating subset: ${error.message}`);
    return false;
  }
}

/**
 * Process a font file to create subsets
 */
async function processFont(fontPath) {
  const fontFileName = path.basename(fontPath);
  const fontFileExtension = path.extname(fontPath).substring(1); // Remove the dot
  const fontNameWithoutExtension = path.basename(fontPath, path.extname(fontPath));

  // Skip if not woff or woff2
  if (!['woff', 'woff2'].includes(fontFileExtension)) {
    console.log(`⏩ Skipping ${fontFileName} - not a woff/woff2 file`);
    return null;
  }

  const fontBuffer = fs.readFileSync(fontPath);
  const fontFileSize = fontBuffer.length;

  // If font is less than 1MB, just copy it
  if (fontFileSize < 1024 * 1024) {
    const outputPath = path.join(FONTS_DIR, fontFileName);
    fs.writeFileSync(outputPath, fontBuffer);
    console.log(`✓ Font ${fontFileName} is less than 1MB. Copied without splitting.`);
    return {
      fontFamily: fontNameWithoutExtension.split('-')[0],
      fontStyle: fontNameWithoutExtension.includes('Italic') ? 'italic' : 'normal',
      fontWeight: getFontWeight(fontNameWithoutExtension),
      format: fontFileExtension,
      src: `fonts/${fontFileName}`,
      unicodeRange: null,
      index: null
    };
  }

  // For fonts > 1MB, we need to analyze and split
  console.log(`🔄 Processing ${fontFileName} (${(fontFileSize / 1024 / 1024).toFixed(2)}MB)...`);

  try {
    // Filter unicode ranges to only include those likely to be in a CJK font
    const relevantRanges = unicodeRanges.filter(range => {
      // Include common ranges and CJK ranges
      return range.start < 0x1000 || range.start >= 0x3000;
    });

    // Calculate target size for each chunk (aim for chunks around 300-400KB)
    const targetChunkSize = 350 * 1024; // 350KB target
    const totalRanges = relevantRanges.length;

    // Estimate number of chunks needed based on font size
    const estimatedChunks = Math.ceil(fontFileSize / targetChunkSize);
    const rangesPerChunk = Math.ceil(totalRanges / estimatedChunks);

    console.log(`📏 Targeting ~${rangesPerChunk} unicode ranges per chunk, aiming for ~${(targetChunkSize / 1024).toFixed(0)}KB chunks`);

    // Group ranges into chunks
    const chunks = [];
    let currentChunk = [];

    for (let i = 0; i < relevantRanges.length; i++) {
      currentChunk.push(relevantRanges[i]);

      // Create a new chunk when we reach the target number of ranges
      // or when we're at the last range
      if (currentChunk.length >= rangesPerChunk || i === relevantRanges.length - 1) {
        if (currentChunk.length > 0) {
          chunks.push([...currentChunk]);
          currentChunk = [];
        }
      }
    }

    console.log(`✓ Created ${chunks.length} chunks for subsetting`);

    // Process each chunk and create subset font files
    const fontEntries = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const outputFileName = `${fontNameWithoutExtension}.${i}.${fontFileExtension}`;
      const outputPath = path.join(FONTS_DIR, outputFileName);

      // Create unicode range string for CSS
      const unicodeRangeStr = chunk.map(range =>
        `U+${range.start.toString(16).padStart(4, '0')}-${range.end.toString(16).padStart(4, '0')}`
      ).join(', ');

      // Create actual font subset
      console.log(`🔄 Creating subset ${i + 1}/${chunks.length}: ${unicodeRangeStr}`);
      const success = await createFontSubset(fontPath, chunk, outputPath);

      if (success) {
        // Verify the size of the subset file
        const subsetSize = fs.statSync(outputPath).size;
        console.log(`✓ Created subset ${outputFileName} (${(subsetSize / 1024).toFixed(2)}KB)`);

        fontEntries.push({
          fontFamily: fontNameWithoutExtension.split('-')[0],
          fontStyle: fontNameWithoutExtension.includes('Italic') ? 'italic' : 'normal',
          fontWeight: getFontWeight(fontNameWithoutExtension),
          format: fontFileExtension,
          src: `fonts/${outputFileName}`,
          unicodeRange: unicodeRangeStr,
          index: i
        });
      } else {
        console.error(`❌ Failed to create subset ${outputFileName}`);

        // Try an alternative approach
        try {
          console.log(`🔄 Attempting alternative method for ${outputFileName}...`);
          // Try with direct unicode-range specification
          const rangeArgs = chunk.map(range =>
            `U+${range.start.toString(16).toUpperCase()}-${range.end.toString(16).toUpperCase()}`
          ).join(',');

          const command = `pyftsubset "${fontPath}" --unicodes="${rangeArgs}" --output-file="${outputPath}" --flavor=${fontFileExtension} --layout-features='*'`;

          await exec(command);

          if (fs.existsSync(outputPath)) {
            const subsetSize = fs.statSync(outputPath).size;
            console.log(`✓ Created subset with direct method ${outputFileName} (${(subsetSize / 1024).toFixed(2)}KB)`);

            fontEntries.push({
              fontFamily: fontNameWithoutExtension.split('-')[0],
              fontStyle: fontNameWithoutExtension.includes('Italic') ? 'italic' : 'normal',
              fontWeight: getFontWeight(fontNameWithoutExtension),
              format: fontFileExtension,
              src: `fonts/${outputFileName}`,
              unicodeRange: unicodeRangeStr,
              index: i
            });
          }
        } catch (altError) {
          console.error(`❌ Alternative subsetting method failed for ${outputFileName}:`, altError.message);
        }
      }
    }

    console.log(`✅ Split ${fontFileName} into ${fontEntries.length} chunks`);
    return fontEntries;
  } catch (error) {
    console.error(`❌ Error processing ${fontFileName}:`, error);
    return null;
  }
}

/**
 * Generate CSS with @font-face declarations
 */
function generateCSS(fontEntries) {
  let css = '/* LXGW Bright Webfont */\n\n';

  // Group font entries by fontFamily, fontWeight, and fontStyle
  const fontGroups = {};

  fontEntries.forEach(entry => {
    if (Array.isArray(entry)) {
      entry.forEach(subEntry => {
        const key = `${subEntry.fontFamily}-${subEntry.fontWeight}-${subEntry.fontStyle}`;
        if (!fontGroups[key]) fontGroups[key] = [];
        fontGroups[key].push(subEntry);
      });
    } else if (entry) {
      const key = `${entry.fontFamily}-${entry.fontWeight}-${entry.fontStyle}`;
      if (!fontGroups[key]) fontGroups[key] = [];
      fontGroups[key].push(entry);
    }
  });

  // Generate @font-face declarations for each font group
  Object.values(fontGroups).forEach(group => {
    if (group.length === 0) return;

    const { fontFamily, fontWeight, fontStyle } = group[0];

    // For unsplit fonts (no unicode range)
    const unsplitFonts = group.filter(entry => !entry.unicodeRange);
    if (unsplitFonts.length > 0) {
      css += `@font-face {\n`;
      css += `    font-family: '${fontFamily}';\n`;
      css += `    font-style: ${fontStyle};\n`;
      css += `    font-weight: ${fontWeight};\n`;
      css += `    src: `;

      const srcEntries = unsplitFonts.map(entry => {
        return `url('./${entry.src}') format('${entry.format}')`;
      });

      css += srcEntries.join(',\n       ') + ';\n';
      css += `}\n\n`;
    }

    // For split fonts (with unicode range)
    const splitFonts = group.filter(entry => entry.unicodeRange);
    if (splitFonts.length > 0) {
      // Create a font-face declaration for each split file
      splitFonts.forEach(entry => {
        css += `@font-face {\n`;
        css += `    font-family: '${fontFamily}';\n`;
        css += `    font-style: ${fontStyle};\n`;
        css += `    font-weight: ${fontWeight};\n`;
        css += `    src: url('./${entry.src}') format('${entry.format}');\n`;
        css += `    unicode-range: ${entry.unicodeRange};\n`;
        css += `}\n\n`;
      });
    }
  });

  fs.writeFileSync(CSS_FILE, css);
  console.log(`✅ Generated CSS at ${CSS_FILE}`);
}

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

    console.log(`📦 Found ${fontFiles.length} font files to process`);

    // Process each font
    const fontEntries = [];
    for (const fontPath of fontFiles) {
      const entries = await processFont(fontPath);
      if (entries) {
        fontEntries.push(entries);
      }
    }

    // Generate CSS
    generateCSS(fontEntries.flat());

    console.log('\n✅ Font processing complete!');
    console.log('The processed font files and CSS are ready for distribution.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

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

// Determine whether we're running as a build script or CLI
if (require.main === module) {
  // Running directly from command line
  if (process.argv[1].includes('build-fonts')) {
    // Running as build script
    buildFonts();
  } else {
    // Running as CLI tool
    runCliTool();
  }
} else {
  // Being required as a module
  module.exports = {
    buildFonts,
    runCliTool,
    LXGWBright,
    configureLXGWBright
  };
}
