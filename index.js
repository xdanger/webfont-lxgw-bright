"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LXGWBright = void 0;
exports.configureLXGWBright = configureLXGWBright;
// Import CSS for bundlers that support CSS imports
require('./index.css');

// Re-export the font helper functionality
const { LXGWBright, configureLXGWBright } = require('./scripts/build-fonts');

// Export public API
module.exports = {
    LXGWBright,
    configureLXGWBright
};
