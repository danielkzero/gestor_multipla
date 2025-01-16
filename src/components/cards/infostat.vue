<template>
    <div class="stat">
        <div class="stat-figure" :class="cor">
            <i class="text-3xl bx" :class="icone"></i>
        </div>
        <div class="stat-title">{{ titulo }}</div>
        <div class="stat-value" :class="cor">{{ valor }}</div>
        <div class="stat-desc">{{ descricao }}</div>
    </div>
</template>
<script>
export default {
    props: {
        titulo: String,
        valor: String,
        descricao: String,
        icone: String,
        cor: String
    }
}
</script>