/**
 * LXGW Bright Webfont - Public API
 */

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

// Export the public API
module.exports = {
    LXGWBright,
    configureLXGWBright
};
