<template>
    <!-- Modal de adicionar/editar item -->
    <div class="modal fade" id="deliveryModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ Titulo }}</h5>
                    <button type="button" class="btn-close" @click="$emit('closeModal')"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <!-- Renderizar os campos fora da grid -->
                        <div v-for="(field, key) in novoItem" :key="key">
                            <template v-if="field.type !== 'grade'">
                                <FormDataTableGestor :tempItem="tempItem" @update:tempItem="updatedTempItem"
                                    :Field="field" :Key="key" />
                            </template>
                            <!-- Renderizar a grid se o tipo for 'grade' -->
                            <template v-if="field.titulo_grupo">
                                <h5 class="pb-2 pt-2 border-top mx-n3 px-3">{{ field.titulo_grupo }}</h5>
                            </template>
                            <template v-if="field.type === 'grade'">
                                <div class="row mb-2">
                                    <div v-for="(group, index) in field.content" :key="index" :class="group.class">
                                        <div v-for="(subField, subKey) in group.dados" :key="subKey">
                                            <FormDataTableGestor :tempItem="tempItem" @update:tempItem="updatedTempItem"
                                                :Field="subField" :Key="subKey" :valorTotal="valorTotal" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" v-if="actions">
                    <button type="button" class="btn btn-primary" @click="$emit('saveDelivery')">Salvar</button>
                    <button type="button" class="btn btn-secondary" @click="$emit('closeModal')">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import FormDataTableGestor from './FormDataTableGestor.vue';
export default {
    components: { FormDataTableGestor },
    props: {
        tempItem: { type: Object, default: null },
        novoItem: { type: Object, default: null},
        Titulo: { type: String, default: ''},
        updatedTempItem: { stype: Object, default: null},
		valorTotal: { stype: Number, default: 0},
        actions: { type: Boolean, default: true }
    }
}
</script>