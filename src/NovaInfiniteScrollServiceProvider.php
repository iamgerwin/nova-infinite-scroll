<?php

declare(strict_types=1);

namespace Iamgerwin\NovaInfiniteScroll;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

/**
 * Nova Infinite Scroll Service Provider
 *
 * Registers the package with Laravel and Nova.
 *
 * @author Gerwin <iamgerwin@live.com>
 */
class NovaInfiniteScrollServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any package services.
     */
    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/nova-infinite-scroll.php' => config_path('nova-infinite-scroll.php'),
        ], 'nova-infinite-scroll-config');

        // Only register Nova assets if Nova is installed
        if (class_exists(Nova::class)) {
            Nova::serving(function (ServingNova $event) {
                $this->registerAssets();
            });
        }
    }

    /**
     * Register any package services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/nova-infinite-scroll.php',
            'nova-infinite-scroll'
        );
    }

    /**
     * Register package assets.
     */
    protected function registerAssets(): void
    {
        $distPath = __DIR__.'/../dist';

        // Inject configuration for JavaScript
        $config = config('nova-infinite-scroll', []);
        Nova::provideToScript([
            'novaInfiniteScrollConfig' => [
                'enabled' => $config['enabled'] ?? true,
                'autoEnable' => $config['auto_enable'] ?? true,
                'perPage' => $config['per_page'] ?? 25,
                'threshold' => $config['threshold'] ?? 200,
                'loadingText' => $config['loading_text'] ?? 'Loading more records...',
                'endText' => $config['end_text'] ?? 'All records loaded',
            ],
        ]);

        if (file_exists($distPath.'/js/tool.js')) {
            Nova::script('nova-infinite-scroll', $distPath.'/js/tool.js');
        }

        if (file_exists($distPath.'/css/tool.css')) {
            Nova::style('nova-infinite-scroll', $distPath.'/css/tool.css');
        }
    }
}
