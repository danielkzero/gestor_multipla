<template>
  <div class="mb-3 text-xs">
    Mostrando
    <details class="dropdown ClickScreenToClose">
      <summary class="m-1 link link-primary">
        {{ tipo_pedido[tipo_pedido_select ?? 0].texto }}
      </summary>
      <ul class="shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-64">
        <li v-for="(item, index) in tipo_pedido" :key="index">
          <a :class="tipo_pedido_select === index ? 'active' : ''" @click="emitTipoPedidoSelect(index)">{{ item.texto
            }}</a>
        </li>
      </ul>
    </details>
    feitos por
    <details class="dropdown ClickScreenToClose">
      <summary class="m-1 link link-primary">Todos os vendedores</summary>
      <ul class="shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-64">
        <li><a>Todos os vendedores</a></li>
      </ul>
    </details>
    entre
    <details class="dropdown ClickScreenToClose">
      <summary class="m-1 link link-primary">
        {{ periodo[periodo_select ?? 0].data_inicial }} e {{ periodo[periodo_select ?? 0].data_final }}
      </summary>
      <ul class="shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-64">
        <li v-for="(item, index) in periodo" :key="index">
          <a :class="periodo_select === index ? 'active' : ''" @click="emitPeriodoSelect(index)">
            {{ item.data_inicial }} à {{ item.data_final }}
          </a>
        </li>
        <button class="btn btn-sm btn-secondary mt-2" @click="openModal">
          <i class="bx bx-plus-circle"></i>Novo período
        </button>
      </ul>
    </details>

    <!-- Modal -->
    <div class="modal fade" v-if="isModalOpen" @close="closeModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
              </form>
              <h3 class="font-bold text-lg">Listas de períodos salvos</h3>

              <div v-for="(item, index) in periodo" :key="index" class="stats w-full">
                <div class="stat">
                  <div class="stat-figure">
                    <button class="btn btn-sm btn-secondary" @click="emitDeletePeriodo(index)">
                      <i class="text-2xl bx bx-trash"></i>
                    </button>
                  </div>
                  <div class="stat-value text-2xl text-primary">
                    <div :class="periodo_select === index ? 'active' : ''" @click="emitPeriodoSelect(index)">
                      {{ item.data_inicial }} à {{ item.data_final }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="stats w-full">
                <div class="stat">
                  <div class="stat-figure">
                    <button class="btn btn-sm btn-primary" @click="adicionarPeriodoLista">
                      <i class="text-2xl bx bx-plus"></i>
                    </button>
                  </div>
                  <div class="stat-value text-2xl text-primary">
                    <input type="date" v-model="tdata_inicial" class="input input-sm input-bordered w-40" />
                    à
                    <input type="date" v-model="tdata_final" class="input input-sm input-bordered w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      isModalOpen: false,
      tdata_inicial: moment(new Date()).format("YYYY-MM-DD"),
      tdata_final: moment(new Date()).format("YYYY-MM-DD"),
    };
  },
  props: {
    tipo_pedido: {
      type: Array,
      required: true,
    },
    tipo_pedido_select: Number,
    periodo: {
      type: Array,
      required: true,
    },
    periodo_select: Number,
  },
  watch: {
    periodo_select() {
      this.emitPeriodo();
    },
    tipo_pedido_select() {
      this.emitPeriodo();
    },
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    adicionarPeriodoLista() {
      this.$emit("adicionar_periodo_lista", this.tdata_inicial, this.tdata_final);
    },
    emitPeriodo() {
      this.$emit(
        "recarregar",
        moment(this.periodo[this.periodo_select ?? 0].data_inicial, "DD/MM/YYYY").format("YYYY-MM-DD"),
        moment(this.periodo[this.periodo_select ?? 0].data_final, "DD/MM/YYYY").format("YYYY-MM-DD"),
        this.periodo_select,
        this.tipo_pedido_select
      );
    },
    emitTipoPedidoSelect(index) {
      this.$emit("update:tipo_pedido_select", index);
    },
    emitPeriodoSelect(index) {
      this.$emit("update:periodo_select", index);
    },
    emitDeletePeriodo(index) {
      this.$emit("deletePeriodo", index);
    },
  },
  emits: [
    "adicionar_periodo_lista",
    "recarregar",
    "update:tipo_pedido_select",
    "update:periodo_select",
    "deletePeriodo",
  ],
};
</script>