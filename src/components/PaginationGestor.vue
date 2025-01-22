<template>
    <div class="flex justify-between items-center px-4 pb-4">
        <div>
            Registros: {{ formatarNumero(total) }}
        </div>
        <!-- Paginação -->
        <nav>
            <div class="join">
                <!-- Botão Anterior -->
                <button class="join-item btn btn-sm btn-square" @click="$emit('anterior')" :disabled="currentOffset === 0">
                    <i class='bx bxs-chevron-left'></i>
                </button>

                <!-- Primeira Página Sempre Visível -->
                <button class="join-item btn btn-sm btn-square" :class="{ 'btn-active': paginaAtual === 1 }"
                    @click="$emit('irParaPagina', 1)">
                    1
                </button>

                <!-- Páginas do Meio com `...` -->
                <span v-if="paginaAtual >= 5" class="join-item btn btn-sm btn-square disabled">...</span>

                <button class="join-item btn btn-sm btn-ghsquareost" v-for="page in paginasVisiveis" :key="page"
                    :class="{ 'btn-active': paginaAtual === page }" @click="$emit('irParaPagina', page)">
                    {{ page }}
                </button>

                <span v-if="paginaAtual <= paginas - 4" class="join-item btn btn-square disabled">...</span>

                <!-- Última Página Sempre Visível -->
                <button class="join-item btn btn-sm btn-square" v-if="paginas > 1"
                    :class="{ 'btn-active': paginaAtual === paginas }" @click="$emit('irParaPagina', paginas)">
                    {{ paginas }}
                </button>

                <!-- Botão Próxima -->
                <button class="join-item btn btn-sm btn-square" @click="$emit('proxima')" :disabled="!temMais">
                    <i class='bx bxs-chevron-right'></i>
                </button>
            </div>
        </nav>
    </div>
</template>


<script>
export default {
    props: {
        paginaAtual: { type: Number, default: 0 },
        temMais: { type: Boolean, default: false },
        currentOffset: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        paginas: { type: Number, default: 0 }
    },
    computed: {
        paginasVisiveis() {
            const paginas = [];
            const maxPaginasVisiveis = 5;
            const inicio = Math.max(2, this.paginaAtual - Math.floor(maxPaginasVisiveis / 2));
            const fim = Math.min(this.paginas - 1, inicio + maxPaginasVisiveis - 1);

            for (let i = inicio; i <= fim; i++) {
                paginas.push(i);
            }
            return paginas;
        },
    },
    methods: {
        formatarNumero(valor) {
            return new Intl.NumberFormat('pt-BR').format(valor);
        }
    }
}

</script>