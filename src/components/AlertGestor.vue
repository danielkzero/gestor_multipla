<template>
    <div class="alert alert-warning shadow my-4 inline-block">
        <div class="flex items-start mb-2" v-if="titulo">
            <i class="bx bx-error-circle text-xl"></i>
            <div class="py-auto ml-2 font-semibold">
                <span v-html="titulo"></span>
            </div>
        </div>
        <p v-html="texto" v-if="texto"></p>
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
/* Personalização das cores para o alerta */
.alert-warning {
    background-color: #fefcbf;
    /* Tailwind 'yellow-100' background color */
    border-left: 0.25rem solid #facc15;
    /* Tailwind 'yellow-400' border color */
    color: #9a3412;
    /* Tailwind 'yellow-800' text color */
}
</style>