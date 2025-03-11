<template>
  <div>
    
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow p-3">
      <button class="btn btn-primary btn-sm w-full md:w-96" @click="baixarTodos">
        <i class="bx bx-download"></i>
        Baixar todos
      </button>

    </div>
    <!-- Tabela -->
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
 
      <DataTable :value="pedidosFiltrados" responsiveLayout="scroll" :rowClass="rowClassPedido"
        @row-click="handleRowClick" tableClass="table whitespace-nowrap">
        <!-- Cabeçalho com Filtros -->
        <template #header>
          <div class="flex justify-between items-center p-3">
            <!-- Filtros de Data -->
            <div class="flex space-x-2">
              <div>
                <label class="block text-sm font-medium">Data Inicial</label>
                <input type="date" v-model="filtro.dataInicial" class="input input-sm input-bordered w-full max-w-xs" />
              </div>
              <div>
                <label class="block text-sm font-medium">Data Final</label>
                <input type="date" v-model="filtro.dataFinal" class="input input-sm input-bordered w-full max-w-xs" />
              </div>
            </div>
            <!-- Campo de Pesquisa -->
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
        </template>

        <!-- Colunas -->
        <Column header="[#]" style="width: 50px">
          <template #body="slotProps">
            {{ pedidosFiltrados.indexOf(slotProps.data) + 1 }}
          </template>
        </Column>
        <Column field="numero_pedido" header="Pedido" sortable></Column>
        <Column field="cnpj" header="CNPJ" sortable></Column>
        <Column field="cliente_numero" header="Código" sortable></Column>
        <Column field="cliente" header="Cliente" sortable></Column>
        <Column field="valor_total" header="Valor Total" class="text-right" sortable>
          <template #body="slotProps">
            {{ formatMoeda(slotProps.data.valor_total.toFixed(2)) }}
          </template>
        </Column>
        <Column field="quantidade_itens" header="Qtd." class="text-center" sortable></Column>
        <Column field="pedidos_distintos" header="Complementos" class="text-center" sortable>
          <template #body="slotProps">
            {{ slotProps.data.pedidos_distintos - 1 }}
          </template>
        </Column>
        <Column header="Ações" class="text-center">
          <template #body="slotProps">
            <button class="btn btn-primary btn-xs mx-1" @click.stop="baixarPedido(slotProps.data)"
              :title="'Baixar pedido ' + slotProps.data.numero_pedido">
              <i class="bx bx-download"></i>
            </button>

            <button class="btn btn-warning btn-xs mx-1" @click.stop="abrirModalComplemento(slotProps.data)"
              title="Adicionar pedido complementar">
              <i class="bx bx-plus"></i>
            </button>

            <button class="btn btn-error btn-xs mx-1 text-white"
              @click.stop="abrirModalRemoverComplemento(slotProps.data)" title="Remover pedido complementar">
              <i class="bx bx-trash"></i>
            </button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <div v-if="mostrarModal" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="font-bold text-lg">Adicionar Complemento</h3>
      <p class="py-4">
        Código do pedido complementar para o pedido <strong>{{ pedidoSelecionado.numero_pedido }}</strong>:
      </p>
      <input type="text" class="input input-bordered w-full mb-4" v-model="codigoComplemento"
        placeholder="Digite o código do pedido complementar" />
      <div v-if="complementos.length">
        <DataTable :value="complementos" :rowClass="rowClass" tableClass="table whitespace-nowrap">
          <Column field="numero_pedido" header="Pedido" sortable></Column>
          <Column field="cliente" header="Cliente" sortable></Column>
          <Column field="valor_total" header="Valor Total" sortable>
            <template #body="slotProps">
              {{ formatMoeda(slotProps.data.valor_total.toFixed(2)) }}
            </template>
          </Column>
          <Column field="quantidade_itens" header="Qtd." sortable></Column>
        </DataTable>
      </div>
      <div class="modal-action">
        <button class="btn" @click="enviarComplemento">Confirmar</button>
        <button class="btn btn-outline" @click="fecharModalComplemento">Cancelar</button>
      </div>
    </div>
  </div>

  <div v-if="mostrarModalRemover" class="modal modal-open">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="font-bold text-lg">Remover Complemento</h3>
      <p class="py-4">
        Complementos do pedido <strong>{{ pedidoSelecionado.numero_pedido }}</strong>:
      </p>
      <div v-if="complementos.length">
        <DataTable :value="complementos" :rowClass="rowClass" tableClass="table whitespace-nowrap">
          <Column field="numero_pedido" header="Pedido" sortable></Column>
          <Column field="cliente" header="Cliente" sortable></Column>
          <Column field="valor_total" header="Valor Total" class="text-right" sortable>
            <template #body="slotProps">
              {{ formatMoeda(slotProps.data.valor_total.toFixed(2)) }}
            </template>
          </Column>
          <Column field="quantidade_itens" header="Qtd." class="text-center" sortable></Column>
          <Column header="Ações" class="text-center">
            <template #body="slotProps">
              <button class="btn btn-xs btn-error ml-2" @click="removerComplemento(slotProps.data)">
                <i class="bx bx-trash"></i> Remover
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-else>
        <p class="text-sm text-gray-500">Não há complementos para este pedido.</p>
      </div>
      <div class="modal-action">
        <button class="btn btn-outline" @click="fecharModalRemoverComplemento">Fechar</button>
      </div>
    </div>
  </div>

  <div class="mb-3">
    <button class="btn btn-accent" @click="baixarArquivoZip()">
      <i class="bx bxs-extension"></i>
      Baixar extensão chrome
    </button>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { saveAs } from "file-saver";
