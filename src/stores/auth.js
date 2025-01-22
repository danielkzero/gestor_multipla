//auth.js
import { defineStore } from 'pinia';
import axios from 'axios'; // Importa a instância configurada

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
    }),
    actions: {
        login() {            
            this.isAuthenticated = true;
        },
        logout() {
            this.isAuthenticated = false;
        },
        async verifyStatus() {
            try {
                const response = await axios.get('/api/v1/statustoken', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).catch(function () {

                });
                if (response.data?.token) {
                    this.isAuthenticated = true;
                    return true;
                } else {
                    this.isAuthenticated = false;
                    return false;
                }
            } catch (error) {
                console.error('Erro na verificação do token:', error);

                this.isAuthenticated = false;
                return false;
            }
        }
    },
})