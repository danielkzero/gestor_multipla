<template>
  <div class="stats shadow w-full">
    <!-- INFO STATS -->
    <infostat
      cor="text-primary"
      titulo="Total disponível"
      :valor="dados.VALOR_DISPONIVEL"
      :descricao="dados.DISPONIVEL + ' pedidos parados'"
      icone="bx-basket"
    />
    <!-- INFO STATS -->
    <infostat
      cor="text-success"
      titulo="Total em faturamento"
      :valor="dados.VALOR_EMFATURAMENTO"
      :descricao="dados.EMFATURAMENTO + ' pedidos para faturar'"
      icone="bx-receipt"
    />
    <!-- INFO STATS -->
    <infostat
      cor="text-warning"
      titulo="Total faltante"
      :valor="dados.VALOR_FALTANTE"
      :descricao="dados.FALTANTE + ' pedidos com itens faltantes'"
      icone="bx-cut"
    />
    <!-- INFO STATS -->
    <infostat
      cor="text-secondary"
      titulo="Total em separação"
      :valor="dados.VALOR_SEPARANDO"
      :descricao="dados.SEPARANDO + ' pedidos para separar'"
      icone="bxs-package"
    />
    <!-- INFO STATS AVATAR 
        <infostatavatar 
            cor="text-secondary" 
            titulo="Do faturamento"
            valor="20%"
            descricao="Ana Claudia Tavares"
            src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            status=""
        />-->
  </div>
</template>
<script>
import infostat from "./infostat.vue";
import infostatavatar from "./infostatavatar.vue";
import axios from "axios";
import moment from 'moment';
import { inject } from 'vue';

export default {
  components: {
    infostat,
    infostatavatar,    
  },
  data() {
    return {
      dados: [],
      loadData: false,
    };
  },
  methods: {
    async totais() {
      try {
        this.loadData = true;
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
        const response = await axios.get(this.apiGestor+`/separacao/totais`, {
          headers: authorization
        });
        
        this.dados = response.data;
        this.dados = {
            DISPONIVEL: response.data[0].DISPONIVEL,
            EMFATURAMENTO: response.data[0].EMFATURAMENTO,
            FALTANTE: response.data[0].FALTANTE,
            SEPARANDO: response.data[0].SEPARANDO,
            VALOR_DISPONIVEL: this.numFormatter(response.data[0].VALOR_DISPONIVEL * 1),
            VALOR_EMFATURAMENTO: this.numFormatter(response.data[0].VALOR_EMFATURAMENTO),
            VALOR_FALTANTE: this.numFormatter(response.data[0].VALOR_FALTANTE),
            VALOR_SEPARANDO: this.numFormatter(response.data[0].VALOR_SEPARANDO)
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      } finally {
        this.loadData = false;
      }
    },
    numFormatter(num) {
      if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1).replace(".", ",") + "K";
      } else if (num > 1000000) {
        return (num / 1000000).toFixed(1).replace(".", ",") + "M";
      } else if (num > 1000000000) {
        return (num / 1000000000).toFixed(1).replace(".", ",") + "B";
      } else if (num > 1000000000000) {
        return (num / 1000000000000).toFixed(1).replace(".", ",") + "T";
      } else if (num < 900) {
        return num.toFixed(2).replace(".", ",");
      }
    },
    formatMoeda(valor) {
      return parseFloat(valor).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    },
    formatNumero(numero, qtd_decimais) {
      return parseFloat(numero).toLocaleString("pt-br", {
        maximumSignificantDigits: qtd_decimais,
      });
    },
    formatData(date) {
      return moment(date).format("DD/MM/YYYY");
    },
  },
  mounted() {
    this.totais();
  },
};
</script>