import { formatMoeda } from "@/utils/format.js";

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
      mostrarModalRemover: false,
      pedidoSelecionado: null,
      codigoComplemento: "",
      complementos: []
    };
  },
  watch: {
    'filtro.dataInicial'(value) {
      localStorage.setItem('dataInicial', value);
      this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
    },
    'filtro.dataFinal'(value) {
      localStorage.setItem('dataFinal', value);
      this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
    }
  },
  methods: {
    rowClassPedido(data, index) {
      return (this.hasPriceIssue(data) ? 'hover:bg-error hover:bg-opacity-50 bg-error bg-opacity-25' : 'hover:bg-base-300 odd:bg-base-100 even:bg-base-200');
    },
    rowClass() {
      return 'hover:bg-base-300 cursor-pointer odd:bg-base-100 even:bg-base-200';
    },
    formatMoeda,
    baixarArquivoZip() {
      const link = document.createElement('a');
      link.href = './extension exportar para o gestor.zip';
      link.download = 'exportar_para_o_gestor.zip';
      link.click();
    },
    handleRowClick(event) {
      const rota = '/pedido/' + event.data.numero_pedido;
      this.goTo(rota);
    },
    goTo(rota) {
      this.$router.push(rota);
    },
    hasPriceIssue(pedido) {

      let pedidoFilter = this.pedidos.filter((item) => {
        return item.numero_pedido === pedido.numero_pedido;
      });

      pedidoFilter = pedidoFilter[0];

      // Verifica se algum item não está com o preço correto
      const itemComProblema = pedidoFilter.itens.find((item) => {
        return (item.preco_tabela / item.preco_liquido) > 1 && item.desconto == null;
      });

      if (itemComProblema) return true;
      return false;
    },
    async totais(dataInicial = null, dataFinal = null, busca = null) {
      try {
        this.loadData = true;
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(
          `/api/v1/pedidos`,
          {
            headers: authorization,
            params: { data_inicial: dataInicial, data_final: dataFinal, busca: busca }
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
      this.buscarComplementos(pedido.numero_pedido);
    },
    fecharModalComplemento() {
      this.mostrarModal = false;
      this.pedidoSelecionado = null;
      this.codigoComplemento = "";
      this.complementos = [];
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
          "/api/v1/pedidos/complementos",
          payload,
          { headers: authorization }
        );


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
    },
    abrirModalRemoverComplemento(pedido) {
      this.pedidoSelecionado = pedido;
      this.buscarComplementos(pedido.numero_pedido);
      this.mostrarModalRemover = true;
    },
    fecharModalRemoverComplemento() {
      this.mostrarModalRemover = false;
      this.pedidoSelecionado = null;
      this.complementos = [];
    },
    async buscarComplementos(numeroPedido) {
      try {
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        const response = await axios.get(`/api/v1/pedidos/complementos/${numeroPedido}`, {
          headers: authorization,
        });

        this.complementos = response.data.data; // Assuma que a API retorna um array de complementos

        this.pedidosFormatados = this.complementos.map((pedido) => {
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

        this.complementos = this.pedidosFormatados;
      } catch (error) {
        console.error("Erro ao buscar complementos:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível carregar os complementos. Tente novamente.",
          confirmButtonText: "Ok",
        });
      }
    },
    async removerComplemento(complemento) {
      try {
        const authorization = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

        await axios.delete(`/api/v1/pedidos/complementos/${complemento.id}`, {
          headers: authorization,
        });

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Complemento removido com sucesso!",
          confirmButtonText: "Ok",
        });

        // Remova o complemento da lista local
        this.complementos = this.complementos.filter((comp) => comp.id !== complemento.id);
      } catch (error) {
        console.error("Erro ao remover complemento:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível remover o complemento. Tente novamente.",
          confirmButtonText: "Ok",
        });
      } finally {
        this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
      }
    },
    baixarTodos() {
      this.pedidos.forEach((pedido) => {
        const fileName = `${pedido.numero_pedido} ${pedido.cliente}.txt`;
        const fileContent = pedido.itens
          .map((item) => {
            const codigo = item.codigo.replace('CX', '').toString().padStart(6, "0");
            const quantidade = item.quantidade.toString().padStart(8, "0");
            const precoLiquido = item.preco_liquido.toFixed(2).replace(".", ",").padStart(7, "0");
            return `${codigo} ${quantidade} ${precoLiquido}`;
          })
          .join("\n");

        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        saveAs(blob, fileName);
      });
    },
    baixarPedido(item) {
      let pedidoFilter = this.pedidos.filter((pedido) => {
        return pedido.numero_pedido === item.numero_pedido;
      });

      pedidoFilter = pedidoFilter[0];

      // Verifica se algum item não está com o preço correto
      const itemComProblema = pedidoFilter.itens.find((item) => {
        return (item.preco_tabela / item.preco_liquido) > 1 && item.desconto == null;
      });

      if (itemComProblema) {
        // Se houver algum item com problema, exibe o SweetAlert para confirmar
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Um ou mais itens não estão com o preço correto. Deseja baixar o pedido mesmo assim?',
          showCancelButton: true,
          confirmButtonText: 'Baixar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            // Se o usuário confirmar, baixa o pedido
            this.baixarArquivo(pedidoFilter);
          }
        });
      } else {
        // Se todos os itens estiverem corretos, baixa o pedido diretamente
        this.baixarArquivo(pedidoFilter);
      }
    },

    baixarArquivo(pedidoFilter) {
      const fileName = `${pedidoFilter.numero_pedido} ${pedidoFilter.cliente}.txt`;
      const fileContent = pedidoFilter.itens
        .map((item) => {
          const codigo = item.codigo.replace('CX', '').toString().padStart(6, "0");
          const quantidade = item.quantidade.toString().padStart(8, "0");
          const precoLiquido = item.preco_liquido.toFixed(2).replace(".", ",").padStart(7, "0");
          return `${codigo} ${quantidade} ${precoLiquido}`;
        })
        .join("\n");
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      saveAs(blob, fileName);
    }

  },
  mounted() {
    this.filtro.dataInicial = localStorage.getItem("dataInicial") ?? moment(new Date()).format("YYYY-MM-DD");
    this.filtro.dataFinal = localStorage.getItem("dataFinal") ?? moment(new Date()).format("YYYY-MM-DD");
    this.filtro.busca = '';
    this.totais(this.filtro.dataInicial, this.filtro.dataFinal, this.filtro.busca);
  },
};
</script>
