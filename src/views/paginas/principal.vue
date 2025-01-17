<template>
  <div>
    <!-- Tabela -->
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
      <table class="table whitespace-nowrap">
        <!-- head -->
        <thead>
          <tr>
            <th colspan="9">
              <div class="flex justify-between items-center">
                <!-- Filtros de Data -->
                <div class="flex space-x-2">
                  <div>
                    <label class="block text-sm font-medium">Data Inicial</label>
                    <input type="date" v-model="filtro.dataInicial"
                      class="input input-sm input-bordered w-full max-w-xs" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium">Data Final</label>
                    <input type="date" v-model="filtro.dataFinal"
                      class="input input-sm input-bordered w-full max-w-xs" />
                  </div>
                </div>
                <!-- Campo de Pesquisa por Texto -->
                <div class="w-1/3">
                  <label class="block text-sm font-medium">Pesquisar</label>
                  <div class="flex">
                    <input type="text" v-model="filtro.texto" placeholder="Digite aqui..."
                      class="input input-sm input-bordered w-full" />
                    <button class="btn btn-sm btn-primary inline-flex justify-center items-center gap-x-2 ms-2"
                      @click="totais(filtro.dataInicial, filtro.dataFinal, filtro.texto)">
                      Filtrar
                    </button>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <thead class="text-xs text-base-700 uppercase bg-base-200">
          <tr>
            <th>#</th>
            <th>Pedido</th>
            <th>CNPJ</th>
            <th>Código</th>
            <th>Cliente</th>
            <th class="text-right">Valor Total</th>
            <th class="text-center">Qtd.</th>
            <th class="text-center">Complementos</th>
            <th class="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pedido, index) in pedidosFiltrados" :key="pedido.id" class="odd:bg-base-100 even:bg-base-200">
            <th>{{ index + 1 }}</th>
            <td>{{ pedido.numero_pedido }}</td>
            <td>{{ pedido.cnpj }}</td>
            <td>{{ pedido.cliente_numero }}</td>
            <td>{{ pedido.cliente }}</td>
            <td class="text-right">{{ formatMoeda(pedido.valor_total.toFixed(2)) }}</td>
            <td class="text-center">{{ pedido.quantidade_itens }}</td>
            <td class="text-center">{{ pedido.pedidos_distintos - 1 }}</td>
            <td class="text-center">
              <button class="btn btn-warning btn-xs mx-1" @click="abrirModalComplemento(pedido)" title="Adicionar pedido complementar">
                <i class='bx bx-plus' ></i>
              </button>

              <button class="btn btn-secondary btn-xs mx-1" @click="abrirModalComplemento(pedido)" title="Remover pedido complementar">
                <i class='bx bx-trash' ></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="mostrarModal" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Adicionar Complemento</h3>
      <p class="py-4">
        Código do pedido complementar para o pedido <strong>{{ pedidoSelecionado.numero_pedido }}</strong>:
      </p>
      <input type="text" class="input input-bordered w-full mb-4" v-model="codigoComplemento"
        placeholder="Digite o código do pedido complementar" />
      <div class="modal-action">
        <button class="btn" @click="enviarComplemento">Confirmar</button>
        <button class="btn btn-outline" @click="fecharModalComplemento">Cancelar</button>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

export default {
  data() {
    return {
      pedidos: [],
      pedidosFormatados: [],
      pedidosFiltrados: [],
      filtro: {
        dataInicial: "",
        dataFinal: "",
        texto: "",
      },
      loadData: false,
      mostrarModal: false,
      pedidoSelecionado: null,
      codigoComplemento: "",
    };
  },
  methods: {
    async totais(dataInicial = null, dataFinal = null, busca = null) {
      try {
        this.loadData = true;
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(
          `http://localhost:8083/api/v1/pedidos`,
          { 
            headers: authorization,
            params: { data_inicial: dataInicial, data_final: dataFinal, busca: busca} 
          }
        );

        this.pedidos = response.data.data;
        this.formatarPedidos();
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      } finally {
        this.loadData = false;
      }
    },
    formatMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },
    formatarPedidos() {
      this.pedidosFormatados = this.pedidos.map((pedido) => {
        const valorTotal = pedido.itens.reduce(
          (total, item) => total + item.subtotal,
          0
        );
        const quantidadeTotal = pedido.itens.reduce(
          (total, item) => total + item.quantidade,
          0
        );
        const pedidosDistintos = new Set(
          pedido.itens.map((item) => item.pedido_id)
        ).size;
        const numeroCliente = pedido.cliente.match(/\((\d+)\)$/)?.[1] || "0";
        const numeroClienteFormatado = numeroCliente.padStart(6, "0");

        return {
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          cnpj: pedido.cnpj,
          cliente: pedido.cliente,
          cliente_numero: numeroClienteFormatado,
          valor_total: valorTotal,
          quantidade_itens: quantidadeTotal,
          pedidos_distintos: pedidosDistintos,
        };
      });
      this.pedidosFiltrados = this.pedidosFormatados;
    },
    filtrarPedidos() {
      const { dataInicial, dataFinal, texto } = this.filtro;
      this.pedidosFiltrados = this.pedidosFormatados.filter((pedido) => {
        const pedidoData = new Date(pedido.data);
        const dataValida =
          (!dataInicial || pedidoData >= new Date(dataInicial)) &&
          (!dataFinal || pedidoData <= new Date(dataFinal));
        const textoValido =
          !texto ||
          pedido.cliente.toLowerCase().includes(texto.toLowerCase()) ||
          pedido.numero_pedido.toString().includes(texto);
        return dataValida && textoValido;
      });
    },
    abrirModalComplemento(pedido) {
      this.pedidoSelecionado = pedido;
      this.codigoComplemento = "";
      this.mostrarModal = true;
    },
    fecharModalComplemento() {
      this.mostrarModal = false;
      this.pedidoSelecionado = null;
      this.codigoComplemento = "";
    },
    async enviarComplemento() {
      if (!this.codigoComplemento) {
        Swal.fire({
          icon: "warning",
          title: "Atenção",
          text: "O código do pedido complementar é obrigatório!",
          confirmButtonText: "Ok",
        });
        return;
      }

      try {
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const payload = {
          numero_pedido_pai: this.pedidoSelecionado.numero_pedido,
          numero_pedido: this.codigoComplemento,
        };

        const resp = await axios.post(
          "http://localhost:8083/api/v1/pedidos/complementos",
          payload,
          { headers: authorization }
        );

        console.log("Complemento adicionado:", resp.data);

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Complemento adicionado com sucesso!",
          confirmButtonText: "Ok",
        });

        this.fecharModalComplemento();
        this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
      } catch (error) {
        console.error("Erro ao adicionar complemento:", error);

        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível adicionar o complemento. Tente novamente.",
          confirmButtonText: "Ok",
        });
      }
    }

  },
  mounted() {
    this.filtro.dataInicial = moment(new Date()).format("YYYY-MM-DD");
    this.filtro.dataFinal = moment(new Date()).format("YYYY-MM-DD");
    this.filtro.busca = '';
    this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
  },
};
</script>
