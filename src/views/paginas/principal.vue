<template>
  <div></div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      disponivel: [],
      faturando: [],
      faltando: [] ,
      separando: [],
      loadData: false
    };
  },
  methods: {
    async totais() {
      try {
        this.loadData = true;
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        
        let response = await axios.get(this.apiGestor+`/separacao/disponivel`, {
          headers: authorization
        });        
        this.disponivel = response.data;


      } catch (error) {
        console.error("Erro ao obter dados:", error);
      } finally {
        this.loadData = false;
      }
    },
  },
  mounted() {
    this.totais();
  },
};
</script>