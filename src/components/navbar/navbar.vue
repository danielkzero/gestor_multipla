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
                    :value="MyTheme" v-model="themeChecked" />
                <i class='swap-on fill-current bx bx-moon text-xl'></i>
                <i class='swap-off fill-current bx bx-sun text-xl'></i>
            </label>

            <!-- Dropdown de temas -->
            <div class="dropdown dropdown-end me-2">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                    <i class="bx bx-palette text-xl"></i>
                </label>
                <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li v-for="theme, index in themes" :key="index">

                        <a @click="setTheme(index)">
                            <div class="grid grid-cols-2 gap-0.5 p-1 rounded-md shadow-sm shrink-0"
                                :style="`background-color: ${theme[0]}`">
                                <div class="size-1 rounded-full" :style="`background-color: ${theme[1]}`"></div>
                                <div class="size-1 rounded-full" :style="`background-color: ${theme[2]}`"></div>
                                <div class="size-1 rounded-full" :style="`background-color: ${theme[3]}`"></div>
                                <div class="size-1 rounded-full" :style="`background-color: ${theme[4]}`"></div>
                            </div>
                            <div class="w-32 truncate">{{ index }}</div>
                        </a>
                    </li>
                </ul>
            </div>


            <div class="dropdown dropdown-end">

                <label tabindex="0" role="button" class="avatar p-1 btn btn-circle" v-if="avatar_usuario == null">
                    <i class="fill-current bx bxs-user-circle text-4xl"></i>
                </label>

                <img tabindex="0" role="button" :src="avatar_usuario" class="avatar p-1 btn btn-circle"
                    v-if="avatar_usuario != null" />

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
            MyTheme: 'halloween',
            themes: {
                "light": [
                    "oklch(1 0 0)",
                    "oklch(0.21 0.006 285.885)",
                    "oklch(0.45 0.24 277.023)",
                    "oklch(0.65 0.241 354.308)",
                    "oklch(0.77 0.152 181.912)"
                ],
                "dark": [
                    "oklch(0.2533 0.016 252.42)",
                    "oklch(0.97807 0.029 256.847)",
                    "oklch(0.58 0.233 277.117)",
                    "oklch(0.65 0.241 354.308)",
                    "oklch(0.77 0.152 181.912)"
                ],
                "cupcake": [
                    "oklch(0.97788 0.004 56.375)",
                    "oklch(0.23574 0.066 313.189)",
                    "oklch(0.85 0.138 181.071)",
                    "oklch(0.89 0.061 343.231)",
                    "oklch(0.9 0.076 70.697)"
                ],
                "bumblebee": [
                    "oklch(1 0 0)",
                    "oklch(0.2 0 0)",
                    "oklch(0.85 0.199 91.936)",
                    "oklch(0.75 0.183 55.934)",
                    "oklch(0 0 0)"
                ],
                "emerald": [
                    "oklch(1 0 0)",
                    "oklch(0.35519 0.032 262.988)",
                    "oklch(0.76662 0.135 153.45)",
                    "oklch(0.61302 0.202 261.294)",
                    "oklch(0.72772 0.149 33.2)"
                ],
                "corporate": [
                    "oklch(1 0 0)",
                    "oklch(0.22389 0.031 278.072)",
                    "oklch(0.58 0.158 241.966)",
                    "oklch(0.55 0.046 257.417)",
                    "oklch(0.6 0.118 184.704)"
                ],
                "synthwave": [
                    "oklch(0.15 0.09 281.288)",
                    "oklch(0.78 0.115 274.713)",
                    "oklch(0.71 0.202 349.761)",
                    "oklch(0.82 0.111 230.318)",
                    "oklch(0.75 0.183 55.934)"
                ],
                "retro": [
                    "oklch(0.91637 0.034 90.515)",
                    "oklch(0.41 0.112 45.904)",
                    "oklch(0.8 0.114 19.571)",
                    "oklch(0.92 0.084 155.995)",
                    "oklch(0.68 0.162 75.834)"
                ],
                "cyberpunk": [
                    "oklch(0.9451 0.179 104.32)",
                    "oklch(0 0 0)",
                    "oklch(0.7422 0.209 6.35)",
                    "oklch(0.8333 0.184 204.72)",
                    "oklch(0.7186 0.217 310.43)"
                ],
                "valentine": [
                    "oklch(0.97 0.014 343.198)",
                    "oklch(0.52 0.223 3.958)",
                    "oklch(0.65 0.241 354.308)",
                    "oklch(0.62 0.265 303.9)",
                    "oklch(0.82 0.111 230.318)"
                ],
                "halloween": [
                    "oklch(0.21 0.006 56.043)",
                    "oklch(0.84955 0 0)",
                    "oklch(0.7748 0.204 60.62)",
                    "oklch(0.4598 0.248 305.03)",
                    "oklch(0.648 0.223 136.073)"
                ],
                "garden": [
                    "oklch(0.92951 0.002 17.197)",
                    "oklch(0.16961 0.001 17.32)",
                    "oklch(0.6245 0.278 3.836)",
                    "oklch(0.48495 0.11 355.095)",
                    "oklch(0.56273 0.054 154.39)"
                ],
                "forest": [
                    "oklch(0.2084 0.008 17.911)",
                    "oklch(0.83768 0.001 17.911)",
                    "oklch(0.68628 0.185 148.958)",
                    "oklch(0.69776 0.135 168.327)",
                    "oklch(0.70628 0.119 185.713)"
                ],
                "aqua": [
                    "oklch(0.37 0.146 265.522)",
                    "oklch(0.9 0.058 230.902)",
                    "oklch(0.85661 0.144 198.645)",
                    "oklch(0.60682 0.108 309.782)",
                    "oklch(0.93426 0.102 94.555)"
                ],
                "lofi": [
                    "oklch(1 0 0)",
                    "oklch(0 0 0)",
                    "oklch(0.15906 0 0)",
                    "oklch(0.21455 0.001 17.278)",
                    "oklch(0.26861 0 0)"
                ],
                "pastel": [
                    "oklch(1 0 0)",
                    "oklch(0.2 0 0)",
                    "oklch(0.9 0.063 306.703)",
                    "oklch(0.89 0.058 10.001)",
                    "oklch(0.9 0.093 164.15)"
                ],
                "fantasy": [
                    "oklch(1 0 0)",
                    "oklch(0.27807 0.029 256.847)",
                    "oklch(0.3745 0.189 325.02)",
                    "oklch(0.5392 0.162 241.36)",
                    "oklch(0.7598 0.204 56.72)"
                ],
                "wireframe": [
                    "oklch(1 0 0)",
                    "oklch(0.2 0 0)",
                    "oklch(0.87 0 0)",
                    "oklch(0.87 0 0)",
                    "oklch(0.87 0 0)"
                ],
                "black": [
                    "oklch(0 0 0)",
                    "oklch(0.87609 0 0)",
                    "oklch(0.35 0 0)",
                    "oklch(0.35 0 0)",
                    "oklch(0.35 0 0)"
                ],
                "luxury": [
                    "oklch(0.14076 0.004 285.822)",
                    "oklch(0.75687 0.123 76.89)",
                    "oklch(1 0 0)",
                    "oklch(0.27581 0.064 261.069)",
                    "oklch(0.36674 0.051 338.825)"
                ],
                "dracula": [
                    "oklch(0.28822 0.022 277.508)",
                    "oklch(0.97747 0.007 106.545)",
                    "oklch(0.75461 0.183 346.812)",
                    "oklch(0.74202 0.148 301.883)",
                    "oklch(0.83392 0.124 66.558)"
                ],
                "cmyk": [
                    "oklch(1 0 0)",
                    "oklch(0.2 0 0)",
                    "oklch(0.71772 0.133 239.443)",
                    "oklch(0.64476 0.202 359.339)",
                    "oklch(0.94228 0.189 105.306)"
                ],
                "autumn": [
                    "oklch(0.95814 0 0)",
                    "oklch(0.19162 0 0)",
                    "oklch(0.40723 0.161 17.53)",
                    "oklch(0.61676 0.169 23.865)",
                    "oklch(0.73425 0.094 60.729)"
                ],
                "business": [
                    "oklch(0.24353 0 0)",
                    "oklch(0.8487 0 0)",
                    "oklch(0.41703 0.099 251.473)",
                    "oklch(0.64092 0.027 229.389)",
                    "oklch(0.67271 0.167 35.791)"
                ],
                "acid": [
                    "oklch(0.98 0 0)",
                    "oklch(0 0 0)",
                    "oklch(0.719 0.357 330.759)",
                    "oklch(0.7337 0.224 48.25)",
                    "oklch(0.9278 0.264 122.962)"
                ],
                "lemonade": [
                    "oklch(0.9871 0.02 123.72)",
                    "oklch(0.19742 0.004 123.72)",
                    "oklch(0.5892 0.199 134.6)",
                    "oklch(0.7775 0.196 111.09)",
                    "oklch(0.8539 0.201 100.73)"
                ],
                "night": [
                    "oklch(0.20768 0.039 265.754)",
                    "oklch(0.84153 0.007 265.754)",
                    "oklch(0.75351 0.138 232.661)",
                    "oklch(0.68011 0.158 276.934)",
                    "oklch(0.7236 0.176 350.048)"
                ],
                "coffee": [
                    "oklch(0.24 0.023 329.708)",
                    "oklch(0.72354 0.092 79.129)",
                    "oklch(0.71996 0.123 62.756)",
                    "oklch(0.34465 0.029 199.194)",
                    "oklch(0.42621 0.074 224.389)"
                ],
                "winter": [
                    "oklch(1 0 0)",
                    "oklch(0.41886 0.053 255.824)",
                    "oklch(0.5686 0.255 257.57)",
                    "oklch(0.42551 0.161 282.339)",
                    "oklch(0.59939 0.191 335.171)"
                ],
                "dim": [
                    "oklch(0.30857 0.023 264.149)",
                    "oklch(0.82901 0.031 222.959)",
                    "oklch(0.86133 0.141 139.549)",
                    "oklch(0.73375 0.165 35.353)",
                    "oklch(0.74229 0.133 311.379)"
                ],
                "nord": [
                    "oklch(0.95127 0.007 260.731)",
                    "oklch(0.32437 0.022 264.182)",
                    "oklch(0.59435 0.077 254.027)",
                    "oklch(0.69651 0.059 248.687)",
                    "oklch(0.77464 0.062 217.469)"
                ],
                "sunset": [
                    "oklch(0.22 0.019 237.69)",
                    "oklch(0.77383 0.043 245.096)",
                    "oklch(0.74703 0.158 39.947)",
                    "oklch(0.72537 0.177 2.72)",
                    "oklch(0.71294 0.166 299.844)"
                ],
                "caramellatte": [
                    "oklch(0.98 0.016 73.684)",
                    "oklch(0.4 0.123 38.172)",
                    "oklch(0 0 0)",
                    "oklch(0.2245 0.075 37.85)",
                    "oklch(0.4644 0.111 37.85)"
                ],
                "abyss": [
                    "oklch(0.2 0.08 209)",
                    "oklch(0.9 0.076 70.697)",
                    "oklch(0.92 0.2653 125)",
                    "oklch(0.8327 0.0764 298.3)",
                    "oklch(0.43 0 0)"
                ],
                "silk": [
                    "oklch(0.14 0 0)",
                    "oklch(0.97 0 0)",
                    "oklch(0.84 0.238 128.85)",
                    "oklch(0.74 0.238 322.16)",
                    "oklch(0.85 0.199 91.936)"
                ]
            }
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

        // Nova função para setar tema baseado na seleção do dropdown
        async setTheme(theme) {
            localStorage.setItem('theme', theme);
            this.themeChecked = true;
            this.MyTheme = theme;
            // Adiciona o prefixo 'theme-' a cada tema
            const themeClasses = Object.keys(this.themes).map(theme => `theme-${theme}`);
            // Remove todas as classes de tema do body
            themeClasses.forEach(themeClass => document.body.classList.remove(themeClass));
            // Adiciona a classe de tema escolhido ao body
            document.body.classList.add(`theme-${theme}`);

            this.change(this.themeChecked);

            (this.$refs.themecontroller).value = theme;

        },
        // Função para extrair a cor base do :root ou [data-theme]
        getBaseColor() {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            document.body.appendChild(el);
            el.setAttribute('data-theme', '');
            el.style.color = 'var(--fallback-bc, oklch(var(--bc) / 1))';
            const computedStyle = window.getComputedStyle(el);
            const color = computedStyle.color;
            document.body.removeChild(el);
            return this.parseRgbColor(color);
        },

        // Função auxiliar para converter cores no formato "rgb(r, g, b)" ou "rgba(r, g, b, a)" para um array [r, g, b]
        parseRgbColor(oklchString) {
            // Extrair os valores L, C e h da string usando regex
            const match = oklchString.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
            if (!match) {
                throw new Error("Formato inválido de oklch. Use oklch(L C h).");
            }

            const [_, L, C, h] = match.map(Number);

            // Passo 1: Converter oklch para oklab
            const toRad = (deg) => (deg * Math.PI) / 180;
            const a = C * Math.cos(toRad(h));
            const b = C * Math.sin(toRad(h));

            // Passo 2: Converter oklab para linear RGB
            const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
            const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
            const s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;

            const r_ = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
            const g_ = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
            const b_ = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

            // Passo 3: Aplicar a transformação gama para obter sRGB
            const gammaCorrect = (c) => {
                if (c <= 0.0031308) return 12.92 * c;
                return 1.055 * c ** (1 / 2.4) - 0.055;
            };

            const r = Math.round(255 * gammaCorrect(r_));
            const g = Math.round(255 * gammaCorrect(g_));
            const b1 = Math.round(255 * gammaCorrect(b_));

            return `rgb(${r},${g},${b1})`;
        },
        async change(isChecked) {
            this.MyTheme = localStorage.getItem('theme');
            this.themeChecked = true;

            setTimeout(() => {
                this.fillESTOR = this.getBaseColor();
                this.$emit('theme-updated', { fillG: this.fillG, fillESTOR: this.fillESTOR });
            }, 50);
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
            router.push({ name: 'login' });
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