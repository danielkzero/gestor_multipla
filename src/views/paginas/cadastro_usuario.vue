<template>
    <div class="overflow-x-auto card bg-base-100 w-full mb-3 shadow">
        <h5 class="my-4 pb-3 mx-n3 px-3 border-b">
            <i class="bx bxs-user"></i> {{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}
        </h5>
        <div class="m-4 mt-0">
            <form @submit.prevent="submitForm" class="grid grid-cols-5 gap-4">
                <!-- Avatar Upload -->
                <div class="text-center col-span-5 md:col-span-1 row-span-4">
                    <label for="avatar" class="block mb-2">Avatar</label>
                    <div class="m-auto" style="max-height: 100px; max-width: 100px;">
                        <!-- Ícone grande para abrir a caixa de diálogo de upload -->
                        <i class="bx bxs-user-circle text-8xl cursor-pointer w-24 h-24 rounded-full shadow" v-if="!formData.avatar"
                            @click="triggerAvatarUpload"></i>
                        <!-- Mostrar a prévia do avatar se a imagem for selecionada -->
                        <div v-if="formData.avatar">
                            <img :src="formData.avatar" alt="Avatar Preview" class="w-24 h-24 rounded-full shadow"
                                @click="triggerAvatarUpload" />
                        </div>
                    </div>
                    <input type="file" ref="avatarInput" @change="handleAvatarUpload" class="hidden" accept="image/*" />
                </div>

                <!-- Nome -->
                <div class="col-span-5 md:col-span-2">
                    <label for="nome" class="block text-sm font-medium mb-2">Nome</label>
                    <input type="text" v-model="formData.nome" id="nome" required class="input input-bordered w-full" />
                </div>

                <!-- Telefone -->
                <div class="col-span-5 md:col-span-2">
                    <label for="telefone" class="block text-sm font-medium mb-2">Telefone</label>
                    <input type="text" v-model="formData.telefone" id="telefone" required
                        class="input input-bordered w-full" />
                </div>

                <!-- E-mail -->
                <div class="col-span-5 md:col-span-2">
                    <label for="email" class="block text-sm font-medium mb-2">E-mail</label>
                    <input type="email" v-model="formData.email" id="email" required
                        class="input input-bordered w-full" />
                </div>

                <!-- Senha -->
                <div class="col-span-5 md:col-span-2">
                    <label for="senha" class="block text-sm font-medium mb-2">Senha</label>
                    <input type="password" v-model="formData.senha" id="senha" 
                        class="input input-bordered w-full" />
                </div>

                <!-- Permissões -->
                <div class="col-span-5 md:col-span-4">
                    <label class="block text-sm font-medium mb-2">Permissões</label>
                    <select v-model="formData.tipo_permissao" class="select select-bordered w-full">
                        <option value="administrador">Administrador</option>
                        <option value="comum">Comum</option>
                    </select>
                    <div v-if="formData.tipo_permissao === 'administrador'" class="mt-2">
                        <p>
                            Tem acesso total ao sistema, podendo visualizar, alterar e excluir qualquer coisa inclusive
                            outros usuários.
                        </p>
                    </div>
                </div>

                <!-- Botão de submissão -->
                <div class="col-span-5 md:col-span-4">
                    <button type="submit" class="btn btn-primary w-full">
                        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>


<script>
import AlertGestor from '@/components/AlertGestor.vue';
import EditorGestor from '@/components/EditorGestor.vue';
import axios from '@/axios';

export default {
    components: {
        EditorGestor,
        AlertGestor
    },
    data() {
        return {
            formData: {
                id: null,
                avatar: null,
                nome: '',
                telefone: '',
                email: '',
                usuario: '',
                senha: '',
                tipo_permissao: 'comum',
                permissao: {
                    comum: {
                        limitarClientes: false,
                        alterarPedido: false,
                        visualizarPedidos: false,
                    },
                    administrador: {
                        gerenciarUsuarios: false,
                    }
                },
                assinatura_email: '',
            },
            isEditing: false
        };
    },
    mounted() {
        // Verifica se há um ID na rota
        const id = this.$route.params.id;
        if (id) {
            this.isEditing = true;
            this.loadUserData(id);
        }
    },
    methods: {
        triggerAvatarUpload() {
            // Abre a caixa de diálogo de seleção de arquivo
            this.$refs.avatarInput.click();
        },
        handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    this.formData.avatar = e.target.result; // Armazena a imagem como uma URL base64
                };
                reader.readAsDataURL(file);
            }
        },
        loadUserData(id) {
            // Busca os dados do usuário para edição
            axios.get(`/api/v1/usuario/${id}`)
                .then(response => {
                    const userData = response.data[0];
                    this.formData = {
                        id: userData.id,
                        avatar: userData.avatar,
                        nome: userData.nome,
                        telefone: userData.telefone,
                        email: userData.email,
                        usuario: userData.usuario,
                        senha: null,
                        tipo_permissao: userData.tipo_permissao,
                        permissao: JSON.parse(userData.permissao),
                        assinatura_email: userData.assinatura_email,
                    };
                })
                .catch(error => {
                    console.error('Erro ao buscar os dados do usuário:', error);
                });
        },
        submitForm() {
            if (this.isEditing) {
                // Atualiza o usuário existente
                const id = this.$route.params.id;
                axios.put(`/api/v1/usuario/${id}`, this.formData)
                    .then(response => {
                        console.log(response);
                        alert('Usuário atualizado com sucesso!');
                        this.$router.push('/usuarios');
                    })
                    .catch(error => {
                        console.error('Erro ao atualizar o usuário:', error);
                    });
            } else {
                // Cria um novo usuário
                axios.post('/api/v1/usuario', this.formData)
                    .then(response => {
                        console.log(response);
                        alert('Usuário cadastrado com sucesso!');
                        this.$router.push('/usuarios');
                    })
                    .catch(error => {
                        console.error('Erro ao cadastrar o usuário:', error);
                    });
            }
        }
    }
};
</script>
