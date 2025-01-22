<template>
    <div class="drop-zone" @dragenter.prevent="handleDragEnter" @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop" @click="triggerFileInput" :class="{ dragging }">
        <p v-if="arquivos.length === 0" v-html="label"></p>
        <input type="file" @change="handleFileChange" ref="fileInput" multiple hidden />
        <div class="image-preview" v-if="arquivos.length > 0">
            <div v-for="(arquivo, index) in arquivos" :key="index" class="image-container">
                <img :src="arquivo.src" :alt="'Image ' + index" class="uploaded-image" v-if="arquivo.icon == 'image'" />
                <i class="p-3" :class="arquivo.icon" v-if="arquivo.icon != 'image'" style="min-height: 100px; min-width: 100px; font-size:3.5rem !important;"></i>
                <div style="font-size: 0.6rem">
                    {{ abbreviateFileName(arquivo.file.name) }} 
                </div>
                <button @click.stop="removeImage(index)" class="btn-danger btn-sm"><i class="bx bx-trash"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageUploader",
    props: {
        label: {
            type: String,
            required: true,
            default: 'Arraste e solte imagens aqui ou clique para carregar'
        }
    },
    data() {
        return {
            arquivos: [],
            dragging: false
        };
    },
    methods: {
        handleDragEnter() {
            this.dragging = true;
        },
        handleDragOver() {
            this.dragging = true;
        },
        handleDragLeave() {
            this.dragging = false;
        },
        handleDrop(event) {
            this.dragging = false;
            const files = Array.from(event.dataTransfer.files);
            this.uploadFiles(files);
        },
        handleFileChange(event) {
            const files = Array.from(event.target.files);
            this.uploadFiles(files);
        },
        async uploadFiles(files) {
            const fileIcons = {
                'image/png': 'image',
                'image/jpeg': 'image',
                'image/gif': 'image',
                'application/pdf': 'bx bxs-file-pdf text-danger',
                'application/msword': 'bx bxs-file-doc text-primary',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document text-primary': 'bx bxs-file-doc',
                'application/x-zip-compressed': 'bx bxs-file-archive text-info',
                'application/x-rar-compressed': 'bx bxs-file-archive text-info',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bx bxs-spreadsheet text-success',
                'default': 'bx bxs-file'
            };

            for (const file of files) {
                const iconClass = fileIcons[file.type] || fileIcons['default'];
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const src = e.target.result;
                    this.arquivos.push({ src, file, icon: iconClass });
                };
                reader.readAsDataURL(file);
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        async removeImage(index) {
            const arquivo = this.arquivos[index];
            await this.deleteFromServer(arquivo.serverPath);
            this.arquivos.splice(index, 1);
        },
        getarquivos() {
            return this.arquivos.map(arquivo => arquivo.file);
        },
        abbreviateFileName(fileName, maxLength = 15) {
            const parts = fileName.split('.');
            const name = parts[0];
            const extension = parts[1] ? '.' + parts[1] : '';

            if (name.length <= maxLength) {
                return fileName; 
            }

            const abbreviatedName = name.slice(0, maxLength - 4) + '....'; 
            return abbreviatedName + extension;
        }
    }
};
</script>

<style scoped>
.drop-zone {
    width: 100%;
    min-height: 200px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s;
    flex-direction: column;
}

.drop-zone.dragging {
    background-color: #f0f0f0;
}

.image-preview {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.image-container {
    position: relative;
    margin: 5px;
}

.uploaded-image {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 5px;
}

.image-container button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.image-container button:hover {
    background: rgba(255, 0, 0, 0.8);
}
</style>