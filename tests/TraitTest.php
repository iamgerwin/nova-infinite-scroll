<?php

declare(strict_types=1);

use Iamgerwin\NovaInfiniteScroll\Traits\HasInfiniteScroll;

// Mock Resource class for testing
class MockResource
{
    use HasInfiniteScroll;
}

it('trait provides infinite scroll enabled method', function () {
    expect(MockResource::infiniteScrollEnabled())->toBeTrue();
});

it('trait provides per page configuration', function () {
    expect(MockResource::infiniteScrollPerPage())->toBe(25);
});

it('trait provides threshold configuration', function () {
    expect(MockResource::infiniteScrollThreshold())->toBe(200);
});

it('trait provides complete configuration array', function () {
    $config = MockResource::infiniteScrollConfig();

    expect($config)->toBeArray()
        ->and($config)->toHaveKey('enabled')
        ->and($config)->toHaveKey('perPage')
        ->and($config)->toHaveKey('threshold')
        ->and($config)->toHaveKey('loadingText')
        ->and($config)->toHaveKey('endText')
        ->and($config)->toHaveKey('autoEnable');
});

it('trait respects excluded resources configuration', function () {
    config(['nova-infinite-scroll.excluded_resources' => [MockResource::class]]);

    expect(MockResource::infiniteScrollEnabled())->toBeFalse();
});

it('trait allows per-resource configuration override', function () {
    config(['nova-infinite-scroll.per_page' => 100]);

    expect(MockResource::infiniteScrollPerPage())->toBe(100);
});

it('resource can serialize infinite scroll config', function () {
    $resource = new MockResource;
    $config = $resource->serializeInfiniteScrollConfig();

    expect($config)->toBeArray()
        ->and($config)->toHaveKey('enabled')
        ->and($config)->toHaveKey('perPage');
});
