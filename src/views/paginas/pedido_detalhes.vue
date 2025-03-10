<template>
    <h1 class="text-2xl mb-4 ms-4 text-slate-500"><strong>Número do Pedido:</strong> {{ pedido.numero_pedido }}</h1>
    <!-- Informações do Pedido -->
    <div class="grid grid-cols-4 gap-4">
        <div class="col-span-4 md:col-span-3">
            <!-- Itens do Pedido -->
            <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
                <h2 class="text-2xl font-bold mb-2 px-4 pt-4">Itens do Pedido</h2>
                <p class="text-gray-500 mb-4 px-4">
                    Lista detalhada dos produtos incluídos no pedido, com seus valores e quantidades.
                </p>
                <div class="overflow-x-auto">
                    <DataTable :value="pedido.itens" responsiveLayout="scroll"
                        tableClass="table whitespace-nowrap" :rowClass="rowClass">
                        <!-- Cabeçalho -->
                        <template #header>
                            <div class="text-xs text-base-700 uppercase bg-base-200 p-2 rounded-t-lg">
                                <span class="font-bold">Lista de Itens</span>
                            </div>
                        </template>

                        <Column field="codigo" header="[#]" class="whitespace-nowrap"></Column>
                        <Column field="produto" header="Produto" sortable></Column>
                        <Column field="quantidade" header="QTD" sortable></Column>
                        <Column field="preco_tabela" header="Bruto" sortable>
                            <template #body="slotProps">
                                {{ formatMoeda(slotProps.data.preco_tabela) }}
                            </template>
                        </Column>
                        <Column field="desconto" header="%" sortable>
                            <template #body="slotProps">
                                <span :class="percentVerify(slotProps.data)">
                                    {{ formatPercent(slotProps.data.desconto) }}
                                </span>
                            </template>
                        </Column>
                        <Column field="preco_liquido" header="Líquido" :pt="{
                            bodyCell: (data) => ({
                                class: trendingUpDown(data.parent.props.rowData),
                            }),
                        }" sortable>
                            <template #body="slotProps">
                                <span :class="trendingUpDown(slotProps.data)">
                                    <i class='bx bx-trending-up'
                                        v-if="trendingUpDown(slotProps.data) === 'bg-primary text-white'"></i>
                                    <i class='bx bx-trending-down'
                                        v-if="trendingUpDown(slotProps.data) === 'bg-error text-white'"></i>
                                    {{ formatMoeda(slotProps.data.preco_liquido) }}
                                </span>
                            </template>
                        </Column>
                        <Column field="subtotal" header="Total" sortable>
                            <template #body="slotProps">
                                {{ formatMoeda(slotProps.data.subtotal) }}
                            </template>
                        </Column>

                        <!-- Ações -->
                        <Column header="Ações">
                            <template #body="slotProps">
                                <button @click="abrirModalEditar(slotProps.data)" class="btn btn-primary btn-xs mx-1">
                                    <i class="bx bx-edit"></i>
                                </button>
                                <button @click="removerItem(slotProps.data.pedido_id, slotProps.data.codigo)"
                                    class="btn btn-error btn-xs mx-1 dark:text-white ">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </template>
                        </Column>
                        <!-- Rodapé -->
                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Totais:" colspan="2"/>
                                <Column :footer="totalQuantidade" colspan="4" />
                                <Column :footer="formatMoeda(totalSubtotal)" colspan="1" />
                            </Row>
                        </ColumnGroup>
                    </DataTable>

                </div>
            </div>
        </div>

        <div class="col-span-4 md:col-span-1">
            <div class="card bg-base-100 shadow p-6 mb-4">
                <h2 class="text-2xl font-bold mb-2">Informações do Pedido</h2>
                <p class="text-gray-500 mb-6">Resumo geral do pedido e seu status atual.</p>

                <p class="text-lg"><strong>Cliente:</strong> {{ pedido.cliente }}</p>
            </div>

            <!-- Detalhes do Cliente -->
            <div class="card bg-base-100 shadow p-6 mb-4">
                <h2 class="text-2xl font-bold mb-2">Detalhes do Cliente</h2>
                <p class="text-gray-500 mb-6">
                    Aqui você encontra mais detalhes sobre o cliente associado ao pedido.
                </p>
                <p><strong>CNPJ:</strong> {{ pedido.cnpj }}</p>
                <p><strong>Endereço:</strong> {{ pedido.endereco }}</p>
                <p><strong>Bairro:</strong> {{ pedido.bairro }}</p>
                <p><strong>CEP:</strong> {{ pedido.cep }}</p>
                <p><strong>Cidade/Estado:</strong> {{ pedido.cidade }} - {{ pedido.estado }}</p>
                <p><strong>Telefone:</strong> <a :href="'tel:' + pedido.telefone">{{ pedido.telefone || 'N/A' }}</a></p>
                <p><strong>E-mail:</strong> <a :href="'mailto:' + pedido.email">{{ pedido.email }}</a></p>
            </div>

            <!-- Pagamento -->
            <div class="card bg-base-100 shadow p-6 mb-4">
                <h2 class="text-2xl font-bold mb-2">Pagamento</h2>
                <p class="text-gray-500 mb-6">
                    Detalhes da condição de pagamento e informações adicionais do vendedor.
                </p>
                <p><strong>Condição de Pagamento:</strong> {{ pedido.condicao_pagamento }}</p>
                <p><strong>Data de Emissão:</strong> {{ formatDataBR(pedido.data_emissao) }}</p>
                <p><strong>Vendedor:</strong> {{ pedido.vendedor }}</p>
                <p><strong>Tipo de Pedido:</strong> {{ pedido.tipo_pedido }}</p>
            </div>

            <!-- Logotipos e Representações -->
            <div class="flex justify-center items-center card bg-base-100 shadow p-6">
                <h2 class="text-2xl font-bold mb-6">Representada</h2>
                <img :src="pedido.logo_esquerda" alt="Logo Esquerda" class="h-16" />
                <p><strong>Representada:</strong> {{ pedido.representada }}</p>
                <img :src="pedido.logo_direita" alt="Logo Direita" class="h-16" />
            </div>
        </div>
    </div>

    <!-- Modal para edição -->
    <div v-if="mostrarModalEditar" class="modal modal-open">
        <div class="modal-box">
            <h2 class="text-2xl font-bold mb-2">Editar produto</h2>
            <p class="text-gray-500 mb-4">Edite os produtos incluídos no pedido, seus descontos, valores e quantidades.
            </p>
            <p class="mb-4">{{ produtoEditar.codigo }} - {{ produtoEditar.produto }}</p>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Quantidade</span>
                </div>
                <input type="number" placeholder="Type here" class="input input-bordered w-full" v-model="quantidade" />
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Desconto</span>
                    <span class="label-text-alt text-error">Não use o caracter %</span>
                </div>
                <input type="number" placeholder="Desconto sem %" class="input input-bordered w-full"
                    v-model="desconto" />
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Preço líquido</span>
                </div>
                <input type="number" placeholder="Type here" class="input input-bordered w-full"
                    v-model="preco_liquido" />
            </label>
            <div class="modal-action">
                <h2 class="text-2xl font-bold mt-2 me-auto">
                    {{ formatMoeda(preco_liquido * quantidade) }}
                </h2>
                <button class="btn"
                    @click="confirmarAlteracao(produtoEditar.pedido_id, produtoEditar.codigo)">Confirmar</button>
                <button class="btn btn-outline" @click="fecharModalEditar()">Cancelar</button>
            </div>
        </div>
    </div>

