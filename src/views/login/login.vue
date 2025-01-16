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
              <span class="label-text text-white">E-mail</span>
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
          <!--
          <div class="form-control">
            <label class="label m-auto">
              <router-link to="esqueci_minha_senha" class="label-text-alt link link-hover text-white">
                Esqueci minha senha
              </router-link>
            </label>
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import logoGestor from '../../components/logo/index.vue';
import axios from 'axios';
import Swal from 'sweetalert2';


export default {
  components: {
    logoGestor
  },
  data() {
    return {
      usuario: '',
      senha: '',
      min_tentativas: 5, // Número máximo de tentativas
      tentativas: 0, // Contador de tentativas
      tempo_espera: 180000, // Tempo de espera em milissegundos (3 minutos)
      bloqueadoAte: 0, // Armazena o momento em que o bloqueio termina
      lembrarMe: false,
      apiGestor: 'http://localhost:8083/api/v1' // API do gestor
    }
  },
  methods: {
    async addTentativas() {
      this.tentativas++;

      if (this.tentativas >= this.min_tentativas) {
        this.bloqueadoAte = Date.now() + this.tempo_espera; // Calcula o momento de desbloqueio
        Swal.fire({
          icon: 'error',
          title: 'Excesso de Tentativas',
          text: 'Você excedeu o número máximo de tentativas. Tente novamente em 3 minutos.',
          confirmButtonText: 'Entendi'
        });
      }
    },
    async calcularTempoRestante() {
      const agora = Date.now();
      const diferenca = this.bloqueadoAte - agora;

      if (diferenca > 0) {
        const segundosRestantes = Math.ceil(diferenca / 1000);
        return segundosRestantes;
      }
      return 0;
    },
    async logar() {
      if (this.tentativas >= this.min_tentativas) {
        const tempoRestante = await this.calcularTempoRestante();

        if (tempoRestante > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Aguarde',
            text: `Você deve aguardar ${tempoRestante} segundos para tentar novamente.`,
            confirmButtonText: 'Ok'
          });
          return;
        } else {
          this.tentativas = 0; // Reseta tentativas se o tempo expirou
        }
      }

      localStorage.removeItem('token');
      try {
        const response = await axios.post(
          this.apiGestor + '/login',
          {
            usuario: this.usuario,
            senha: this.senha
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status >= 200 && response.status < 300) {
          const json = response.data;
          localStorage.setItem('token', json.token);

          console.log(json);

          if (this.lembrarMe) {
            localStorage.setItem('usuario', this.usuario.toString());
            localStorage.setItem('senha', this.senha.toString());
            localStorage.setItem('lembrarMe', this.lembrarMe.toString());
          } else {
            localStorage.removeItem('usuario');
            localStorage.removeItem('senha');
            localStorage.removeItem('lembrarMe');
          }

          this.tentativas = 0; // Reseta tentativas ao logar com sucesso
          this.$router.push({ name: 'Inicio' });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Algo deu errado. Verifique suas credenciais.',
            confirmButtonText: 'Ok'
          });
          this.addTentativas(); // Incrementa as tentativas em caso de falha
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: `Erro ao tentar logar: ${error.response?.data?.message || error.message}`,
          confirmButtonText: 'Ok'
        });
        this.addTentativas(); // Incrementa as tentativas em caso de erro
      }
    },
    async trazerInfoLogin() {
      if (localStorage.getItem('lembrarMe')) {
        this.usuario = localStorage.getItem('usuario') || '';
        this.senha = localStorage.getItem('senha') || '';
        this.lembrarMe = localStorage.getItem('lembrarMe') === 'true';
      }
    }
  },
  mounted() {
    this.trazerInfoLogin();
  }
}
</script>