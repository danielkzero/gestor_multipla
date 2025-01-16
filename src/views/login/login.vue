<template>
  <div class="hero min-h-screen" style="
      background-image: url(https://barramansa.rj.gov.br/wp-content/uploads/2019/08/download-1024x678.jpg);
    ">
    <div class="hero-overlay bg-opacity-70"></div>
    <div class="hero-content">
      <div class="card">
        <div class="card-body">
          <div class="card-title">
            <div class="m-auto">
              <logoGestor G="rgb(255,255,255)" ESTOR="rgb(255,255,255)" />
            </div>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Usuário</span>
            </label>
            <input type="text" placeholder="Usuário" class="input input-bordered" v-model="usuario" required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text text-white">Senha</span>
            </label>
            <input type="password" placeholder="Senha" class="input input-bordered" v-model="senha" required />
            <label class="cursor-pointer label">
              <span class="label-text text-white">Lembre-me</span>
              <input type="checkbox" v-model="lembrarMe" class="toggle toggle-primary" />
            </label>
          </div>
          <div class="form-control">
            <button @click="logar()" class="btn btn-primary">Entrar</button>
          </div>
          <div class="form-control">
            <label class="label m-auto">
              <router-link to="esqueci_minha_senha" class="label-text-alt link link-hover text-white">
                Esqueci minha senha
              </router-link>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import logoGestor from '../../components/logo/index.vue';
  import axios from 'axios';
  import { inject } from 'vue';
  
  export default {
    components: {
      logoGestor
    },
    data() {
      return {
        usuario: '' as string, //usuario para entrar no sistema
        senha: '' as string, //senha para entrar no sistema
        min_tentativas: 5, //quantidades de tentativas
        tentativas: 0, //quantidades de tentativas
        tempo_espera: 180000, //1000 = 1 segundo
        lembrarMe: false,
        apiGestor: inject<string>('apiGestor'),
      }
    },
    methods: {
      async addtentativas() {
        this.tentativas++;
      },
      async logar() {
        localStorage.removeItem('token');
        if (localStorage.getItem('token') === null) {
          const response = await axios.post(
            this.apiGestor+'/login', {
              usuario: this.usuario,
              senha: this.senha
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.status >= 200 && response.status < 300) {
            const json = response.data;
            localStorage.setItem('token', json.token);
            if (this.lembrarMe) {
              localStorage.setItem('usuario', this.usuario.toString());
              localStorage.setItem('senha', this.senha.toString());
              localStorage.setItem('lembrarMe', this.lembrarMe.toString());
            } else if (!this.lembrarMe) {
              localStorage.removeItem('usuario');
              localStorage.removeItem('senha');
              localStorage.removeItem('lembrarMe');
            }

            this.$router.push({
              name: 'Inicio'
            });
          } else {
            alert((response.status || '') + ': Algo deu errado!');
          }
        }
      },
      async trazerInfoLogin() {
        if (localStorage.getItem('lembrarMe')) {
          const usuarioFromLocalStorage = localStorage.getItem('usuario');
          this.usuario = usuarioFromLocalStorage !== null ? usuarioFromLocalStorage : '';

          const senhaFromLocalStorage = localStorage.getItem('senha');
          this.senha = senhaFromLocalStorage !== null ? senhaFromLocalStorage : '';

          const lembrarMeFromLocalStorage = localStorage.getItem('lembrarMe');
          this.lembrarMe = lembrarMeFromLocalStorage == 'true' ? true : false;
        }
      }
    },
    mounted() {
      this.trazerInfoLogin();
    }
  }
</script>