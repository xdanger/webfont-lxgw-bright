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
 * Determine font weight from font name
 */
function getFontWeight(fontName) {
  if (fontName.includes('Light')) return 300;
  if (fontName.includes('Medium')) return 500;
  return 400; // Regular
}

/**
 * Check if pyftsubset is available
 */
async function checkPyftsubset() {
  try {
    await execPromise('pyftsubset --help');
    return true;
  } catch (error) {
    console.error('❌ pyftsubset not found. Please install fonttools:');
    console.error('   pip install fonttools brotli zopfli');
    return false;
  }
}

// =======================================================
// Font Processing with fonttools
// =======================================================

/**
 * Process a single font file with fonttools
 * @param {string} fontPath Path to the font file
 * @param {number} rangeIndex Index of the Unicode range to process
 * @returns {Promise<object>} Font entry information
 */
async function processFontSubset(fontPath, rangeIndex) {
  const fontFileName = path.basename(fontPath);
  const fontFileExtension = path.extname(fontPath).substring(1).toLowerCase();
  const fontNameWithoutExtension = path.basename(fontPath, path.extname(fontPath));

  const range = unicodeRanges[rangeIndex];
  const outPath = path.join(
    FONTS_DIR,
    `${fontNameWithoutExtension}.${rangeIndex}.${fontFileExtension}`
  );

  // Skip processing if output file already exists and has reasonable size
  if (fs.existsSync(outPath)) {
    try {
      const stats = fs.statSync(outPath);
      if (stats.size > 0 && stats.size < 500 * 1024) { // 500KB is a reasonable threshold for subset
        console.log(`⏩ Skipping already processed subset: ${path.basename(outPath)}`);
        return {
          subset: rangeIndex,
          unicodeRange: range.range,
          path: path.basename(outPath),
          name: fontNameWithoutExtension,
          format: fontFileExtension
        };
      } else {
        console.log(`🔄 Reprocessing subset because file size (${Math.round(stats.size / 1024)}KB) suggests incorrect subsetting`);
      }
    } catch (err) {
      console.log(`⚠️ Error checking existing file, will reprocess: ${err.message}`);
    }
  }

  console.log(`\n⏳ Creating subset ${rangeIndex + 1}/${unicodeRanges.length}: ${range.name}`);
  console.log(`👉 Unicode range: ${range.range}`);
  console.log(`🔠 Output format: ${fontFileExtension.toUpperCase()}`);

  const startTime = Date.now();

  try {
    // Build the pyftsubset command
    const command = `pyftsubset "${fontPath}" --unicodes="${range.range}" --flavor=${fontFileExtension} --output-file="${outPath}" --layout-features='*' --glyph-names --symbol-cmap --legacy-cmap --notdef-glyph --notdef-outline --recommended-glyphs --name-legacy --name-IDs='*' --name-languages='*'`;

    console.log(`🔄 Running fonttools subsetting command...`);

    // Execute the command
    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stderr.includes('INFO')) {
      console.warn(`⚠️ Warning from pyftsubset: ${stderr}`);
    }

    // Check if the output file was created and has a reasonable size
    if (fs.existsSync(outPath)) {
      const stats = fs.statSync(outPath);
      const outputKB = Math.round(stats.size / 1024);

      // Validate that subsetting worked properly
      if (stats.size === 0) {
        throw new Error('Output file is empty');
      }

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Created: ${path.basename(outPath)} (${outputKB}KB) in ${processingTime} seconds`);

      return {
        subset: rangeIndex,
        unicodeRange: range.range,
        path: path.basename(outPath),
        name: fontNameWithoutExtension,
        format: fontFileExtension
      };
    } else {
      throw new Error('Output file was not created');
    }
  } catch (error) {
    console.error(`❌ Error processing font subset: ${error.message}`);
    return null;
  }
}

/**
 * Process a single font file for all unicode ranges
 * @param {string} fontPath Path to the font file
 * @returns {Promise<Array>} Array of font entries
 */
async function processFont(fontPath) {
  try {
    const fontFileName = path.basename(fontPath);
    const fontFileExtension = path.extname(fontPath).substring(1).toLowerCase();

    console.log(`\n🔤 Processing font: ${fontFileName}`);
    console.log(`📝 Format: ${fontFileExtension.toUpperCase()}`);

    // Start timing the processing
    const startTime = Date.now();

    // Each subset range will become a separate file
    let entries = [];

    // Process ranges in smaller batches to avoid overwhelming the system
    const batchSize = 4; // Process 4 ranges at a time
    const ranges = [...Array(unicodeRanges.length).keys()]; // [0, 1, 2, ..., unicodeRanges.length-1]

    // Setup progress tracking
    let successCount = 0;
    let failureCount = 0;
    const totalRanges = ranges.length;

    for (let i = 0; i < ranges.length; i += batchSize) {
      const batch = ranges.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(ranges.length / batchSize);

      console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} ranges)`);
      console.log(`📊 Progress: ${Math.round((i / ranges.length) * 100)}% complete`);
      console.log(`📈 Stats: ${successCount} successful, ${failureCount} failed, ${totalRanges - (successCount + failureCount)} remaining`);

      // Process each range in the batch concurrently
      const promises = batch.map(rangeIndex =>
        processFontSubset(fontPath, rangeIndex)
          .catch(err => {
            console.error(`❌ Failed processing range ${rangeIndex} (${unicodeRanges[rangeIndex].name}): ${err.message}`);
            failureCount++;
            return null;
          })
      );

      // Wait for this batch to complete
      const results = await Promise.all(promises);

      // Collect successful results
      results.forEach(result => {
        if (result) {
          entries.push(result);
          successCount++;
        }
      });

      // Add a small delay between batches
      if (i + batchSize < ranges.length) {
        console.log(`⏱️ Pausing for 500ms to allow system recovery...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Calculate processing time
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Completed processing ${fontFileName} in ${processingTime} seconds`);
    console.log(`📦 Created ${entries.length} subset files`);
    console.log(`📊 Final stats: ${successCount} successful, ${failureCount} failed out of ${totalRanges} ranges`);

    return entries;
  } catch (error) {
    console.error(`❌ Error processing font ${path.basename(fontPath)}:`, error);
    return [];
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

  return css;
}

// =======================================================
// Main Build Function
// =======================================================

/**
 * Build fonts process
 */
async function buildFonts() {
  try {
    console.log('🚀 Starting LXGW Bright font processing with fonttools');
    console.log('⚙️ Using optimized settings for better subsetting');

    // Check if pyftsubset is available
    const pyftsubsetAvailable = await checkPyftsubset();
    if (!pyftsubsetAvailable) {
      throw new Error('pyftsubset is required for this script to work');
    }

    // Ensure directories exist
    ensureDirectories();

    // Clean up any old files
    try {
      const files = fs.readdirSync(FONTS_DIR);
      let deletedCount = 0;
      for (const file of files) {
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(FONTS_DIR, file));
          deletedCount++;
        }
      }
      console.log(`🧹 Cleaned up ${deletedCount} old font files`);
    } catch (error) {
      console.warn(`⚠️ Warning: Could not clean old files: ${error.message}`);
    }

    // Check for source fonts
    const fontFiles = fs.readdirSync(SRC_FONTS_DIR)
      .filter(file =>
        (file.endsWith('.woff') || file.endsWith('.woff2')) &&
        file.startsWith('LXGWBright')
      );

    if (fontFiles.length === 0) {
      throw new Error('No source font files found in ' + SRC_FONTS_DIR);
    }

    console.log(`\n📚 Found ${fontFiles.length} source font files`);

    // Log font formats found
    const woffFiles = fontFiles.filter(file => file.endsWith('.woff')).length;
    const woff2Files = fontFiles.filter(file => file.endsWith('.woff2')).length;
    console.log(`📊 Font formats: ${woffFiles} WOFF files, ${woff2Files} WOFF2 files\n`);

    // Process each font file, with error handling and recovery
    const allEntries = [];
    const fontResults = {
      successful: 0,
      failed: 0,
      total: fontFiles.length
    };

    // Process fonts in sequence to avoid memory issues
    for (let i = 0; i < fontFiles.length; i++) {
      const fontFile = fontFiles[i];
      const fontPath = path.join(SRC_FONTS_DIR, fontFile);

      console.log(`\n📂 Processing font ${i + 1}/${fontFiles.length}: ${fontFile}`);

      try {
        const entries = await processFont(fontPath);
        if (entries.length > 0) {
          allEntries.push(...entries);
          fontResults.successful++;
          console.log(`✅ Successfully processed ${fontFile} with ${entries.length} subsets`);
        } else {
          fontResults.failed++;
          console.error(`❌ Failed to generate any subsets for ${fontFile}`);
        }
      } catch (error) {
        fontResults.failed++;
        console.error(`❌ Error processing font ${fontFile}:`, error);
      }

      // Report progress after each font
      console.log(`\n📈 Overall progress: ${i + 1}/${fontFiles.length} fonts processed`);
      console.log(`📊 Font processing stats: ${fontResults.successful} successful, ${fontResults.failed} failed`);

      // Add a small delay between fonts to let system resources settle
      if (i < fontFiles.length - 1) {
        console.log(`⏱️ Pausing for 1 second before next font...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Generate CSS with font-face rules
    if (allEntries.length > 0) {
      console.log('\n🎨 Generating CSS file with @font-face declarations...');
      const cssContent = generateCSS(allEntries);
      fs.writeFileSync(CSS_FILE, cssContent);
      console.log(`✅ Generated CSS at ${CSS_FILE}`);
      console.log(`   Created ${allEntries.length} @font-face declarations`);
    } else {
      console.error('❌ No font entries were generated, cannot create CSS file');
    }

    // Processing summary
    const woffOutputs = allEntries.filter(entry => entry.format === 'woff').length;
    const woff2Outputs = allEntries.filter(entry => entry.format === 'woff2').length;

    console.log('\n📊 Processing Summary:');
    console.log('---------------------');
    console.log('Input files:');
    console.log(`- WOFF:  ${woffFiles} files`);
    console.log(`- WOFF2: ${woff2Files} files`);
    console.log('\nOutput files (after subsetting):');
    console.log(`- WOFF:  ${woffOutputs} files`);
    console.log(`- WOFF2: ${woff2Outputs} files`);
    console.log(`- Total: ${allEntries.length} files`);
    console.log(`\nFonts processed: ${fontResults.successful}/${fontFiles.length} successful`);

    if (fontResults.failed > 0) {
      console.log(`⚠️ Warning: ${fontResults.failed} fonts failed to process completely`);
      console.log(`   However, the process was able to continue and generate ${allEntries.length} subset files.`);
    }

    console.log('\n✅ Font processing complete!');
    console.log('The processed font files and CSS are ready for distribution.');

    return {
      success: allEntries.length > 0,
      entries: allEntries,
      stats: {
        inputFonts: fontFiles.length,
        successfulFonts: fontResults.successful,
        failedFonts: fontResults.failed,
        totalSubsets: allEntries.length
      }
    };
  } catch (error) {
    console.error('\n❌ Error building fonts:', error);
    return { success: false, error };
  } finally {
    // Clean up temp directory
    try {
      if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true, force: true });
        console.log('🧹 Cleaned up temporary files');
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not clean up temp directory: ${error.message}`);
    }
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
    console.log(`CSS usage: font-family: 'LXGW Bright', sans-serif;`);
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
    buildFonts().catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
  }
}

// Export the public API
module.exports = {
  LXGWBright,
  configureLXGWBright,
  buildFonts,
  runCliTool
};
