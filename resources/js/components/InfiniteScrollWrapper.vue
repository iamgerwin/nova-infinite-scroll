<template>
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
</template>

<script>
export default {
    name: 'InfiniteScrollWrapper',

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
        /**
         * Initialize Intersection Observer
         */
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

        /**
         * Handle intersection event
         */
        handleIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting && this.hasMore && !this.loading) {
                    this.$emit('load-more');
                }
            });
        },

        /**
         * Clean up observer
         */
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
};
</script>

<style scoped>
.infinite-scroll-wrapper {
    position: relative;
}

.infinite-scroll-loading,
.infinite-scroll-end {
    padding: 1rem;
    text-align: center;
}

.infinite-scroll-sentinel {
    height: 1px;
    width: 100%;
    pointer-events: none;
}
</style>
