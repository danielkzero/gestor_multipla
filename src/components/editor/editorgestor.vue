<template>
    <div class="editor">
        <div class="text-bg-light rounded-top p-1">
            <div class="gap-1">
                <span class="btn btn-light btn-sm" @click="execCommand('bold')">
                    <i class="bx bx-bold"></i>
                </span>
                <span class="btn btn-light btn-sm" @click="execCommand('italic')">
                    <i class="bx bx-italic"></i>
                </span>
                <span class="btn btn-light btn-sm" @click="execCommand('underline')">
                    <i class="bx bx-underline"></i>
                </span>
                <span class="btn btn-light btn-sm" @click="execCommand('justifyLeft')">
                    <i class="bx bx-align-left"></i>
                </span>
                <span class="btn btn-light btn-sm" @click="execCommand('justifyCenter')">
                    <i class="bx bx-align-middle"></i>
                </span>
                <span class="btn btn-light btn-sm" @click="execCommand('justifyRight')">
                    <i class="bx bx-align-right"></i>
                </span>
            </div>
        </div>
        <div
            class="form-control rounded-top-0"
            contenteditable="true"
            ref="editor"
            @input="updateContent"
            style="min-height: 100px; border: 1px solid #ccc; padding: 10px;"
        ></div>
    </div>
</template>

<script>
export default {
    name: 'EditorGestor',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            content: this.modelValue, // Conteúdo inicial do editor
        };
    },
    watch: {
        modelValue(newValue) {
            if (newValue !== this.content) {
                this.content = newValue; // Atualiza o conteúdo do modelo
                this.$nextTick(() => {
                    this.$refs.editor.innerHTML = newValue; // Atualiza o conteúdo do editor
                });
            }
        },
    },
    methods: {
        execCommand(command) {
            document.execCommand(command, false, null); // Executa o comando de formatação
            this.updateContent(); // Atualiza o conteúdo após a execução do comando
        },
        updateContent() {
            this.content = this.$refs.editor.innerHTML; // Obtém o conteúdo do editor
            this.$emit('update:modelValue', this.content); // Emite o novo valor para o v-model
        },
    },
    mounted() {
        this.$refs.editor.innerHTML = this.content; // Define o conteúdo inicial no editor
    },
};
</script>

<style scoped>
.editor {
    margin-bottom: 10px;
}
</style>
