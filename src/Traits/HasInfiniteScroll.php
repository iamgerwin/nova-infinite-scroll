<?php

declare(strict_types=1);

namespace Iamgerwin\NovaInfiniteScroll\Traits;

/**
 * HasInfiniteScroll Trait
 *
 * Add this trait to your Nova Resource to enable infinite scrolling.
 * Provides configuration methods and metadata for the infinite scroll functionality.
 *
 * @author Gerwin <iamgerwin@live.com>
 */
trait HasInfiniteScroll
{
    /**
     * Determine if infinite scroll is enabled for this resource.
     */
    public static function infiniteScrollEnabled(): bool
    {
        return config('nova-infinite-scroll.enabled', true)
            && ! in_array(static::class, config('nova-infinite-scroll.excluded_resources', []));
    }

    /**
     * Get the number of records to load per batch.
     */
    public static function infiniteScrollPerPage(): int
    {
        return config('nova-infinite-scroll.per_page', 25);
    }

    /**
     * Get the scroll threshold in pixels.
     */
    public static function infiniteScrollThreshold(): int
    {
        return config('nova-infinite-scroll.threshold', 200);
    }

    /**
     * Get the infinite scroll configuration for this resource.
     *
     * @return array<string, mixed>
     */
    public static function infiniteScrollConfig(): array
    {
        return [
            'enabled' => static::infiniteScrollEnabled(),
            'perPage' => static::infiniteScrollPerPage(),
            'threshold' => static::infiniteScrollThreshold(),
            'loadingText' => config('nova-infinite-scroll.loading_text', 'Loading more records...'),
            'endText' => config('nova-infinite-scroll.end_text', 'All records loaded'),
            'autoEnable' => config('nova-infinite-scroll.auto_enable', true),
        ];
    }

    /**
     * Serialize infinite scroll configuration for JSON response.
     *
     * @return array<string, mixed>
     */
    public function serializeInfiniteScrollConfig(): array
    {
        return static::infiniteScrollConfig();
    }

    /**
     * Get the additional meta values for the resource index.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array<string, mixed>
     */
    public static function additionalInformation($request)
    {
        return array_merge(parent::additionalInformation($request) ?? [], [
            'infiniteScroll' => static::infiniteScrollConfig(),
        ]);
    }
}
