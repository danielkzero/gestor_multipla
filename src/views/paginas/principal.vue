<template>
  <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>#</th>
          <th>Número do Pedido</th>
          <th>CNPJ</th>
          <th>Nome do Cliente</th>
          <th>Valor Total dos Itens</th>
          <th>Quantidade de Itens</th>
          <th>Complementos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pedido, index) in pedidosFormatados" :key="pedido.id">
          <th>{{ index + 1 }}</th>
          <td>{{ pedido.numero_pedido }}</td>
          <td>{{ pedido.cnpj }}</td>
          <td>{{ pedido.cliente }}</td>
          <td>{{ pedido.valor_total.toFixed(2) }}</td>
          <td>{{ pedido.quantidade_itens }}</td>
          <td>{{ pedido.pedidos_distintos }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pedidos: [],
      pedidosFormatados: [],
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

        const response = await axios.get(
          `http://localhost:8083/api/v1/pedidos`,
          { headers: authorization }
        );

        this.pedidos = response.data.data;
        this.formatarPedidos();
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      } finally {
        this.loadData = false;
      }
    },
    formatarPedidos() {
      this.pedidosFormatados = this.pedidos.map((pedido) => {
        // Cálculo do total de valor e quantidade de itens
        const valorTotal = pedido.itens.reduce(
          (total, item) => total + item.subtotal,
          0
        );
        const quantidadeTotal = pedido.itens.reduce(
          (total, item) => total + item.quantidade,
          0
        );

        // Contagem de pedidos distintos
        const pedidosDistintos = new Set(
          pedido.itens.map((item) => item.pedido_id)
        ).size;

        return {
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          cnpj: pedido.cnpj,
          cliente: pedido.cliente,
          valor_total: valorTotal,
          quantidade_itens: quantidadeTotal,
          pedidos_distintos: pedidosDistintos,
        };
      });
    },
  },
  mounted() {
    this.totais();
  },
};
</script>
