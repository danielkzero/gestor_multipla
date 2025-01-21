<template>
    <h1 class="text-2xl mb-4 ms-4 text-slate-500"><strong>Número do Pedido:</strong> {{ pedido.numero_pedido }}</h1>
    <!-- Informações do Pedido -->
    <div class="grid grid-cols-4 gap-4">
        <div class="col-span-4 md:col-span-3">
            <!-- Itens do Pedido -->
            <div class="card bg-base-100 shadow p-6 mb-8">
                <h2 class="text-2xl font-bold mb-2">Itens do Pedido</h2>
                <p class="text-gray-500 mb-6">
                    Lista detalhada dos produtos incluídos no pedido, com seus valores e quantidades.
                </p>
                <div class="overflow-x-auto">
                    <table class="table w-full whitespace-nowrap overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço de Tabela</th>
                                <th>Desconto</th>
                                <th>Preço Líquido</th>
                                <th>Total</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in pedido.itens" :key="item.id">
                                <td>{{ item.codigo }}</td>
                                <td>{{ item.produto }}</td>
                                <td>{{ item.quantidade }}</td>
                                <td>{{ formatMoeda(item.preco_tabela) }}</td>
                                <td>{{ item.desconto }}</td>
                                <td :class="item.preco_tabela / item.preco != 0 && item.desconto == '' ? 'bg-error text-white' : ''">{{ formatMoeda(item.preco_liquido) }}</td>
                                <td>{{ formatMoeda(item.subtotal) }}</td>
                                <td>
                                    <button @click="editarItem(item)" class="btn btn-sm btn-primary">Editar</button>
                                    <button @click="removerItem(item.id)" class="btn btn-sm btn-error">Excluir</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

</template>

<script>
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br'; // Para suporte ao idioma português

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
        };
    },
    mounted() {
        this.carregarPedido();
    },
    methods: {
        formatDataBR(data) {
            return moment(data).format("DD/MM/YYYY");
        },
        async carregarPedido() {
            const pedidoId = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:8083/api/v1/pedidos/${pedidoId}`);
                if (response.data.data.length > 0) {
                    this.pedido = response.data.data[0];
                }
            } catch (error) {
                console.error('Erro ao carregar o pedido:', error);
            }
        },
        editarItem(item) {
            console.log('Editar item:', item);
        },
        removerItem(itemId) {
            console.log('Remover item ID:', itemId);
        },
        formatMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(valor);
        },
    },
};
</script>
