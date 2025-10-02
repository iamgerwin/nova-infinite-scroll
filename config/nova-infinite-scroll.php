<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Enable Infinite Scroll
    |--------------------------------------------------------------------------
    |
    | Determine if infinite scroll should be enabled globally for all
    | Nova resources (not recommended). It's better to enable it per-resource
    | using the HasInfiniteScroll trait. Set to false to only enable for
    | resources with the trait.
    |
    */
    'enabled' => env('NOVA_INFINITE_SCROLL_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Records Per Page
    |--------------------------------------------------------------------------
    |
    | The default number of records to load per batch when infinite scrolling.
    | This value can be customized per resource.
    |
    */
    'per_page' => env('NOVA_INFINITE_SCROLL_PER_PAGE', 25),

    /*
    |--------------------------------------------------------------------------
    | Scroll Threshold
    |--------------------------------------------------------------------------
    |
    | The distance (in pixels) from the bottom of the page that triggers
    | loading more records. Lower values load earlier, higher values load later.
    |
    */
    'threshold' => env('NOVA_INFINITE_SCROLL_THRESHOLD', 200),

    /*
    |--------------------------------------------------------------------------
    | Loading Message
    |--------------------------------------------------------------------------
    |
    | The message displayed while more records are being loaded.
    |
    */
    'loading_text' => 'Loading more records...',

    /*
    |--------------------------------------------------------------------------
    | End Message
    |--------------------------------------------------------------------------
    |
    | The message displayed when all records have been loaded.
    |
    */
    'end_text' => 'All records loaded',

    /*
    |--------------------------------------------------------------------------
    | Auto Enable
    |--------------------------------------------------------------------------
    |
    | If true, infinite scroll will automatically activate on resource index pages
    | that have the HasInfiniteScroll trait. If false, users would need to manually
    | toggle infinite scroll on/off (toggle feature not yet implemented).
    |
    */
    'auto_enable' => env('NOVA_INFINITE_SCROLL_AUTO_ENABLE', true),

    /*
    |--------------------------------------------------------------------------
    | Excluded Resources
    |--------------------------------------------------------------------------
    |
    | List of Nova resource class names where infinite scroll should be disabled.
    | Useful for resources with custom pagination requirements.
    |
    */
    'excluded_resources' => [
        // App\Nova\User::class,
    ],
];
