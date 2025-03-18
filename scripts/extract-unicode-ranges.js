/**
 * Extract Unicode Ranges from Google Fonts CSS
 *
 * This script parses the unicode-range values from Google Fonts CSS
 * and converts them into a structured JSON file for reuse in font subsetting.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap';
const OUTPUT_FILE = path.join(__dirname, 'unicode-ranges.json');

// Unicode block definitions for naming ranges
const UNICODE_BLOCKS = [
  { start: 0x0000, end: 0x007F, name: "Basic Latin" },
  { start: 0x0080, end: 0x00FF, name: "Latin-1 Supplement" },
  { start: 0x0100, end: 0x017F, name: "Latin Extended-A" },
  { start: 0x0180, end: 0x024F, name: "Latin Extended-B" },
  { start: 0x0250, end: 0x02AF, name: "IPA Extensions" },
  { start: 0x02B0, end: 0x02FF, name: "Spacing Modifier Letters" },
  { start: 0x0300, end: 0x036F, name: "Combining Diacritical Marks" },
  { start: 0x0370, end: 0x03FF, name: "Greek and Coptic" },
  { start: 0x0400, end: 0x04FF, name: "Cyrillic" },
  { start: 0x0500, end: 0x052F, name: "Cyrillic Supplement" },
  { start: 0x0530, end: 0x058F, name: "Armenian" },
  { start: 0x0590, end: 0x05FF, name: "Hebrew" },
  { start: 0x0600, end: 0x06FF, name: "Arabic" },
  { start: 0x0900, end: 0x097F, name: "Devanagari" },
  { start: 0x0980, end: 0x09FF, name: "Bengali" },
  { start: 0x0A00, end: 0x0A7F, name: "Gurmukhi" },
  { start: 0x0A80, end: 0x0AFF, name: "Gujarati" },
  { start: 0x0B00, end: 0x0B7F, name: "Oriya" },
  { start: 0x0B80, end: 0x0BFF, name: "Tamil" },
  { start: 0x0C00, end: 0x0C7F, name: "Telugu" },
  { start: 0x0C80, end: 0x0CFF, name: "Kannada" },
  { start: 0x0D00, end: 0x0D7F, name: "Malayalam" },
  { start: 0x0D80, end: 0x0DFF, name: "Sinhala" },
  { start: 0x0E00, end: 0x0E7F, name: "Thai" },
  { start: 0x0E80, end: 0x0EFF, name: "Lao" },
  { start: 0x0F00, end: 0x0FFF, name: "Tibetan" },
  { start: 0x1000, end: 0x109F, name: "Myanmar" },
  { start: 0x10A0, end: 0x10FF, name: "Georgian" },
  { start: 0x1100, end: 0x11FF, name: "Hangul Jamo" },
  { start: 0x1200, end: 0x137F, name: "Ethiopic" },
  { start: 0x13A0, end: 0x13FF, name: "Cherokee" },
  { start: 0x1400, end: 0x167F, name: "Unified Canadian Aboriginal Syllabics" },
  { start: 0x1680, end: 0x169F, name: "Ogham" },
  { start: 0x16A0, end: 0x16FF, name: "Runic" },
  { start: 0x1700, end: 0x171F, name: "Tagalog" },
  { start: 0x1720, end: 0x173F, name: "Hanunoo" },
  { start: 0x1740, end: 0x175F, name: "Buhid" },
  { start: 0x1760, end: 0x177F, name: "Tagbanwa" },
  { start: 0x1780, end: 0x17FF, name: "Khmer" },
  { start: 0x1800, end: 0x18AF, name: "Mongolian" },
  { start: 0x1900, end: 0x194F, name: "Limbu" },
  { start: 0x1950, end: 0x197F, name: "Tai Le" },
  { start: 0x19E0, end: 0x19FF, name: "Khmer Symbols" },
  { start: 0x1D00, end: 0x1D7F, name: "Phonetic Extensions" },
  { start: 0x1E00, end: 0x1EFF, name: "Latin Extended Additional" },
  { start: 0x1F00, end: 0x1FFF, name: "Greek Extended" },
  { start: 0x2000, end: 0x206F, name: "General Punctuation" },
  { start: 0x2070, end: 0x209F, name: "Superscripts and Subscripts" },
  { start: 0x20A0, end: 0x20CF, name: "Currency Symbols" },
  { start: 0x20D0, end: 0x20FF, name: "Combining Diacritical Marks for Symbols" },
  { start: 0x2100, end: 0x214F, name: "Letterlike Symbols" },
  { start: 0x2150, end: 0x218F, name: "Number Forms" },
  { start: 0x2190, end: 0x21FF, name: "Arrows" },
  { start: 0x2200, end: 0x22FF, name: "Mathematical Operators" },
  { start: 0x2300, end: 0x23FF, name: "Miscellaneous Technical" },
  { start: 0x2400, end: 0x243F, name: "Control Pictures" },
  { start: 0x2440, end: 0x245F, name: "Optical Character Recognition" },
  { start: 0x2460, end: 0x24FF, name: "Enclosed Alphanumerics" },
  { start: 0x2500, end: 0x257F, name: "Box Drawing" },
  { start: 0x2580, end: 0x259F, name: "Block Elements" },
  { start: 0x25A0, end: 0x25FF, name: "Geometric Shapes" },
  { start: 0x2600, end: 0x26FF, name: "Miscellaneous Symbols" },
  { start: 0x2700, end: 0x27BF, name: "Dingbats" },
  { start: 0x27C0, end: 0x27EF, name: "Miscellaneous Mathematical Symbols-A" },
  { start: 0x27F0, end: 0x27FF, name: "Supplemental Arrows-A" },
  { start: 0x2800, end: 0x28FF, name: "Braille Patterns" },
  { start: 0x2900, end: 0x297F, name: "Supplemental Arrows-B" },
  { start: 0x2980, end: 0x29FF, name: "Miscellaneous Mathematical Symbols-B" },
  { start: 0x2A00, end: 0x2AFF, name: "Supplemental Mathematical Operators" },
  { start: 0x2B00, end: 0x2BFF, name: "Miscellaneous Symbols and Arrows" },
  { start: 0x2E80, end: 0x2EFF, name: "CJK Radicals Supplement" },
  { start: 0x2F00, end: 0x2FDF, name: "Kangxi Radicals" },
  { start: 0x2FF0, end: 0x2FFF, name: "Ideographic Description Characters" },
  { start: 0x3000, end: 0x303F, name: "CJK Symbols and Punctuation" },
  { start: 0x3040, end: 0x309F, name: "Hiragana" },
  { start: 0x30A0, end: 0x30FF, name: "Katakana" },
  { start: 0x3100, end: 0x312F, name: "Bopomofo" },
  { start: 0x3130, end: 0x318F, name: "Hangul Compatibility Jamo" },
  { start: 0x3190, end: 0x319F, name: "Kanbun" },
  { start: 0x31A0, end: 0x31BF, name: "Bopomofo Extended" },
  { start: 0x31F0, end: 0x31FF, name: "Katakana Phonetic Extensions" },
  { start: 0x3200, end: 0x32FF, name: "Enclosed CJK Letters and Months" },
  { start: 0x3300, end: 0x33FF, name: "CJK Compatibility" },
  { start: 0x3400, end: 0x4DBF, name: "CJK Unified Ideographs Extension A" },
  { start: 0x4DC0, end: 0x4DFF, name: "Yijing Hexagram Symbols" },
  { start: 0x4E00, end: 0x9FFF, name: "CJK Unified Ideographs" },
  { start: 0xA000, end: 0xA48F, name: "Yi Syllables" },
  { start: 0xA490, end: 0xA4CF, name: "Yi Radicals" },
  { start: 0xAC00, end: 0xD7AF, name: "Hangul Syllables" },
  { start: 0xD800, end: 0xDB7F, name: "High Surrogates" },
  { start: 0xDB80, end: 0xDBFF, name: "High Private Use Surrogates" },
  { start: 0xDC00, end: 0xDFFF, name: "Low Surrogates" },
  { start: 0xE000, end: 0xF8FF, name: "Private Use Area" },
  { start: 0xF900, end: 0xFAFF, name: "CJK Compatibility Ideographs" },
  { start: 0xFB00, end: 0xFB4F, name: "Alphabetic Presentation Forms" },
  { start: 0xFB50, end: 0xFDFF, name: "Arabic Presentation Forms-A" },
  { start: 0xFE00, end: 0xFE0F, name: "Variation Selectors" },
  { start: 0xFE10, end: 0xFE1F, name: "Vertical Forms" },
  { start: 0xFE20, end: 0xFE2F, name: "Combining Half Marks" },
  { start: 0xFE30, end: 0xFE4F, name: "CJK Compatibility Forms" },
  { start: 0xFE50, end: 0xFE6F, name: "Small Form Variants" },
  { start: 0xFE70, end: 0xFEFF, name: "Arabic Presentation Forms-B" },
  { start: 0xFF00, end: 0xFFEF, name: "Halfwidth and Fullwidth Forms" },
  { start: 0xFFF0, end: 0xFFFF, name: "Specials" },
  { start: 0x10000, end: 0x1007F, name: "Linear B Syllabary" },
  { start: 0x10080, end: 0x100FF, name: "Linear B Ideograms" },
  { start: 0x10100, end: 0x1013F, name: "Aegean Numbers" },
  { start: 0x10300, end: 0x1032F, name: "Old Italic" },
  { start: 0x10330, end: 0x1034F, name: "Gothic" },
  { start: 0x10380, end: 0x1039F, name: "Ugaritic" },
  { start: 0x10400, end: 0x1044F, name: "Deseret" },
  { start: 0x10450, end: 0x1047F, name: "Shavian" },
  { start: 0x10480, end: 0x104AF, name: "Osmanya" },
  { start: 0x10800, end: 0x1083F, name: "Cypriot Syllabary" },
  { start: 0x1D000, end: 0x1D0FF, name: "Byzantine Musical Symbols" },
  { start: 0x1D100, end: 0x1D1FF, name: "Musical Symbols" },
  { start: 0x1D300, end: 0x1D35F, name: "Tai Xuan Jing Symbols" },
  { start: 0x1D400, end: 0x1D7FF, name: "Mathematical Alphanumeric Symbols" },
  { start: 0x20000, end: 0x2A6DF, name: "CJK Unified Ideographs Extension B" },
  { start: 0x2F800, end: 0x2FA1F, name: "CJK Compatibility Ideographs Supplement" },
  { start: 0xE0000, end: 0xE007F, name: "Tags" },
  { start: 0xE0100, end: 0xE01EF, name: "Variation Selectors Supplement" },
  { start: 0xF0000, end: 0xFFFFF, name: "Supplementary Private Use Area-A" },
  { start: 0x100000, end: 0x10FFFF, name: "Supplementary Private Use Area-B" }
];

/**
 * Analyzes a unicode range to determine which Unicode block it belongs to
 * @param {string} rangeString - The unicode range string (e.g., "U+4E00-9FFF")
 * @returns {string} - A descriptive name for the range
 */
