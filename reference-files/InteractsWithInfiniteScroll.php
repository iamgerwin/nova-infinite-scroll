<?php

/*
 * This file is part of the Filament Infinite Scroll package.
 *
 * (c) İsmail KÖSE
 * ismail@fbt.gs
 * */

namespace Fibtegis\FilamentInfiniteScroll\Concerns;

trait InteractsWithInfiniteScroll
{
    public int $page = 1;

    public int $infinitePerPage = 25;

    public bool $infiniteEnded = false;

    public function loadMore(): bool
    {
        // Zaten bittiyse hiç çağırma
        if ($this->infiniteEnded) {
            return false;
        }

        $this->page++;

        $totalRecords = $this->getFilteredTableQuery()->count();
        $loadedRecords = $this->page * $this->infinitePerPage;

        if ($loadedRecords >= $totalRecords) {
            $this->infiniteEnded = true;

            return false;
        }

        return true;
    }

    protected function resetInfinite(): void
    {
        $this->page = 1;
        $this->infiniteEnded = false;
    }

    public function updatedTableFilters(): void
    {
        $this->resetInfinite();
    }

    public function updatedTableSearch(): void
    {
        $this->resetInfinite();
    }

    public function updatedTableSortColumn(): void
    {
        $this->resetInfinite();
    }

    public function updatedTableSortDirection(): void
    {
        $this->resetInfinite();
    }

    public function resetTableFilters(): void
    {
        $this->resetInfinite();
    }
}
