<template>
    <div class="rounded p-3 bg-secondary">
        <!-- Input para seleção de arquivos (escondido) -->
        <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileSelect"
            style="display: none;" />
        <button class="btn btn-primary d-block mb-3" @click="triggerFileInput">
            Adicionar fotos
        </button>
        <div>
            *Se o nome da foto for o código de um produto, ela será atribuída automaticamente ao produto. Formatos
            válidos: jpg, png, gif, jpeg.
        </div>

        <!-- Lista de imagens e seu status de envio -->
        <ul v-if="imagens.length > 0" class="mb-3">
            <li v-for="(imagem, index) in imagens" :key="index">
                Código do Produto: {{ imagem.codigo }} - Ordem: {{ index + 1 }}
                <span v-if="imagem.status === 'success'" class="text-success">
                    <i class="bx bx-check"></i> Enviado com sucesso
                </span>
                <span v-else-if="imagem.status === 'error'" class="text-danger">
                    <i class="bx bx-x"></i> Falha ao enviar
                </span>
                <span v-else>
                    Enviando...
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imagens: [], // Armazena os arquivos e seus status de envio
            enviando: false, // Para evitar múltiplos envios simultâneos
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            const promises = []; // Para armazenar todas as Promises dos FileReaders

            // Processar os arquivos, convertendo para base64 e extraindo o código do produto
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                // Adiciona uma Promise para cada leitura de arquivo
                promises.push(new Promise((resolve) => {
                    reader.onload = (e) => {
                        const codigo = file.name.split('.').slice(0, -1).join('.');
                        const imagem_base64 = e.target.result;

                        // Resolve a Promise com o novo objeto de imagem
                        resolve({ codigo, imagem_base64, status: "pending" });
                    };
                    reader.readAsDataURL(file); // Converte a imagem para base64
                }));
            }

            // Após todas as Promises serem resolvidas, adiciona as imagens ao array e inicia o envio
            Promise.all(promises).then((newImages) => {
                this.imagens = [...this.imagens, ...newImages];

                // Inicia o envio em lotes de 10 se não estiver enviando
                if (!this.enviando) {
                    this.enviarLoteImagens();
                }

                console.log(this.imagens, this.enviando);
            });
        },
        async enviarLoteImagens() {
            this.enviando = true;
            const totalImagens = this.imagens.length;
            let index = 0;

            while (index < totalImagens) {
                // Pega um lote de até 10 imagens
                const loteImagens = this.imagens.slice(index, index + 10);

                // Enviar o lote de até 10 imagens
                await this.enviarImagensLote(loteImagens, index);

                // Avança o índice para o próximo lote
                index += 10;
            }

            this.enviando = false;
        },

        async enviarImagensLote(loteImagens, indexInicial) {
            try {
                const response = await fetch("/api/v1/produto_imagem/por_codigo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loteImagens), // Envia o array com até 10 imagens
                });

                const resultado = await response.json();

                if (response.status == 200) {
                    // Atualiza o status com base no retorno da API
                    resultado.forEach((res) => {
                        if (res.status == 'success') {
                                const imagemIndex = this.imagens.findIndex(img => img.codigo === res.codigo);
                                if (imagemIndex !== -1) {
                                    this.imagens[imagemIndex] = { ...this.imagens[imagemIndex], status: "success" };
                                }
                        }

                        if (res.status == 'error') {
                                const imagemIndex = this.imagens.findIndex(img => img.codigo === res.codigo);
                                if (imagemIndex !== -1) {
                                    this.imagens[imagemIndex] = { ...this.imagens[imagemIndex], status: "error" };
                                }
                        }
                    });

                } else {
                    // Caso o envio falhe totalmente, marca todas como erro
                    loteImagens.forEach((imagem, index) => {
                        this.imagens[indexInicial + index] = { ...imagem, status: "error" };
                    });
                }
            } catch (error) {
                // Atualiza o status para "error" se houver erro de rede
                console.error("Erro de rede ou de envio:", error);
                loteImagens.forEach((imagem, index) => {
                    this.imagens[indexInicial + index] = { ...imagem, status: "error" };
                });
            }
        },
    },
};
</script>
