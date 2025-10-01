<?php

declare(strict_types=1);

arch('it will not use debugging functions')
    ->expect(['dd', 'dump', 'ray'])
    ->each->not->toBeUsed();

arch('strict types are used everywhere')
    ->expect('Iamgerwin\NovaInfiniteScroll')
    ->toUseStrictTypes();

arch('ensure no extends or implements are used in traits')
    ->expect('Iamgerwin\NovaInfiniteScroll\Traits')
    ->toBeTrait();

arch('service provider extends base service provider')
    ->expect('Iamgerwin\NovaInfiniteScroll\NovaInfiniteScrollServiceProvider')
    ->toExtend('Illuminate\Support\ServiceProvider');

arch('configuration files return arrays')
    ->expect('Iamgerwin\NovaInfiniteScroll')
    ->classes()
    ->not->toBeUsedIn('config');

arch('no final classes in package')
    ->expect('Iamgerwin\NovaInfiniteScroll')
    ->classes()
    ->not->toBeFinal();
