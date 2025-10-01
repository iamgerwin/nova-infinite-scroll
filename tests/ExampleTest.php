<?php

declare(strict_types=1);

use Iamgerwin\NovaInfiniteScroll\NovaInfiniteScroll;

it('can instantiate package class', function () {
    expect(NovaInfiniteScroll::class)->toBeString();
});

it('returns correct package version', function () {
    expect(NovaInfiniteScroll::version())->toBe('1.0.0');
});

it('returns default configuration', function () {
    $config = NovaInfiniteScroll::defaultConfig();

    expect($config)->toBeArray()
        ->and($config)->toHaveKey('enabled')
        ->and($config)->toHaveKey('per_page')
        ->and($config)->toHaveKey('threshold')
        ->and($config['per_page'])->toBe(25)
        ->and($config['threshold'])->toBe(200);
});
