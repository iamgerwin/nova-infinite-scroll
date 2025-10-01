# Filament Infinite Scroll Reference

This directory contains the complete source code from the [fibtegis/filament-infinite-scroll](https://github.com/fibtegis/filament-infinite-scroll) package.

## Package Information

- **License**: Apache-2.0
- **Author**: İsmail KÖSE (ismail@fbt.gs)
- **Version**: 1.1.0
- **Supports**: Filament v3.2+ and v4.0+

## How It Works

The package replaces standard Filament table pagination with infinite scroll functionality using:

1. **InteractsWithInfiniteScroll Trait**: Manages pagination state (`page`, `infinitePerPage`, `infiniteEnded`) and provides the `loadMore()` method
2. **FilamentInfiniteScroll Class**: Uses mixins to extend Filament's Table class, adding the `infinite()` method
3. **Alpine.js Integration**: Uses Intersection Observer API to detect when user scrolls near the bottom
4. **Livewire**: Handles server-side pagination and state management

## Key Features

- Disables standard pagination with `paginated(false)`
- Uses query modification to limit results: `$query->limit($page * $perPage)`
- Injects Alpine.js component via render hooks
- Sticky table headers with dynamic height calculation
- Loading spinner during data fetch
- Automatic detection when all records are loaded

## Usage Pattern

```php
use Fibtegis\FilamentInfiniteScroll\Concerns\InteractsWithInfiniteScroll;

class ListCustomers extends ListRecords
{
    use InteractsWithInfiniteScroll;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([...])
            ->infinite(25); // 25 records per page
    }
}
```

## Technical Implementation

### Frontend (Alpine.js + Intersection Observer)
- Creates a sentinel div (1px height) at the bottom of the table
- Uses Intersection Observer to detect when sentinel becomes visible
- Calls Livewire `loadMore()` method when visible
- Handles loading state and cleanup when finished

### Backend (Livewire)
- Increments `$page` counter
- Calculates if more records exist
- Sets `$infiniteEnded` flag when all records loaded
- Resets state on filter/search/sort changes

### Styling
- Makes table container scrollable with `overflow-y: auto`
- Sticky table headers with `position: sticky`
- Dynamic max-height based on viewport
- Dark mode support

## Files Structure

```
reference-files/
├── InteractsWithInfiniteScroll.php  # Trait for Livewire components
├── FilamentInfiniteScroll.php       # Main class with v3/v4 mixins
├── FilamentInfiniteScrollServiceProvider.php  # Service provider
├── composer.json                    # Package dependencies
├── CHANGELOG.md                     # Version history
└── README.md                        # This file
```

## Notes for Nova Adaptation

Nova uses a different architecture than Filament:
- Nova doesn't use Livewire by default
- Nova has its own resource and lens system
- Nova uses Vue.js instead of Alpine.js
- Nova tables use Inertia.js for pagination

You'll need to:
1. Replace Livewire with Nova's request/response cycle
2. Replace Alpine.js with Vue.js components
3. Adapt render hooks to Nova's custom field system
4. Modify query building to work with Nova resources
5. Handle state management through Inertia.js or custom API calls
