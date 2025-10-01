<?php

declare(strict_types=1);

namespace Iamgerwin\NovaInfiniteScroll;

use Illuminate\Support\Facades\Route;
use Laravel\Nova\Nova;

/**
 * Nova Infinite Scroll
 *
 * Provides seamless infinite scrolling functionality for Laravel Nova resources.
 * Automatically loads more records as users scroll, eliminating traditional pagination.
 *
 * @author Gerwin <iamgerwin@live.com>
 * @license MIT
 */
class NovaInfiniteScroll
{
    /**
     * Configure the infinite scroll package.
     * Registers assets and routes for Nova.
     */
    public static function configure(): void
    {
        // Register JavaScript and CSS assets
        Nova::serving(function () {
            Nova::script('nova-infinite-scroll', __DIR__.'/../dist/js/tool.js');
            Nova::style('nova-infinite-scroll', __DIR__.'/../dist/css/tool.css');
        });

        // Register API routes for loading more records
        Route::middleware(['nova'])
            ->prefix('nova-vendor/infinite-scroll')
            ->group(function () {
                Route::get('/{resource}', [InfiniteScrollController::class, 'index'])
                    ->name('nova.infinite-scroll.index');
            });
    }

    /**
     * Get the default configuration values.
     *
     * @return array<string, mixed>
     */
    public static function defaultConfig(): array
    {
        return [
            'enabled' => true,
            'per_page' => 25,
            'threshold' => 200,
            'loading_text' => 'Loading more...',
            'end_text' => 'No more records to load',
            'auto_enable' => true,
        ];
    }

    /**
     * Get the package version.
     */
    public static function version(): string
    {
        return '1.0.0';
    }
}
