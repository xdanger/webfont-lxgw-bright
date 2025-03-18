# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2024-03-18

### Added

- Support for multiple font weights and styles
  - Regular (400 normal)
  - Light (300 normal)
  - Medium (500 normal)
  - Regular Italic (400 italic)
  - Light Italic (300 italic)
  - Medium Italic (500 italic)
- Validation in build script to ensure all font files referenced in CSS exist
- Validation in build script to check for unused font files
- Error handling in font building to continue processing even when some variations have issues
- Updated Next.js integration with better examples for all font weights

### Changed

- Improved build process to handle missing glyphs with --ignore-missing-glyphs option
- Updated documentation to reflect multi-weight support
- Better error handling and reporting in the build process

### Fixed

- Build script now properly processes all available font weights rather than just Regular
- Added explicit version numbering in Next.js package to match main package
