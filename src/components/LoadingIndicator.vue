<template>
    <div v-if="modelValue" class="text-center my-3">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        modelValue: { type: Boolean, default: false }, // Alterado para usar modelValue
    },
};
</script>
  
  <style scoped>
  /* Estilos para o input de busca */
  </style>
  