function getDescriptiveRangeName(rangeString) {
  // Extract the first code point in the range to determine a general block
  const parts = rangeString.split(',')[0].trim();
  const rangeMatch = parts.match(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/i);

  if (!rangeMatch) {
    return "Unknown Range";
  }

  // Get the starting code point
  const startHex = rangeMatch[1];
  const startCodePoint = parseInt(startHex, 16);

  // Find the corresponding Unicode block
  for (const block of UNICODE_BLOCKS) {
    if (startCodePoint >= block.start && startCodePoint <= block.end) {
      return block.name;
    }
  }

  // If no specific block is found, provide a general category
  if (startCodePoint >= 0x4E00 && startCodePoint <= 0x9FFF) {
    return "CJK Unified Ideographs";
  } else if (startCodePoint >= 0x3400 && startCodePoint <= 0x4DBF) {
    return "CJK Extension A";
  } else if (startCodePoint >= 0x20000 && startCodePoint <= 0x2A6DF) {
    return "CJK Extension B";
  } else if (startCodePoint >= 0x0000 && startCodePoint <= 0x007F) {
    return "Basic Latin";
  } else if (startCodePoint >= 0x0080 && startCodePoint <= 0x024F) {
    return "Latin Extended";
  } else if (startCodePoint >= 0xFF00 && startCodePoint <= 0xFFEF) {
    return "Fullwidth and Halfwidth Forms";
  }

  return `Unicode U+${startHex}`;
}

