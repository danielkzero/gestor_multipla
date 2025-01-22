<template>
    <div class="bd-callout bd-callout-warning">
        <div class="d-flex justify-content-start mb-2" v-if="titulo">
            <i class="bx bx-error-circle fs-4"></i>
            <div class="py-auto ms-1 fw-bold">
                <span v-html="titulo"></span>
            </div>
        </div>
        <span v-html="texto" v-if="texto"></span>
    </div>
</template>
<script>
export default {
    props: {
        titulo: {
            type: String
        },
        texto: {
            type: String
        },
    }
}
</script>

<style scoped>

.bd-callout-warning {
    --bd-callout-color: var(--bs-warning-text-emphasis);
    --bd-callout-bg: var(--bs-warning-bg-subtle);
    --bd-callout-border: var(--bs-warning-border-subtle);
}

.bd-callout {
    padding: 1.25rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    color: var(--bd-callout-color, inherit);
    background-color: var(--bd-callout-bg, var(--bs-gray-100));
    border-left: 0.25rem solid var(--bd-callout-border, var(--bs-gray-300));
}
</style>