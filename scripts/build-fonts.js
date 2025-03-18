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

/**
 * 提供更简化的Unicode范围
 * @returns {Array} 简化后的Unicode范围
 */
function getSimplifiedUnicodeRanges() {
  return [
    { name: 'Basic Latin + Latin-1 Supplement', range: 'U+0000-00FF' },
    { name: 'CJK Symbols and Punctuation', range: 'U+3000-303F' },
    { name: 'CJK Common Characters', range: 'U+4E00-9FFF' } // 常用汉字
  ];
}

/**
 * Reads unicode ranges from the JSON file or uses simplified ranges
 * @returns {Array} Array of unicode range objects
 */
function readUnicodeRanges() {
  try {
    // 使用简化的Unicode范围，而不是从JSON文件读取
    console.log('Using simplified unicode ranges for better font size.');
    return getSimplifiedUnicodeRanges();
  } catch (error) {
    console.error(`Error reading unicode ranges: ${error.message}`);
    console.warn('Using simplified unicode ranges instead.');
    return getSimplifiedUnicodeRanges();
  }
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
  const baseName = `${fontFamily.replace(/\s+/g, '')}`;
  const isItalic = style === 'italic';

  // 特殊处理：如果是Regular Italic (400 italic)，字体文件通常命名为 "LXGWBright-Italic.ttf"
  if (weight === '400' && isItalic) {
    const extensions = ['.ttf', '.woff2', '.woff'];
    const italicName = `${baseName}-Italic`;

    for (const ext of extensions) {
      const filePath = path.join(SRC_FONTS_DIR, `${italicName}${ext}`);
      if (fs.existsSync(filePath)) {
        console.log(`Found source font: ${filePath}`);
        return filePath;
      }
    }
  }

  // 处理其他字体权重和样式
  const styleStr = isItalic ? 'Italic' : '';
  const weightName = weight === '400' ? 'Regular' :
    weight === '700' ? 'Bold' :
      weight === '300' ? 'Light' :
        weight === '500' ? 'Medium' : weight;

  // 检查不同的命名格式和文件扩展名
  const possibleNames = [
    // 标准格式: LXGWBright-Light, LXGWBright-LightItalic, 等
    `${baseName}-${weightName}${styleStr}`,
    // 使用数字格式的权重: LXGWBright-300, LXGWBright-300Italic, 等
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
  const command = `pyftsubset "${ttfSrcFont}" --output-file="${destFont}" --flavor=${fontFormat} --unicodes=${unicodeRange} --layout-features='*' --no-hinting --desubroutinize --ignore-missing-glyphs`;

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

  // 添加斜体标识
  const styleStr = fontStyle === 'italic' ? 'Italic' : '';

  // 修改输出文件名以包含斜体标识
  // 特殊处理Regular斜体，命名应为LXGWBright-Italic而非LXGWBright-RegularItalic
  let outputBaseName;
  if (fontWeight === '400' && fontStyle === 'italic') {
    outputBaseName = `${fontFamily.replace(/\s+/g, '')}-Italic`;
  } else {
    outputBaseName = `${fontFamily.replace(/\s+/g, '')}-${weightName}${styleStr}`;
  }

  for (const [index, rangeObj] of unicodeRanges.entries()) {
    const { name, range } = rangeObj;

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
    configureLXGWBright({ weight: '400', style: 'normal' }), // Regular
    configureLXGWBright({ weight: '300', style: 'normal' }), // Light
    configureLXGWBright({ weight: '500', style: 'normal' }), // Medium
    configureLXGWBright({ weight: '400', style: 'italic' }), // Regular Italic
    configureLXGWBright({ weight: '300', style: 'italic' }), // Light Italic
    configureLXGWBright({ weight: '500', style: 'italic' }), // Medium Italic
  ];

  const fontVariants = [];

  for (const config of fontConfigs) {
    try {
      const variant = await buildFontVariations(config);
      fontVariants.push(variant);
    } catch (error) {
      console.error(`Error building font variation: ${error.message}`);
      console.error(`Skipping ${config.fontFamily} ${config.fontWeight} ${config.fontStyle}`);
    }
  }

  // Generate CSS file
  const css = generateCSS(fontVariants);
  fs.writeFileSync(CSS_FILE, css, 'utf8');

  console.log(`Generated CSS file at ${CSS_FILE}`);
  console.log('All fonts have been built successfully!');
}

/**
 * Validates that all font files referenced in the CSS file exist in the fonts directory
 * @returns {Promise<boolean>} True if all referenced fonts exist
 */
async function validateReferencedFonts() {
  console.log('Validating that all referenced font files exist...');
  let isValid = true;

  try {
    // Read the CSS file
    const cssContent = fs.readFileSync(CSS_FILE, 'utf8');

    // Extract all font file references using regex
    const fontRegex = /url\(['"]?\.\/(fonts\/[^'"]+)['"]?\)/g;
    const referencedFonts = new Set();
    let match;

    while ((match = fontRegex.exec(cssContent)) !== null) {
      const fontPath = path.join(PACKAGE_ROOT, match[1]);
      referencedFonts.add(fontPath);

      if (!fs.existsSync(fontPath)) {
        console.error(`ERROR: Referenced font file does not exist: ${fontPath}`);
        isValid = false;
      }
    }

    if (isValid) {
      console.log('All referenced font files exist in the fonts directory.');
    }

    return { isValid, referencedFonts };
  } catch (error) {
    console.error(`Error validating referenced fonts: ${error.message}`);
    return { isValid: false, referencedFonts: new Set() };
  }
}

/**
 * Validates that all font files in the fonts directory are referenced in the CSS file
 * @param {Set<string>} referencedFonts Set of font paths referenced in the CSS
 * @returns {boolean} True if all font files are referenced
 */
async function validateUnusedFonts(referencedFonts) {
  console.log('Validating that there are no unused font files...');
  let isValid = true;

  try {
    // Get all files in the fonts directory
    const fontFiles = fs.readdirSync(FONTS_DIR)
      .filter(fileName => fileName !== '.gitkeep') // Exclude .gitkeep files
      .map(file => path.join(FONTS_DIR, file));

    // Check for files that aren't referenced in the CSS
    for (const fontFile of fontFiles) {
      if (!referencedFonts.has(fontFile)) {
        console.error(`ERROR: Unused font file found: ${fontFile}`);
        isValid = false;
      }
    }

    if (isValid) {
      console.log('All font files in the fonts directory are referenced in the CSS.');
    }

    return isValid;
  } catch (error) {
    console.error(`Error validating unused fonts: ${error.message}`);
    return false;
  }
}

/**
 * 清空字体目录中的所有woff和woff2文件
 * @returns {Promise<void>}
 */
async function cleanFontsDirectory() {
  console.log('Cleaning fonts directory...');

  // 确保fonts目录存在
  ensureFontsDir();

  try {
    // 读取fonts目录中的所有文件
    const files = fs.readdirSync(FONTS_DIR);

    // 计数已删除的文件
    let deletedCount = 0;

    // 遍历并删除所有.woff和.woff2文件
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();

      if (ext === '.woff' || ext === '.woff2') {
        const filePath = path.join(FONTS_DIR, file);
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }

    console.log(`Deleted ${deletedCount} font files from ${FONTS_DIR}`);
  } catch (error) {
    console.error(`Error cleaning fonts directory: ${error.message}`);
    throw error;
  }
}

// =======================================================
// Main Function
// =======================================================

/**
 * Main function
 */
async function main() {
  try {
    // 清空fonts目录
    await cleanFontsDirectory();

    // Build all fonts
    await buildAllFonts();

    // Validate fonts
    const { isValid: referencedValid, referencedFonts } = await validateReferencedFonts();
    const unusedValid = await validateUnusedFonts(referencedFonts);

    if (!referencedValid || !unusedValid) {
      console.error('Font validation failed. Please check the errors above.');
      process.exit(1);
    }

    console.log('Font validation passed. All font files are correctly referenced and used.');
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