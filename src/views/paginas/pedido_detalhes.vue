<template>
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
        <!-- Cabeçalho -->
        <header class="m-6 mb-0">
            <h1 class="text-2xl font-bold">Pedido #{{ pedido.numero_pedido }}</h1>
            <p class="text-lg"><strong>Cliente:</strong> {{ pedido.cliente }}</p>
            <p class="text-lg"><strong>Status:</strong> {{ pedido.status }}</p>
        </header>

        <!-- Tabela de Itens -->
        <section>
            <h2 class="text-xl font-semibold m-6">Itens do Pedido</h2>
            <div class="overflow-x-auto">
                <table class="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço de tabela</th>
                            <th>Desconto</th>
                            <th>Preço liquido</th>
                            <th>Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in pedido.itens" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.produto }}</td>
                            <td>{{ item.quantidade }}</td>
                            <td>{{ formatMoeda(item.preco_tabela) }}</td>
                            <td>{{ item.desconto }}</td>
                            <td>{{ formatMoeda(item.preco_liquido) }}</td>
                            <td>{{ formatMoeda(item.subtotal) }}</td>
                            <td>
                                <button @click="editarItem(item)" class="btn btn-sm btn-primary">Editar</button>
                                <button @click="removerItem(item.id)" class="btn btn-sm btn-error">Excluir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pedido: {
                id: null,
                cliente: '',
                status: '',
                itens: [],
            },
        };
    },
    mounted() {
        this.carregarPedido();
    },
    methods: {
        async carregarPedido() {
            const pedidoId = this.$route.params.id; // Obtendo o ID da rota
            try {
                const response = await axios.get(`http://localhost:8083/api/v1/pedidos/${pedidoId}`);
                if (response.data.data.length > 0) {
                    this.pedido = response.data.data[0];
                }
            } catch (error) {
                console.error('Erro ao carregar o pedido:', error);
            }
        },
        adicionarItem() {
            //
        },
        editarItem(item) {
            // 
        },
        async removerItem(itemId) {
            //
        },
        formatMoeda(valor) {
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(valor);
        },
    },
};
</script>