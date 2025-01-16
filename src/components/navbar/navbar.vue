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
                <label tabindex="0" role="button" class="avatar p-1 btn btn-circle">
                    <i class="fill-current bx bx-user text-xl"></i>
                </label>
                <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li>
                        <a>
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
export default defineComponent({
    data() {
        return {
            fillG: 'rgb(255,157,0)',
            fillESTOR: 'rgb(0,0,0)',
            themeChecked: 'true',
        }
    },
    computed: {
        watchThemeController() {
            return (this.$refs.themecontroller).value;
        },
    },
    methods: {
        async themeChange() {
            const isChecked = (this.$refs.themecontrolle).checked;
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

            console.log(isChecked);

            this.$emit('theme-updated', { fillG: this.fillG, fillESTOR: this.fillESTOR });
        }
    },
    mounted() {
        const themeCheckedFromLocalStorage = localStorage.getItem('themecontroller');
        this.themeChecked = themeCheckedFromLocalStorage || 'false';
        this.change(this.themeChecked);
    }
});
</script>