</template>

<script>
import axios from '@/axios';
import moment from 'moment';
import 'moment/locale/pt-br'; // Para suporte ao idioma português
import { formatMoeda, formatPercent } from "@/utils/format.js";
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            pedido: {
                numero_pedido: null,
                cliente: '',
                status: '',
                condicao_pagamento: '',
                data_emissao: '',
                vendedor: '',
                tipo_pedido: '',
                cnpj: '',
                endereco: '',
                bairro: '',
                cep: '',
                cidade: '',
                estado: '',
                telefone: '',
                email: '',
                logo_esquerda: '',
                logo_direita: '',
                representada: '',
                itens: [],
            },
            mostrarModalEditar: false,
            produtoEditar: [],
            quantidade: null,
            desconto: null,
            preco_liquido: null,
        };
    },
    mounted() {
        this.carregarPedido();
    },
    computed: {
        totalQuantidade() {
            return this.pedido.itens.reduce((total, item) => total + item.quantidade, 0);
        },
        totalBruto() {
            return this.pedido.itens.reduce((total, item) => total + item.preco_tabela * item.quantidade, 0);
        },
        totalLiquido() {
            return this.pedido.itens.reduce((total, item) => total + item.preco_liquido * item.quantidade, 0);
        },
        totalSubtotal() {
            return this.pedido.itens.reduce((total, item) => total + parseFloat(item.subtotal), 0);
        },
    },
    methods: {
        rowClass() {
            return 'hover:bg-base-300 cursor-pointer odd:bg-base-100 even:bg-base-200';
        },
        trendingUpDown(item) {
            if ((item.preco_tabela / item.preco_liquido) < 1 && item.desconto == null) {
                return 'bg-primary text-white';
            }
            if ((item.preco_tabela / item.preco_liquido) > 1 && item.desconto == null) {
                return 'bg-error text-white';
            }

            return '';
        },
        percentVerify(item) {
            if (item.desconto == null) {
                return '';
            }
            if ((item.preco_tabela * (1 - item.desconto)).toFixed(2) != item.preco_liquido.toFixed(2)) {
                return 'bg-error text-white';
            }
            return '';
        },
        formatDataBR(data) {
            return moment(data).format("DD/MM/YYYY");
        },
        async carregarPedido() {
            const pedidoId = this.$route.params.id;
            try {
                const response = await axios.get(`/api/v1/pedidos/${pedidoId}`);
                if (response.data.data.length > 0) {
                    this.pedido = response.data.data[0];
                    this.pedido.itens.forEach((item) => {
                        item.codigo = item.codigo.replace("CX", "");
                        item.codigo = item.codigo.padStart(6, "0");
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar o pedido:', error);
            }
        },
        abrirModalEditar(item) {
            this.mostrarModalEditar = true;
            this.produtoEditar = item;
            this.quantidade = item.quantidade;
            this.desconto = item.desconto == null ? null : item.desconto * 100;
            this.preco_liquido = item.preco_liquido;
        },
        fecharModalEditar() {
            this.mostrarModalEditar = false;
            this.produtoEditar = [];
        },
        removerItem(pedido_id, codigo) {
            Swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá reverter esta ação!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, remover!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete(`/api/v1/pedidos/itens/${pedido_id}/${codigo.replace(/^0+/, "")}`)
                        .then((response) => {
                            this.pedido.itens = this.pedido.itens.filter(item => item.codigo.replace(/^0+/, "") !== codigo.replace(/^0+/, ""));
                            Swal.fire('Removido!', 'O item foi removido com sucesso.', 'success');
                        })
                        .catch(error => {
                            console.error("Erro ao remover o item:", error);
                            Swal.fire('Erro!', 'Ocorreu um erro ao tentar remover o item.', 'error');
                        });
                }
            });
        },
        confirmarAlteracao(pedido_id, codigo) {
            this.mostrarModalEditar = false;
            this.produtoEditar.quantidade = this.quantidade;
            this.produtoEditar.desconto = this.desconto == 0 ? null : this.desconto / 100;
            this.produtoEditar.preco_liquido = this.preco_liquido * (1 - this.produtoEditar.desconto);
            this.produtoEditar.subtotal = ((this.produtoEditar.preco_liquido * this.produtoEditar.quantidade) * (1 - this.produtoEditar.desconto)).toFixed(2);

            // Enviar dados para API para atualizar item.
            axios.put(`/api/v1/pedidos/itens/${pedido_id}/${codigo.replace(/^0+/, "")}`, this.produtoEditar)
                .then((response) => {
                    Swal.fire({
                        position: "top-end",
                        title: 'O item foi alterado com sucesso.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                })
                .catch((error) => {
                    console.error("Erro ao alterar o item:", error);
                    Swal.fire({
                        position: "top-end",
                        title: 'Ocorreu um erro ao tentar alterar o item.',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 1000
                    });
                });
        },
        formatMoeda,
        formatPercent,
    },
};
</script>
