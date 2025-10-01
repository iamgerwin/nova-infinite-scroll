<?php

namespace Fibtegis\FilamentInfiniteScroll;

use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentInfiniteScrollServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package->name('infinite-scroll');
    }

    public function packageRegistered(): void
    {
        $this->app->booted(function () {
            FilamentInfiniteScroll::configure();
        });
    }
}
