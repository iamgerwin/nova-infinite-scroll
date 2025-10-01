<?php

declare(strict_types=1);

it('loads configuration file correctly', function () {
    $config = config('nova-infinite-scroll');

    expect($config)->toBeArray()
        ->and($config)->toHaveKey('enabled')
        ->and($config)->toHaveKey('per_page')
        ->and($config)->toHaveKey('threshold')
        ->and($config)->toHaveKey('loading_text')
        ->and($config)->toHaveKey('end_text')
        ->and($config)->toHaveKey('auto_enable')
        ->and($config)->toHaveKey('excluded_resources');
});

it('respects environment configuration', function () {
    config(['nova-infinite-scroll.enabled' => false]);
    expect(config('nova-infinite-scroll.enabled'))->toBeFalse();

    config(['nova-infinite-scroll.per_page' => 50]);
    expect(config('nova-infinite-scroll.per_page'))->toBe(50);
});

it('has sensible default values', function () {
    $config = config('nova-infinite-scroll');

    expect($config['enabled'])->toBeTrue()
        ->and($config['per_page'])->toBe(25)
        ->and($config['threshold'])->toBe(200)
        ->and($config['auto_enable'])->toBeTrue()
        ->and($config['excluded_resources'])->toBeArray()
        ->and($config['excluded_resources'])->toBeEmpty();
});

it('allows customizing loading and end text', function () {
    $config = config('nova-infinite-scroll');

    expect($config['loading_text'])->toBeString()
        ->and($config['end_text'])->toBeString();

    config(['nova-infinite-scroll.loading_text' => 'Custom loading...']);
    expect(config('nova-infinite-scroll.loading_text'))->toBe('Custom loading...');
});
