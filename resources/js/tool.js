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
    // Register the infinite scroll component
    Vue.component('infinite-scroll-wrapper', require('./components/InfiniteScrollWrapper.vue').default);

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
