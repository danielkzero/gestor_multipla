<template>
    <div class="mb-4 d-flex align-items-center">
        <span>Mostrando</span>
        <div class="dropdown">
            <button class="btn btn-ghost dropdown-toggle text-primary" type="button" id="dropdownStatus"
                data-bs-toggle="dropdown" aria-expanded="false">
                {{ statusSelecionado.descricao }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownStatus">
                <li v-for="sts in statusList" :key="sts.status" @click="statusSelecionado = sts">
                    <a class="dropdown-item" href="#" 
                    :style="'background-color: ' + sts.hex_rgb + '; color: ' + getContrastColor(sts.hex_rgb)">
                        {{ sts.descricao }}
                    </a>
                </li>
            </ul>
        </div>

        <span>feitos por</span>
        <div class="dropdown">
            <button class="btn btn-ghost dropdown-toggle text-primary" type="button" id="dropdownStatus"
                data-bs-toggle="dropdown" aria-expanded="false">
                {{ vendedorSelecionado.nome }}
            </button>
            <ul class="dropdown-menu p-2" aria-labelledby="dropdownStatus">
                <li v-for="(usuarios, index) in listaUsuario" :key="index">
                    <button class="btn btn-primary mb-2 w-100" href="#" style="font-size: 0.9rem;"
                        @click="vendedorSelecionado = usuarios">
                        {{ usuarios.nome }}
                    </button>
                </li>
                <li @click="novoperiodo">
                    <button class="btn btn-secondary w-100" href="#" style="font-size: 0.9rem;">
                        <i class="bx bx-search"></i> Encontrar
                    </button>
                </li>
            </ul>
        </div>
        entre
        <div class="dropdown">
            <button class="btn btn-ghost dropdown-toggle text-primary" type="button" id="dropdownStatus"
                data-bs-toggle="dropdown" aria-expanded="false">
                {{ formatData(periodoSelecionado.inicial) }} e {{ formatData(periodoSelecionado.final) }}
            </button>
            <ul class="dropdown-menu p-2" aria-labelledby="dropdownStatus">
                <li v-for="(periodos, index) in periodo" :key="index">
                    <button class="btn btn-primary mb-2 w-100" href="#" style="font-size: 0.9rem;"
                        @click="periodoSelecionado = periodos">
                        {{ formatData(periodos.inicial) }} e {{ formatData(periodos.final) }}
                    </button>
                </li>
                <li @click="mostrarModal = true">
                    <button class="btn btn-secondary w-100" href="#" style="font-size: 0.9rem;">
                        <i class="bx bx-plus"></i> Novo periodo
                    </button>
                </li>
            </ul>
        </div>

        <!-- Modal controlado via Vue.js -->
        <div v-if="mostrarModal" class="modal d-block" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Adicionar Novo Período</h5>
                        <button type="button" class="btn-close" @click="fecharModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="dataInicial" class="form-label">Data Inicial</label>
                            <input type="date" v-model="novoPeriodo.inicial" class="form-control" id="dataInicial">
                        </div>
                        <div class="mb-3">
                            <label for="dataFinal" class="form-label">Data Final</label>
                            <input type="date" v-model="novoPeriodo.final" class="form-control" id="dataFinal">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="fecharModal">Cancelar</button>
                        <button type="button" class="btn btn-primary" @click="adicionarPeriodo">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '@/axios';
import moment from "moment";
import 'moment/locale/pt-br';
import { getContrastColor } from '@/functions/functions';
export default {
    data() {
        return {
            vendedorSelecionado: { id: null, nome: 'todos' },
            listaUsuario: [],
            statusSelecionado: { status: null, descricao: 'tudo' },
            statusList: [],
            periodoSelecionado: { inicial: moment(new Date()).format("YYYY-MM-DD"), final: moment(new Date()).format("YYYY-MM-DD") },
            periodo: [{ inicial: moment(new Date()).format("YYYY-MM-DD"), final: moment(new Date()).format("YYYY-MM-DD") }],
            novoPeriodo: { inicial: moment(new Date()).format("YYYY-MM-DD"), final: moment(new Date()).format("YYYY-MM-DD") },
            mostrarModal: false  // Controle do modal via Vue.js
        }
    },
    mounted() {
        this.fetchStatusList();
        this.buscaListaUsuarios();
    },
    watch: {
        vendedorSelecionado() {
            this.emitVendedor();
        },
        statusSelecionado() {
            this.emitStatus();
        },
        periodoSelecionado() {
            this.emitPeriodo();
        }
    },
    methods: {
        formatData(data) {
            return moment(data).format('DD/MM/YYYY');
        },
        emitPeriodo() {
            this.$emit('periodoSelecionado', this.periodoSelecionado);
        },
        emitStatus() {
            this.$emit('statusSelecionado', this.statusSelecionado);
        },
        emitVendedor() {
            this.$emit('vendedorSelecionado', this.vendedorSelecionado);
        },
        getContrastColor,
        async fetchStatusList() {
            try {
                const response = await axios.get('/api/v1/pedido_status', { params: { limit: 100 } });
                this.statusList = response.data.data;
                this.statusList.unshift({ status: null, descricao: 'tudo' });
            } catch (error) {
                console.error('Erro ao buscar status de pedidos:', error);
            }
        },
        async buscaListaUsuarios() {
            try {
                const response = await axios.get('/api/v1/usuario', { params: { limit: 100 } });
                this.listaUsuario = response.data.data;
                this.listaUsuario = response.data.data.map(usuario => ({
                    id: usuario.id,
                    nome: usuario.nome
                }));
                this.listaUsuario.unshift({ id: null, nome: 'todos' });
            } catch (error) {
                console.error('Erro ao buscar status de pedidos:', error);
            }
        },
        adicionarPeriodo() {
            if (this.novoPeriodo.inicial && this.novoPeriodo.final) {
                this.periodo.push({
                    inicial: this.novoPeriodo.inicial,
                    final: this.novoPeriodo.final
                });
                this.periodoSelecionado = {
                    inicial: this.novoPeriodo.inicial,
                    final: this.novoPeriodo.final
                };
                this.novoPeriodo = { inicial: moment(new Date()).format("YYYY-MM-DD"), final: moment(new Date()).format("YYYY-MM-DD") }; // Limpa os campos
                this.fecharModal(); // Fecha o modal
            }
        },
        fecharModal() {
            this.mostrarModal = false;
        },
    }
}
</script>
