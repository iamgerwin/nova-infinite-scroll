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
    // Extend ResourceIndex component to add infinite scroll functionality
    app.component('ResourceIndex', {
        extends: app.component('ResourceIndex'),

        data() {
            return {
                infiniteScroll: {
                    enabled: false,
                    loading: false,
                    hasMore: true,
                    threshold: 200,
                },
            };
        },

        mounted() {
            this.initInfiniteScroll();
        },

        beforeUnmount() {
            this.destroyInfiniteScroll();
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

                    // Fetch next page using Nova's existing method
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
            },

            /**
             * Override selectPage to append resources instead of replacing
             */
            async selectPage(page) {
                if (!this.infiniteScroll.enabled) {
                    // Use default behavior if infinite scroll is disabled
                    return this.$options.extends.methods.selectPage.call(this, page);
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
             * Override getResources to handle infinite scroll parameters
             */
            getResources(page = 1) {
                return Nova.request().get('/nova-api/' + this.resourceName, {
                    params: this.resourceRequestQueryString({
                        page,
                        perPage: this.perPage,
                    }),
                });
            },
        },

        watch: {
            // Reset infinite scroll state when filters, search, or sorting changes
            resourceName() {
                this.resetInfiniteScrollState();
            },

            '$route.query': {
                handler(newQuery, oldQuery) {
                    // Only reset if the query actually changed (excluding page)
                    const newQueryWithoutPage = { ...newQuery };
                    const oldQueryWithoutPage = { ...oldQuery };
                    delete newQueryWithoutPage.page;
                    delete oldQueryWithoutPage.page;

                    if (JSON.stringify(newQueryWithoutPage) !== JSON.stringify(oldQueryWithoutPage)) {
                        this.resetInfiniteScrollState();
                    }
                },
                deep: true,
            },
        },

        created() {
            // Ensure we start at page 1
            if (this.infiniteScroll && this.infiniteScroll.enabled) {
                this.currentPage = 1;
            }
        },
    });

    /**
     * Helper method to reset infinite scroll state
     */
    app.config.globalProperties.resetInfiniteScrollState = function() {
        if (this.infiniteScroll) {
            this.infiniteScroll.hasMore = true;
            this.infiniteScroll.loading = false;
            this.currentPage = 1;
            this.resources = [];
        }
    };
});
