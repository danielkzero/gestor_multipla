<template>
    <!-- Modal para exibir imagem -->
    <div class="modal fade" id="imageModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Visualizar Imagem</h5>
                    <button type="button" class="btn-close" @click="$emit('closeImageModal')"></button>
                </div>
                <div class="modal-body m-0 py-3">
                    <div class="pb-3">
                        <span class="text-primary">{{ produtoOpen?.codigo }}</span> - {{ produtoOpen?.nome }}
                    </div>
                    <!-- Imagem Principal -->
                    <div class="text-center">
                        <img :src="selectedImage" class="img-fluid img-thumbnail" alt="Imagem"
                            style="max-width: 300px; max-height: 300px;" />
                    </div>
                </div>
                <div class="modal-footer bg-secondary d-flex flex-column align-items-start">
                    <!-- Botão Adicionar Fotos -->


                    <!-- Input para seleção de arquivos (escondido) -->
                    <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileSelect"
                        style="display: none;" />


                    <!-- Galeria de Imagens -->
                    <h6>Galeria</h6>

                    <div class="row gap-2">
                        <div v-if="loadImages" class="text-center my-3 col-auto p-0 position-relative">
                            <div class="spinner-border text-primary" role="status" style="max-width: 80px; max-height: 80px; display: block;">
                                <span class="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                        <div v-for="image in images?.imagens" :key="image.ordem" class="col-auto p-0 position-relative">
                            <img :src="image.imagem_base64" class="img-fluid img-thumbnail cursor-pointer"
                                :alt="'Imagem ' + image.ordem" style="max-width: 80px; max-height: 80px;"
                                @click="$emit('selectImage', image.imagem_base64)" />
                            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                style="padding: 2px 6px;" @click="deleteImage(image)">
                                <i class="bx bxs-trash"></i>
                            </button>
                        </div>
                        <button type="button" class="btn btn-primary" @click="triggerFileInput"
                            style="max-width: 80px; min-height: 80px; font-size: 0.7rem">
                            Adicionar Fotos
                        </button>
                    </div>
                    <div class="alert alert-warning" style="font-size: 0.8rem">
                        Dimensões recomendadas: 400 x 400 pixels. O arquivo deve ser no formato .JPG, .JPEG, .GIF ou
                        .PNG, sendo
                        ideal ter menos de 2 MB. A imagem não precisa ser necessariamente quadrada, mas a largura
                        recomendada é
                        essa.
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    props: {
        produtoOpen: { type: Object, default: null },
        selectedImage: { type: String, default: '' }
    },
    data() {
        return {
            images: [],
            loadImages: false
        };
    },
    watch: {
        produtoOpen: {
            immediate: true,
            handler() {
                this.images = [];
                if (this.produtoOpen.id != null) {
                    this.updateProductImages(this.produtoOpen.id);
                }
            }
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
            const files = event.target.files;
            if (files.length > 0) {
                const filePromises = Array.from(files).map(file => this.fileToBase64(file));
                Promise.all(filePromises)
                    .then(base64Images => {
                        this.uploadImages(base64Images);
                    })
                    .catch(error => {
                        console.error('Erro ao converter arquivos para Base64', error);
                    });
            }
        },
        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({
                        imagem_base64: reader.result,
                        ordem: (this.images.length ? this.images.imagens.length : 0) + 1 // Ordem baseada no timestamp
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },
        async uploadImages(base64Images) {
            try {
                const response = await axios.post('/api/v1/produto_imagem', {
                    produto_id: this.produtoOpen.id,
                    imagens: base64Images
                });
                console.log('Imagens enviadas com sucesso', response.data);

                this.updateProductImages(this.produtoOpen.id);
            } catch (error) {
                console.error('Erro ao enviar imagens', error);
            }
        },
        async deleteImage(image) {
            try {
                // Chamada DELETE para remover a imagem
                await axios.delete(`/api/v1/produto_imagem/${image.id}`);
                // Atualiza a lista de imagens removendo a imagem deletada
                this.updateProductImages(this.produtoOpen.id);
                console.log('Imagem deletada com sucesso', this.produtoOpen.id);
            } catch (error) {
                console.error('Erro ao deletar imagem', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível deletar a imagem. Tente novamente.',
                });
            }
        },
        async updateProductImages(produtoId) {
            this.loadImages = true;
            try {
                const response = await axios.get(`/api/v1/produto_imagem/${produtoId}`);
                const updatedImages = response.data;
                if (response.data.length == 0) {
                    this.images = [];
                } else {
                    this.images.imagens = updatedImages;
                }
            } catch (error) {
                console.error('Erro ao buscar imagens atualizadas', error);
            } finally {
                this.loadImages = false;
            }
        },
    }
}
</script>