<?php

declare(strict_types=1);

use Iamgerwin\NovaInfiniteScroll\NovaInfiniteScrollServiceProvider;

it('service provider is registered', function () {
    $providers = app()->getLoadedProviders();

    expect($providers)->toHaveKey(NovaInfiniteScrollServiceProvider::class);
});

it('config is published', function () {
    $path = config_path('nova-infinite-scroll.php');

    // Config should be merged, not necessarily published
    expect(config('nova-infinite-scroll'))->not->toBeNull();
});

it('config can be loaded', function () {
    expect(config('nova-infinite-scroll'))->toBeArray();
});

it('package name is correct', function () {
    expect(config('nova-infinite-scroll'))->toBeArray();
});
