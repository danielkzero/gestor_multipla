<template>
    <div class="stat">
        <div class="stat-figure text-secondary">
            <div class="avatar" :class="status">
                <div class="w-16 rounded-full">
                    <img :src="src" />
                </div>
            </div>
        </div>
        <div class="stat-value">{{ valor }}</div>
        <div class="stat-title">{{ titulo }}</div>
        <div class="stat-desc" :cor="cor">{{ descricao }}</div>
    </div>
</template>
<script>
export default {
    props: {
        titulo: String,
        valor: String,
        descricao: String,
        src: String,
        cor: String,
        status: String
    }
}
</script>