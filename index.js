/**
 * LXGW Bright Webfont - Public API
 */

// Font family constants
const LXGWBright = 'LXGW Bright';

// Font weight constants
const WEIGHT_LIGHT = '300';
const WEIGHT_REGULAR = '400';
const WEIGHT_MEDIUM = '500';

// Font style constants
const STYLE_NORMAL = 'normal';
const STYLE_ITALIC = 'italic';

/**
 * Helper function to configure font
 * @param {Object} options Font options
 * @param {string} options.weight Font weight (default: '400')
 * @param {string} options.style Font style (default: 'normal')
 * @returns {Object} Font configuration
 */
function configureLXGWBright(options = {}) {
    const { weight = WEIGHT_REGULAR, style = STYLE_NORMAL } = options;

    return {
        fontFamily: LXGWBright,
        fontWeight: weight,
        fontStyle: style,
    };
}

// Preconfigured font styles
const LXGWBrightRegular = configureLXGWBright({ weight: WEIGHT_REGULAR, style: STYLE_NORMAL });
const LXGWBrightLight = configureLXGWBright({ weight: WEIGHT_LIGHT, style: STYLE_NORMAL });
const LXGWBrightMedium = configureLXGWBright({ weight: WEIGHT_MEDIUM, style: STYLE_NORMAL });
const LXGWBrightItalic = configureLXGWBright({ weight: WEIGHT_REGULAR, style: STYLE_ITALIC });
const LXGWBrightLightItalic = configureLXGWBright({ weight: WEIGHT_LIGHT, style: STYLE_ITALIC });
const LXGWBrightMediumItalic = configureLXGWBright({ weight: WEIGHT_MEDIUM, style: STYLE_ITALIC });

// Export the public API
module.exports = {
    LXGWBright,
    configureLXGWBright,

    // Weight constants
    WEIGHT_LIGHT,
    WEIGHT_REGULAR,
    WEIGHT_MEDIUM,

    // Style constants
    STYLE_NORMAL,
    STYLE_ITALIC,

    // Preconfigured styles
    LXGWBrightRegular,
    LXGWBrightLight,
    LXGWBrightMedium,
    LXGWBrightItalic,
    LXGWBrightLightItalic,
    LXGWBrightMediumItalic
};
