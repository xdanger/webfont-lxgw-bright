/**
 * LXGW Bright Webfont
 *
 * 这个文件提供了便捷的字体常量和配置函数
 */

"use strict";

// Import CSS for bundlers that support CSS imports
require('./index.css');

// 定义字体常量
const LXGWBright = 'LXGWBright';

/**
 * 配置LXGW Bright字体
 * @param {Object} options 配置选项
 * @param {string|number} [options.weight=400] 字体粗细 (300, 400, 500)
 * @param {string} [options.style='normal'] 字体样式 ('normal', 'italic')
 * @returns {Object} 字体配置对象
 */
function configureLXGWBright(options = {}) {
    const { weight = 400, style = 'normal' } = options;

    return {
        fontFamily: LXGWBright,
        fontWeight: weight,
        fontStyle: style,
    };
}

// Export public API
module.exports = {
    LXGWBright,
    configureLXGWBright
};
