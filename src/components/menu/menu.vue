<template>
    <ul class="menu bg-base-100 min-h-full w-56" id="menu">
        <logoGestor :G="fillG" :ESTOR="fillESTOR" class="p-4" />
        <li v-for="(item, index) in filteredMenuItems" :key="index" class="menu045">
            <template v-if="item.children && item.children.length > 0">
                <details>
                    <summary>
                        <i :class="item.icon"></i>{{ item.label }}
                    </summary>
                    <ul>
                        <li v-for="(child, childIndex) in item.children" :key="childIndex">
                            <template v-if="child.children && child.children.length > 0">
                                <details>
                                    <summary>
                                        <i :class="child.icon"></i>{{ child.label }}
                                    </summary>
                                    <ul>
                                        <li v-for="(grandChild, grandChildIndex) in child.children"
                                            :key="grandChildIndex">
                                            <router-link :to="grandChild.path"
                                                :class="{ 'active': isActiveRoute(grandChild.path) }"
                                                :aria-current="isActiveRoute(grandChild.path) ? 'page' : null">
                                                {{ grandChild.label }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <router-link :to="child.path" :class="{ 'active': isActiveRoute(child.path) }"
                                    :aria-current="isActiveRoute(child.path) ? 'page' : null">
                                    {{ child.label }}
                                </router-link>
                            </template>
                        </li>
                    </ul>
                </details>
            </template>
            <template v-else>
                <router-link :to="item.path" :class="{ 'active': isActiveRoute(item.path) }"
                    :aria-current="isActiveRoute(item.path) ? 'page' : null">
                    <i :class="item.icon"></i>{{ item.label }}
                </router-link>
            </template>
        </li>
        <a href="https://hydradigital.com.br" target="_blank" class="text-decoration-none mt-auto">
            <li>

                <div class="grid grid-cols-3">
                    <div class="col-span-1">
                        <img src="@/assets/logo-hydra.png" height="50" />
                    </div>
                    <div class="col-span-2 my-auto ms-2">
                        <strong>Hydra Digital</strong><br />
                        Daniel Ramos
                    </div>
                </div>

            </li>
        </a>
    </ul>
</template>

<script>
import logoGestor from '../logo/index.vue';

export default {
    components: { logoGestor },
    props: {
        fillG: String,
        fillESTOR: String,
        themeChecked: Boolean,
    },
    data() {
        return {
            menuItems: [
                { label: "Início", path: "/principal", icon: "bx bx-home", nivel: ["administrador", "comum"] },
                { label: "Usuarios", path: "/usuarios", icon: "bx bx-user", nivel: ["administrador"] },
            ],
            tipo_permissao: "comum",
        };
    },
    methods: {
        isActiveRoute(route) {
            return this.$route.path.startsWith(route);
        },
        hasPermission(item) {
            return item.nivel.includes(this.tipo_permissao);
        },
    },
    computed: {
        filteredMenuItems() {
            return this.menuItems.filter(this.hasPermission);
        },
    },
    mounted() {
        const json_profile = JSON.parse(localStorage.getItem("json_profile"));
        if (localStorage.getItem("json_profile")) {
            this.tipo_permissao = json_profile.tipo_permissao;
        }
    }
};
</script>
