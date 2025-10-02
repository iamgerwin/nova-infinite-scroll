/**
 * Nova Infinite Scroll
 *
 * Provides infinite scrolling functionality for Laravel Nova resource tables.
 * Automatically loads more records as the user scrolls down.
 *
 * @author Gerwin <iamgerwin@live.com>
 * @license MIT
 */

Nova.booting((Vue, router, store) => {
    // Register the infinite scroll component inline
    Vue.component('infinite-scroll-wrapper', {
        name: 'InfiniteScrollWrapper',
        template: `
            <div class="infinite-scroll-wrapper">
                <slot></slot>

                <!-- Loading indicator -->
                <div v-if="loading" class="infinite-scroll-loading">
                    <svg
                        class="animate-spin h-8 w-8 text-primary-500 mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p class="text-center mt-2 text-gray-600 dark:text-gray-400">
                        {{ loadingText }}
                    </p>
                </div>

                <!-- End message -->
                <div v-if="!hasMore && !loading && showEndMessage" class="infinite-scroll-end">
                    <p class="text-center text-gray-500 dark:text-gray-400 py-4">
                        {{ endText }}
                    </p>
                </div>

                <!-- Scroll sentinel (invisible trigger element) -->
                <div ref="sentinel" class="infinite-scroll-sentinel"></div>
            </div>
        `,
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
            hasMore: {
                type: Boolean,
                default: true,
            },
            threshold: {
                type: Number,
                default: 200,
            },
            loadingText: {
                type: String,
                default: 'Loading more records...',
            },
            endText: {
                type: String,
                default: 'All records loaded',
            },
            showEndMessage: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                observer: null,
            };
        },
        mounted() {
            this.initObserver();
        },
        beforeDestroy() {
            this.destroyObserver();
        },
        methods: {
            initObserver() {
                const options = {
                    root: null,
                    rootMargin: `${this.threshold}px`,
                    threshold: 0.1,
                };

                this.observer = new IntersectionObserver(this.handleIntersection, options);

                if (this.$refs.sentinel) {
                    this.observer.observe(this.$refs.sentinel);
                }
            },
            handleIntersection(entries) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && this.hasMore && !this.loading) {
                        this.$emit('load-more');
                    }
                });
            },
            destroyObserver() {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            },
        },
        watch: {
            hasMore(newVal) {
                if (!newVal) {
                    this.destroyObserver();
                } else if (!this.observer) {
                    this.initObserver();
                }
            },
        },
    });

    // Add infinite scroll mixin to resource index pages
    Vue.mixin({
        data() {
            return {
                infiniteScroll: {
                    enabled: false,
                    loading: false,
                    page: 1,
                    hasMore: true,
                    perPage: 25,
                    threshold: 200,
                },
            };
        },

        mounted() {
            // Initialize infinite scroll if on resource index page
            if (this.$route && this.$route.name && this.$route.name.endsWith('-index')) {
                this.initInfiniteScroll();
            }
        },

        beforeDestroy() {
            this.destroyInfiniteScroll();
        },

        methods: {
            /**
             * Initialize infinite scroll functionality
             */
            initInfiniteScroll() {
                const config = window.novaInfiniteScrollConfig || {};

                this.infiniteScroll.enabled = config.autoEnable !== false;
                this.infiniteScroll.perPage = config.perPage || 25;
                this.infiniteScroll.threshold = config.threshold || 200;

                if (this.infiniteScroll.enabled) {
                    this.$nextTick(() => {
                        this.attachScrollListener();
                    });
                }
            },

            /**
             * Attach scroll event listener
             */
            attachScrollListener() {
                const contentWrapper = document.querySelector('.content');
                if (contentWrapper) {
                    contentWrapper.addEventListener('scroll', this.handleScroll);
                    this._scrollElement = contentWrapper;
                }
            },

            /**
             * Handle scroll event
             */
            handleScroll(event) {
                if (!this.infiniteScroll.enabled || this.infiniteScroll.loading || !this.infiniteScroll.hasMore) {
                    return;
                }

                const element = event.target;
                const scrollPosition = element.scrollTop + element.clientHeight;
                const scrollHeight = element.scrollHeight;

                // Check if we're near the bottom
                if (scrollHeight - scrollPosition < this.infiniteScroll.threshold) {
                    this.loadMoreRecords();
                }
            },

            /**
             * Load more records
             */
            async loadMoreRecords() {
                if (this.infiniteScroll.loading || !this.infiniteScroll.hasMore) {
                    return;
                }

                this.infiniteScroll.loading = true;
                this.infiniteScroll.page++;

                try {
                    // Call Nova's API to fetch more resources
                    const response = await Nova.request().get(this.$route.path, {
                        params: {
                            ...this.$route.query,
                            page: this.infiniteScroll.page,
                            perPage: this.infiniteScroll.perPage,
                        },
                    });

                    if (response.data && response.data.resources) {
                        // Append new resources to existing ones
                        if (this.resources && Array.isArray(this.resources)) {
                            this.resources.push(...response.data.resources);
                        }

                        // Check if there are more records
                        this.infiniteScroll.hasMore =
                            response.data.resources.length >= this.infiniteScroll.perPage;
                    }
                } catch (error) {
                    console.error('Error loading more records:', error);
                    this.infiniteScroll.page--; // Revert page increment on error
                } finally {
                    this.infiniteScroll.loading = false;
                }
            },

            /**
             * Clean up scroll listener
             */
            destroyInfiniteScroll() {
                if (this._scrollElement) {
                    this._scrollElement.removeEventListener('scroll', this.handleScroll);
                    this._scrollElement = null;
                }
            },

            /**
             * Toggle infinite scroll on/off
             */
            toggleInfiniteScroll() {
                this.infiniteScroll.enabled = !this.infiniteScroll.enabled;

                if (this.infiniteScroll.enabled) {
                    this.attachScrollListener();
                } else {
                    this.destroyInfiniteScroll();
                }
            },

            /**
             * Reset infinite scroll state
             */
            resetInfiniteScroll() {
                this.infiniteScroll.page = 1;
                this.infiniteScroll.hasMore = true;
                this.infiniteScroll.loading = false;
            },
        },

        watch: {
            // Reset when filters, search, or sorting changes
            '$route.query': {
                handler() {
                    this.resetInfiniteScroll();
                },
                deep: true,
            },
        },
    });
});
