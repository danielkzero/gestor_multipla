<template>
    <div class="rounded-xl navbar bg-base-100 shadow">
        <div class="navbar">
            <label for="my-drawer" class="p-2 ps-0 lg:hidden drawer-button">
                <i class="bx bx-menu text-2xl"></i>
                
            </label>
        </div>

        <div class="navbar-end">
            <label class="swap swap-rotate btn btn-ghost btn-circle me-2">
                <input ref="themecontroller" @click="themeChange()" type="checkbox" class="theme-controller"
                    value="sunset" v-model="themeChecked" />
                <i class='swap-on fill-current bx bx-moon text-xl'></i>
                <i class='swap-off fill-current bx bx-sun text-xl'></i>
            </label>
            <div class="dropdown dropdown-end">

                <label tabindex="0" role="button" class="avatar p-1 btn btn-circle" v-if="avatar_usuario == null">
                    <i class="fill-current bx bxs-user-circle text-4xl"></i>                    
                </label>

                <img tabindex="0" role="button" :src="avatar_usuario" class="avatar p-1 btn btn-circle"  v-if="avatar_usuario != null" />

                <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li>
                        <a @click="logout()">
                            <i class="bx bx-x"></i>Sair
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import axios from '@/axios';
import router from '@/router'; // Certifique-se de importar o roteador
export default defineComponent({
    data() {
        return {
            fillG: 'rgb(255,157,0)',
            fillESTOR: 'rgb(0,0,0)',
            themeChecked: true,
            nome_usuario: '',
            avatar_usuario: '',
            email_usuario: '',
            telefone_usuario: '',
            tipo_permissao_usuario: '',
        }
    },
    computed: {
        watchThemeController() {
            return (this.$refs.themecontroller).value;
        },
    },
    methods: {
        async themeChange() {
            const isChecked = (this.$refs.themecontroller).checked;
            localStorage.setItem('themecontroller', isChecked.toString());
            this.change(isChecked.toString());
        },
        async change(isChecked) {
            this.fillG = 'rgb(255,157,0)';
            this.fillESTOR = 'rgb(0,0,0)';


            if (isChecked == 'true') {
                this.fillG = 'rgb(255,157,0)';
                this.fillESTOR = 'rgb(159, 185, 197)';
            }


            this.$emit('theme-updated', { fillG: this.fillG, fillESTOR: this.fillESTOR });
        },
        async getInfoUsuario() {
            const usuario = localStorage.getItem('usuario');
            const response = await axios.get(`/api/v1/profile`,
                {
                    params: {
                        email: usuario,
                    },
                });
            if (response.status == 200) {
                const profile = response.data[0];
                this.nome_usuario = profile.nome;
                this.avatar_usuario = profile.avatar; // Avatar padrão se não houver
                this.email_usuario = profile.email;
                this.telefone_usuario = profile.telefone;
                this.tipo_permissao_usuario = profile.tipo_permissao;
                localStorage.setItem('json_profile', JSON.stringify(profile));
            } else {
                localStorage.removeItem('json_profile');
            }
        },
        logout() {
            // Remova as credenciais do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('json_profile');

            // Redireciona para a página de login
            router.push({ name: 'login'});
        }
    },
    mounted() {
        const themeCheckedFromLocalStorage = localStorage.getItem('themecontroller');
        this.themeChecked = themeCheckedFromLocalStorage || 'false';
        this.change(this.themeChecked);
        this.usuario = localStorage.getItem('usuario');
        this.getInfoUsuario();
        document.addEventListener('click', this.handleClickOutside);
    }
});
</script>