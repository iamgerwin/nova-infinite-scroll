/**
 * Nova Infinite Scroll
 *
 * Provides infinite scrolling functionality for Laravel Nova resource tables.
 * Automatically loads more records as the user scrolls down.
 *
 * @author Gerwin <iamgerwin@live.com>
 * @license MIT
 */

Nova.booting((app, store) => {
    // Use a mixin to add infinite scroll functionality to ResourceIndex components
    // This approach is more reliable than extending the component directly
    app.mixin({
        data() {
            return {
                infiniteScroll: {
                    enabled: false,
                    loading: false,
                    hasMore: true,
                    threshold: 200,
                    originalSelectPage: null,
                },
            };
        },

        mounted() {
            // Only initialize for ResourceIndex components
            if (this.$options.name === 'ResourceIndex') {
                this.initInfiniteScroll();
            }
        },

        beforeUnmount() {
            // Only cleanup for ResourceIndex components
            if (this.$options.name === 'ResourceIndex') {
                this.destroyInfiniteScroll();
            }
        },

        methods: {
            /**
             * Initialize infinite scroll functionality
             */
            initInfiniteScroll() {
                // Check if infinite scroll should be enabled
                const config = window.novaInfiniteScrollConfig;

                if (!config || config.enabled === false) {
                    return;
                }

                this.infiniteScroll.enabled = config.autoEnable !== false;
                this.infiniteScroll.threshold = config.threshold || 200;

                if (this.infiniteScroll.enabled) {
                    // Store the original selectPage method
                    this.infiniteScroll.originalSelectPage = this.selectPage;

                    // Override selectPage method
                    this.selectPage = this.infiniteScrollSelectPage;

                    this.$nextTick(() => {
                        this.attachScrollListener();
                        this.hidePagination();
                    });
                }
            },

            /**
             * Attach scroll event listener
             */
            attachScrollListener() {
                const contentWrapper = document.querySelector('.content');
                if (contentWrapper) {
                    this._handleScroll = this.handleInfiniteScroll.bind(this);
                    contentWrapper.addEventListener('scroll', this._handleScroll);
                    this._scrollElement = contentWrapper;
                }
            },

            /**
             * Handle scroll event for infinite loading
             */
            handleInfiniteScroll(event) {
                if (!this.infiniteScroll.enabled || this.infiniteScroll.loading || !this.infiniteScroll.hasMore) {
                    return;
                }

                const element = event.target;
                const scrollPosition = element.scrollTop + element.clientHeight;
                const scrollHeight = element.scrollHeight;

                // Check if we're near the bottom
                if (scrollHeight - scrollPosition < this.infiniteScroll.threshold) {
                    this.loadMoreViaInfiniteScroll();
                }
            },

            /**
             * Load more records via infinite scroll
             */
            async loadMoreViaInfiniteScroll() {
                if (this.infiniteScroll.loading || !this.infiniteScroll.hasMore) {
                    return;
                }

                // Check if we're already on the last page
                if (!this.hasMorePages) {
                    this.infiniteScroll.hasMore = false;
                    return;
                }

                this.infiniteScroll.loading = true;

                try {
                    // Get next page number
                    const nextPage = this.currentPage + 1;

                    // Fetch next page
                    await this.selectPage(nextPage);

                    // Check if there are more pages
                    this.infiniteScroll.hasMore = this.hasMorePages;
                } catch (error) {
                    console.error('Error loading more records:', error);
                } finally {
                    this.infiniteScroll.loading = false;
                }
            },

            /**
             * Hide pagination when infinite scroll is enabled
             */
            hidePagination() {
                const style = document.createElement('style');
                style.id = 'nova-infinite-scroll-pagination-hide';
                style.textContent = `
                    .nova-infinite-scroll-enabled .pagination-wrapper,
                    .nova-infinite-scroll-enabled nav[role="navigation"] {
                        display: none !important;
                    }
                `;

                if (!document.getElementById('nova-infinite-scroll-pagination-hide')) {
                    document.head.appendChild(style);
                }

                // Add class to resource index container
                this.$nextTick(() => {
                    const resourceIndex = this.$el.closest('.resource-index') || this.$el;
                    if (resourceIndex) {
                        resourceIndex.classList.add('nova-infinite-scroll-enabled');
                    }
                });
            },

            /**
             * Clean up scroll listener
             */
            destroyInfiniteScroll() {
                if (this._scrollElement && this._handleScroll) {
                    this._scrollElement.removeEventListener('scroll', this._handleScroll);
                    this._scrollElement = null;
                    this._handleScroll = null;
                }

                // Restore original selectPage if it was overridden
                if (this.infiniteScroll.originalSelectPage) {
                    this.selectPage = this.infiniteScroll.originalSelectPage;
                }
            },

            /**
             * Custom selectPage that appends resources instead of replacing
             */
            async infiniteScrollSelectPage(page) {
                if (!this.infiniteScroll.enabled || !this.infiniteScroll.originalSelectPage) {
                    // Fallback to original method
                    if (this.infiniteScroll.originalSelectPage) {
                        return this.infiniteScroll.originalSelectPage.call(this, page);
                    }
                    return;
                }

                this.loading = true;

                try {
                    const {
                        data: { resources, softDeletes, perPage, total, prev_page_url, next_page_url },
                    } = await this.getResources(page);

                    // Append resources instead of replacing
                    this.resources = [...this.resources, ...resources];
                    this.softDeletes = softDeletes;
                    this.perPage = perPage;
                    this.currentPage = page;
                    this.hasMorePages = !!next_page_url;

                    Nova.$emit('resources-loaded', {
                        resourceName: this.resourceName,
                        mode: 'index',
                    });
                } catch (error) {
                    console.error('Error fetching resources:', error);
                }

                this.loading = false;
            },

            /**
             * Reset infinite scroll state
             */
            resetInfiniteScrollState() {
                if (this.infiniteScroll) {
                    this.infiniteScroll.hasMore = true;
                    this.infiniteScroll.loading = false;
                    this.currentPage = 1;
                    this.resources = [];
                }
            },
        },

        watch: {
            // Only watch for ResourceIndex components
            resourceName(newVal, oldVal) {
                if (this.$options.name === 'ResourceIndex' && this.infiniteScroll.enabled) {
                    this.resetInfiniteScrollState();
                }
            },

            '$route.query': {
                handler(newQuery, oldQuery) {
                    if (this.$options.name === 'ResourceIndex' && this.infiniteScroll.enabled) {
                        // Only reset if the query actually changed (excluding page)
                        const newQueryWithoutPage = { ...newQuery };
                        const oldQueryWithoutPage = { ...oldQuery };
                        delete newQueryWithoutPage.page;
                        delete oldQueryWithoutPage.page;

                        if (JSON.stringify(newQueryWithoutPage) !== JSON.stringify(oldQueryWithoutPage)) {
                            this.resetInfiniteScrollState();
                        }
                    }
                },
                deep: true,
            },
        },
    });
});
