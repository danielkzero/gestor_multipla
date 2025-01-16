<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content bg-base-200 p-4">
            <navbarGestor @theme-updated="handleThemeUpdate" class="mb-3" />             
            <router-view></router-view>
            <footerGestor />
        </div>

        <div class="drawer-side z-30">
            <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <menuLateral :fillG="fillG" :fillESTOR="fillESTOR"></menuLateral>
        </div>
    </div>
</template>
<script>
import footerGestor from '@/components/footer/footer.vue';
import navbarGestor from '@/components/navbar/navbar.vue';
import menuLateral from '@/components/menu/menu.vue';
export default {
    name: 'principal',
    components: { 
        footerGestor, 
        navbarGestor,
        menuLateral
    },
    data() { 
        return { 
            fillG: 'rgb(255,157,0)', 
            fillESTOR: 'rgb(0,0,0)',
            themeChecked: true,
        }
    },
    methods: {
        handleThemeUpdate(data) {
            this.fillG = data.fillG; 
            this.fillESTOR = data.fillESTOR;
        },
        findAllParentDetails(childElement, parentDetails = [])  {
            if (!childElement || !childElement.parentElement) return [];
            
            const parent = childElement.parentElement;
            
            if (parent.closest('details')) {
                parentDetails.push(parent);
                parent.setAttribute('open', 'open');
            }
            
            return this.findAllParentDetails(parent, parentDetails);
        }
    },
    mounted() {
        const themeCheckedFromLocalStorage = localStorage.getItem('themecontroller');
        this.themeChecked = themeCheckedFromLocalStorage == 'true' ? true : false;
        this.fillESTOR = (this.themeChecked == false ? 'rgb(0,0,0)' : 'rgb(159, 185, 197)');
        
        const childElement = this.$el.querySelector('#menu .active'); 
        this.findAllParentDetails(childElement);
    }
}
</script>