/**
 * Cleans and normalizes a unicode range string
 * @param {string} rangeString - The unicode range string with potential linebreaks
 * @returns {string} - A cleaned range string
 */
function cleanUnicodeRange(rangeString) {
  return rangeString
    .replace(/\n/g, '') // Remove line breaks
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Parses a CSS file and extracts all unicode-range declarations
 * @param {string} cssContent - The CSS file content as a string
 * @returns {Array} - Array of unicode range objects
 */
function extractUnicodeRanges(cssContent) {
  const ranges = [];

  // First, normalize line breaks in the CSS to handle unicode-range declarations that span multiple lines
  const normalizedContent = cssContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Extract the font-face blocks to process each one separately
  const fontFaceBlocks = normalizedContent.match(/@font-face\s*\{[^}]+\}/g) || [];

  fontFaceBlocks.forEach((block, blockIndex) => {
    // Extract the unicode-range property from the block
    const unicodeRangeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (unicodeRangeMatch && unicodeRangeMatch[1]) {
      // Clean up the range value
      const rangeValue = cleanUnicodeRange(unicodeRangeMatch[1]);

      if (rangeValue) {
        // Get a descriptive name for this range
        const descriptiveName = getDescriptiveRangeName(rangeValue);

        // Create an object for this range
        ranges.push({
          name: `${descriptiveName} (Range ${blockIndex + 1})`,
          range: rangeValue,
          index: blockIndex
        });
      }
    }
  });

  return ranges;
}

