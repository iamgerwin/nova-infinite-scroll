<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Enable Infinite Scroll
    |--------------------------------------------------------------------------
    |
    | Determine if infinite scroll should be enabled by default for all
    | Nova resources. You can override this on a per-resource basis.
    |
    */
    'enabled' => env('NOVA_INFINITE_SCROLL_ENABLED', true),

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
    | If true, infinite scroll will automatically activate on resource index pages.
    | If false, users must manually toggle infinite scroll on/off.
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
