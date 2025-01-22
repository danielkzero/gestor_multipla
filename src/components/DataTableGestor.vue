<template>
  <div>
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
      <div class="flex items-center gap-4 p-4">
        <button class="btn btn-sm bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2 px-4 py-2" @click="addItem"
          v-if="crud === 'modal'">
          <i class="bx bx-plus"></i>
          Novo
        </button>

        <router-link class="btn btn-sm bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2 px-4 py-2"
          :to="crud_endpoint" v-else>
          <i class="bx bx-plus"></i>
          Novo
        </router-link>

        <template v-for="(botao, index) in botoes" :key="index">
          <router-link class="btn btn-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 px-4 py-2"
            :to="botao.route">
            <i :class="botao.icone"></i>
            {{ botao.nome }}
          </router-link>
        </template>

        <SearchInput v-model="busca" @search="performSearch" class="ml-auto w-full max-w-sm" />
      </div>

    
      <LoadingIndicator v-model="loading" />

      <TableGestor v-model="loading" :items="items" :availableKeys="availableKeys" :novoItem="novoItem" :crud="crud"
        :crud_endpoint="crud_endpoint" @updateProductImages="updateProductImages" @showImage="showImage"
        @editItem="editItem" @deleteItem="deleteItem" />
      <PaginationGestor :paginaAtual="paginaAtual" :temMais="temMais" :currentOffset="currentOffset" :total="total"
        :paginas="paginas" @proxima="proxima" @anterior="anterior" @irParaPagina="irParaPagina" />

      <ModalImagem :images="images" :produtoOpen="produtoOpen" :selectedImage="selectedImage"
        @handleFileSelect="handleFileSelect" @selectImage="selectImage" @deleteImage="deleteImage"
        @triggerFileInput="triggerFileInput" @closeImageModal="closeImageModal" />

      <ModalEditItem :tempItem="tempItem" :novoItem="novoItem" :updatedTempItem="updatedTempItem"
        @closeModal="closeModal" @saveDelivery="saveDelivery" :Titulo="Titulo" />
    </div>

  </div>
</template>


<script>
import axios from '@/axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import SearchInput from './SearchInput.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import TableGestor from './TableGestor.vue';
import PaginationGestor from './PaginationGestor.vue';
import ModalImagem from './ModalImagem.vue';
import ModalEditItem from './ModalEditItem.vue';

