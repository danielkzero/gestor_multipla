<template>
    <table id="data_table" :class="modelValue ? 'hidden' : ''" class="table whitespace-nowrap w-full"
        style="font-size: 0.8rem">
        <thead>
            <tr class="text-left text-xs text-base-700 uppercase bg-base-200">
                <th v-for="key in availableKeys" :key="key" >
                    {{ getCaption(key) }}
                </th>
                <th >Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in items" :key="index" class="hover:bg-base-300 cursor-pointer odd:bg-base-100 even:bg-base-200">
                <td v-for="key in availableKeys" :key="key" >
                    <!-- Imagem única -->
                    <template v-if="getFieldType(key) === 'imagens' && !Array.isArray(item[key])">
                        <img :src="item[key] === null ? 'src/assets/empty-300x240.jpg' : item[key]" alt="Imagem"
                            class="w-6 h-6 rounded border" />
                    </template>

                    <!-- Imagens múltiplas -->
                    <span v-else-if="key === 'imagens' && Array.isArray(item[key])">
                        <div v-if="item[key].length === 0">
                            <img src="@/assets/empty-300x240.jpg" alt="Imagem Padrão"
                                class="w-6 h-6 rounded border cursor-pointer"
                                @click="$emit('showImage', require('@/assets/empty-300x240.jpg'), item, items[index].id)" />
                        </div>
                        <div v-else>
                            <img :src="item.imagens[0].imagem_base64" alt="Imagem"
                                class="w-6 h-6 rounded border cursor-pointer"
                                @click="$emit('showImage', item.imagens[0].imagem_base64, item, items[index].id)" />
                        </div>
                    </span>

                    <!-- Campo numérico -->
                    <span v-else-if="getFieldType(key) === 'number'">
                        {{ getFieldFormat(getItemValue(item, key, null), key) }}
                    </span>

                    <!-- Campo de cor -->
                    <div v-else-if="getFieldType(key) === 'color'" class="badge rounded-md px-2 py-1"
                        :style="'background-color: ' + getItemValue(item, key, null) + '; color: ' + getContrastColor(getItemValue(item, key, null))">
                        {{ getItemValue(item, key, null) }}
                    </div>

                    <!-- Checkbox -->
                    <span v-else-if="getFieldType(key) === 'checkbox'">
                        <i class="bx bx-check text-success"
                            v-if="getFieldFormat(getItemValue(item, key, null), key)"></i>
                        <i class="bx bx-x text-danger" v-else></i>
                    </span>

                    <!-- Campos simples -->
                    <span v-else-if="getFieldType(key) !== 'datetime'">
                        {{ getItemValue(item, key, null) }}
                    </span>

                    <!-- Campos de data -->
                    <span v-else>
                        {{ formatDate(item[key], getField(key)) }}
                    </span>
                </td>

                <!-- Ações -->
                <td class="px-2 py-1">
                    <button class="btn btn-xs btn-primary mx-1" @click="$emit('editItem', index)"
                        v-if="crud == 'modal'">
                        <i class="bx bxs-edit"></i>
                    </button>

                    <router-link class="btn btn-xs btn-primary mx-1" :to="crud_endpoint + '/' + item.id" v-else>
                        <i class="bx bxs-edit"></i>
                    </router-link>

                    <button class="btn btn-xs btn-error mx-1 text-white" @click="$emit('deleteItem', item)">
                        <i class="bx bxs-trash"></i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script>
export default {
    props: {
        modelValue: { type: Boolean, default: false },
        items: { type: Array, required: true },
        availableKeys: { type: Array, required: true },
        novoItem: { type: Object, required: true },
        crud: { type: String, default: 'modal' },
        crud_endpoint: { type: String, default: null }
    },
    methods: {
        traverse(obj, mykey) {
            for (const key in obj) {
                if (Object.hasOwn(obj, key)) {
                    const value = obj[key];
                    // Verifica se chegamos ao campo "dados"
                    if (key === mykey) {
                        for (const fieldKey in value) {
                            if (Object.hasOwn(value, fieldKey)) {
                                const fieldValue = value[fieldKey];
                                return fieldValue;
                            }
                        }
                    } else if (typeof value === "object") {
                        this.traverse(value, mykey); // Chama recursivamente
                    }
                }
            }
        },
        findType(obj, mykey) {
            let result = {}; // Objeto para armazenar os resultados

            function recursiveSearch(o) {
                for (const key in o) {
                    if (Object.hasOwn(o, key)) {
                        const value = o[key];

                        if (key === mykey) {
                            // Adiciona o valor ao resultado apenas se ainda não estiver presente
                            if (!result[0]) {
                                result[0] = value;
                            }
                        } else if (typeof value === "object" && value !== null) {
                            recursiveSearch(value); // Chama recursivamente
                        }
                    }
                }
            }

            recursiveSearch(obj); // Inicia a busca recursiva
            return result;
        },
        getFieldType(key) {
            if (Object.keys(this.findType(this.novoItem, key)).length === 0) {
                return 'text';
            }
            return this.findType(this.novoItem, key) != null ? this.findType(this.novoItem, key)[0].type : 'text';
        },
        uniqueItems(Array) {
            return Array.from(new Set(this.items.map(obj => JSON.stringify(obj))))
                .map(str => JSON.parse(str));
        },
        getFieldFormat(value, key) {
            return this.findType(this.novoItem, key)[0].format === 'currency' ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : value;
        },
        getField(key) {
            return this.novoItem[key] || {};
        },
        getItemValue(item, key) {
            return item[key] || '';
        },
        getCaption(key) {
            if (this.novoItem[key]) {
                if (this.novoItem[key].type === 'grade') {
                    return this.novoItem[key].content.map(item => {
                        return Object.keys(item.dados)
                            .map(dadoKey => item.dados[dadoKey].caption || dadoKey)
                            .join(', ');
                    }).join(', ');
                } else {
                    return this.novoItem[key].caption || key;
                }
            } else {
                return this.findCaptionInSubNodes(this.novoItem, key);
            }
        },
        findCaptionInSubNodes(node, key) {
            for (const nodeKey in node) {
                if (node[nodeKey] && typeof node[nodeKey] === 'object') {
                    if (node[nodeKey].dados && node[nodeKey].dados[key]) {
                        return node[nodeKey].dados[key].caption || key;
                    } else if (node[nodeKey].content) {
                        for (const group of node[nodeKey].content) {
                            if (group.dados && group.dados[key]) {
                                return group.dados[key].caption || key;
                            }
                        }
                    }
                }
            }
            return key;
        },
    }
};
</script>