# Changelog

All notable changes to `nova-infinite-scroll` will be documented in this file.

## Unreleased

### Fixed

- **Per-Resource Detection**: Fixed critical issue where infinite scroll was not properly detecting which resources have the trait enabled
- JavaScript now correctly checks resource-specific configuration via `additionalInformation` meta data
- Pagination controls now properly hide only for resources with the trait
- Global configuration no longer applies to all resources by default (breaking change, see below)

### Changed

- **BREAKING**: Default `enabled` config changed from `true` to `false` to prevent unintended global activation
- Infinite scroll now requires explicit opt-in per resource using the `HasInfiniteScroll` trait (recommended approach)
- Enhanced resource information watcher to reinitialize when navigating between resources
- Improved configuration priority: resource-specific config now takes precedence over global config

### Added

- `additionalInformation()` method in trait to pass per-resource configuration to JavaScript
- Resource-specific configuration detection in JavaScript mixin
- Better backward compatibility with global configuration mode

## 1.0.0 - 2025-10-02

### Added

- Initial release
- Seamless infinite scrolling for Laravel Nova 3, 4, and 5
- `HasInfiniteScroll` trait for easy integration
- Configurable per-page batch sizes
- Adjustable scroll threshold
- Theme-aware (dark/light mode support)
- Auto-reset on filter, search, and sort changes
- Intersection Observer API for efficient scroll detection
- Vue.js components for Nova integration
- Comprehensive Pest test suite
- PHPStan level 8 compliance
- PSR-12 coding standards
- Support for PHP 8.2+
- Support for Laravel 9.x, 10.x, 11.x, and 12.x
- Customizable loading and end messages
- Per-resource configuration overrides
- Global and per-resource enable/disable options
- Excluded resources configuration
- Mobile-optimized touch scrolling
- Performance tips and troubleshooting guide