export default {
  props: {
    endPoint: { type: String, required: true, },
    novoItem: { type: Object, required: true, },
    availableKeys: { type: Array, required: true, },
    limit: { type: Number, default: 10, },
    offset: { type: Number, default: 0, },
    botoes: { type: Array, default() { return []; } },
    crud: { type: String, default: 'modal', },
    crud_endpoint: { type: String, default: null }
  },
  data() {
    return {
      busca: "",
      Titulo: "",
      items: [],
      editingIndex: -1,
      tempItem: {},
      loading: true,
      paginaAtual: 1,
      temMais: true,
      currentOffset: this.offset,
      total: 0,
      paginas: 0,
      selectedImage: "", // URL da imagem selecionada
      modalInstance: null, // Instância do modal
      modalInstanceImage: null,
      images: [], // Lista de imagens
      productId: null, // ID do produto
      produtoOpen: [],
      camposEncontrados: [],
    };
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

    updatedTempItem(updatedData) {
      this.tempItem = updatedData;
    },
    openModal() {
      if (!this.modalInstance) {
        const modalElement = document.getElementById("deliveryModal");
        this.modalInstance = new Modal(modalElement);
      }
      this.modalInstance.show();
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    showImage(imageUrl, imageList, id) {
      if (imageList) {
        this.updateProductImages(id);
      }
      this.produtoOpen = imageList;
      this.productId = id;
      this.selectedImage = imageUrl;

      if (!this.modalInstanceImage) {

        const imageModal = document.getElementById('imageModal');
        this.modalInstanceImage = new Modal(imageModal);
      }
      this.modalInstanceImage.show();
    },
    closeImageModal() {
      if (this.modalInstanceImage) {
        this.modalInstanceImage.hide();
      }
    },
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
          produto_id: this.productId,
          imagens: base64Images
        });
        console.log('Imagens enviadas com sucesso', response.data);

        this.updateProductImages(this.productId);
      } catch (error) {
        console.error('Erro ao enviar imagens', error);
      }
    },
    async updateProductImages(produtoId) {
      try {
        const response = await axios.get(`/api/v1/produto_imagem/${produtoId}`);
        const updatedImages = response.data;
        if (response.data.length == 0) {
          this.images = [];
        } else {
          this.images.imagens = updatedImages;
        }

        // Atualiza o item correto na lista de produtos
        const productIndex = this.items.findIndex(item => item.id === produtoId);
        if (productIndex !== -1) {
          this.items[productIndex].imagens = updatedImages;
        }
      } catch (error) {
        console.error('Erro ao buscar imagens atualizadas', error);
      }
    },
    async deleteImage(image) {
      try {
        // Chamada DELETE para remover a imagem
        await axios.delete(`/api/v1/produto_imagem/${image.id}`);
        // Atualiza a lista de imagens removendo a imagem deletada
        this.updateProductImages(this.productId);
        console.log('Imagem deletada com sucesso');
      } catch (error) {
        console.error('Erro ao deletar imagem', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível deletar a imagem. Tente novamente.',
        });
      }
    },
    async loadItems() {
      try {
        const response = await axios.get(this.endPoint, {
          params: {
            limit: this.limit,
            offset: this.currentOffset,
            busca: this.busca
          },
        });

        if (!response.data.data) {
          this.items = response.data;
          this.total = 1;
          this.paginas = Math.ceil(this.total / this.limit);
        } else {
          this.items = response.data.data;
          this.total = response.data.total;
          this.paginas = Math.ceil(this.total / this.limit);
        }

        this.loading = false;
        this.temMais = this.currentOffset + this.limit < this.total;
      }
      catch (error) {
        console.error("Erro ao carregar os itens:", error);
      }
    },
    async saveDelivery() {
      try {
        if (this.tempItem.id) {
          await this.updateItem();
        } else {
          const response = await axios.post(this.endPoint, this.tempItem, {
            headers: { "Content-Type": "application/json" },
          });
          this.items.push(response.data.data);
          this.closeModal();
        }
      }
      catch (error) {
        console.error("Erro ao salvar o item:", error);
      }
    },
    async editItem(index) {
      this.Titulo = "Editando";
      this.editingIndex = index;
      this.tempItem = { ...this.items[index] };
      this.openModal();
    },
    async addItem() {
      this.Titulo = "Novo";
      this.tempItem = {};
      this.openModal();
    },
    async updateItem() {
      try {
        const itemToUpdate = this.items[this.editingIndex];
        const response = await axios.put(`${this.endPoint}/${itemToUpdate.id}`, this.tempItem, { headers: { "Content-Type": "application/json" } });
        if (response.status == 200) {
          this.items[this.editingIndex] = this.tempItem;
        } else {
          this.items[this.editingIndex] = itemToUpdate;
        }

        this.editingIndex = -1;
        this.tempItem = {};
        this.closeModal();
      }
      catch (error) {
        console.error("Erro ao atualizar o item:", error);
      }
    },
    async deleteItem(item) {
      const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter essa ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Se o usuário confirmar, realiza a exclusão
        try {
          const response = await axios.delete(`${this.endPoint}/${item.id}`);
          if (response.data === "success") {
            this.items = this.items.filter(i => i.id !== item.id);
            Swal.fire('Excluído!', 'O item foi excluído com sucesso.', 'success');
          }
        } catch (error) {
          console.error("Erro ao excluir o item:", error);
          Swal.fire('Erro!', 'Ocorreu um erro ao tentar excluir o item.', 'error');
        }
      }
    },
    formatDate(value, field) {
      const format = field.format || 'YYYY-MM-DD';
      return moment(value).format(format);
    },
    performSearch(busca) {
      this.busca = busca;
      this.currentOffset = 0;
      this.paginaAtual = 1;
      this.loadItems();
    },
    anterior() {
      if (this.currentOffset > 0) {
        this.currentOffset -= this.limit;
        this.paginaAtual--;
        this.loadItems();
      }
    },
    proxima() {
      if (this.temMais) {
        this.currentOffset += this.limit;
        this.paginaAtual++;
        this.loadItems();
      }
    },
    selectImage(imageUrl) {
      this.selectedImage = imageUrl;
    },
    irParaPagina(pagina) {
      this.paginaAtual = pagina;
      this.currentOffset = (pagina - 1) * this.limit;
      this.loadItems();
    },
    formatarNumero(valor) {
      return new Intl.NumberFormat('pt-BR').format(valor);
    }
  },
  mounted() {
    this.loadItems();
  },
  components: {
    SearchInput,
    LoadingIndicator,
    TableGestor,
    PaginationGestor,
    ModalImagem,
    ModalEditItem
  }
};
</script>
