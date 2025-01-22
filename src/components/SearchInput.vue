<template>
  <div class="flex items-center w-full max-w-sm ml-auto">
    <input type="text" v-model="searchTerm" @keyup.enter="onSearch" placeholder="Buscar..."
      class="input-sm w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring focus:ring-blue-500 focus:border-blue-500" />
    <button class="btn-sm px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-r-md" type="button" @click="onSearch">
      <i class="bx bx-search"></i>
    </button>
  </div>
</template>


<script>
export default {
  props: {
    value: { type: String, default: '' },
  },
  data() {
    return {
      searchTerm: this.value,
    };
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchTerm);
    },
  },
  watch: {
    value(newValue) {
      this.searchTerm = newValue;
    },
  },
};
</script>

<style scoped>
/* Estilos para o input de busca */
</style>