/**
 * Fetches CSS content from a URL
 * @param {string} url - The URL to fetch from
 * @returns {Promise<string>} - Promise resolving to the CSS content
 */
function fetchCSSFromURL(url) {
  return new Promise((resolve, reject) => {
    // Set up headers to simulate a browser request
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Accept': 'text/css,*/*;q=0.1'
      }
    };

    https.get(url, options, (response) => {
      // Handle HTTP redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Following redirect to: ${response.headers.location}`);
        return fetchCSSFromURL(response.headers.location).then(resolve).catch(reject);
      }

      // Check for successful response
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to fetch CSS: HTTP status ${response.statusCode}`));
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch CSS: ${err.message}`));
    });
  });
}

/**
 * Process the CSS content and generate the JSON output
 */
async function processFile() {
  try {
    // Fetch the CSS from URL
    console.log(`Fetching CSS from URL: ${CSS_URL}`);
    const cssContent = await fetchCSSFromURL(CSS_URL);

    if (!cssContent || cssContent.trim() === '') {
      throw new Error('Fetched CSS content is empty!');
    }

    // Extract the unicode ranges
    const ranges = extractUnicodeRanges(cssContent);

    if (ranges.length === 0) {
      throw new Error('No unicode-range values found in the CSS content!');
    }

    console.log(`Found ${ranges.length} unicode range declarations.`);

    // Create the output object
    const outputData = {
      source: "Google Fonts - Noto Serif SC",
      extractDate: new Date().toISOString(),
      totalRanges: ranges.length,
      ranges: ranges
    };

    // Write the JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');

    console.log(`Successfully extracted unicode ranges and saved to: ${OUTPUT_FILE}`);
    console.log(`Total ranges: ${ranges.length}`);
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
  }
}

// Execute the script
processFile();