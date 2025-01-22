<template>
    
        <DataTableGestor 
        :endPoint="'/api/v1/usuario'" 
        :novoItem="novoUsuario" 
        :availableKeys="availableKeys" 
        :limit="20"
        :offset="0"
        crud="router"
        crud_endpoint="/cadastro/usuarios" />
</template>

<script>
import DataTableGestor from '@/components/DataTableGestor.vue';

export default {
    components: {
        DataTableGestor
    },
    data() {
        return {
            
            novoUsuario: {
               
               grupo_imagem: {
                   type: 'grade',
                   content: [
                   {
                           class: "col-3",
                           dados: {
                               id: { type: 'text', caption: '#', disabled: true },
                           }
                       },
                       {
                           class: "col-3",
                           dados: {
                               avatar: { type: 'imagens', caption: 'Avatar', disabled: true },
                           }
                       },
                       {
                           class: "col-3",
                           dados: {
                               nome: { type: 'text', caption: 'Nome', disabled: false },
                           }
                       },
                       {
                           class: "col-3",
                           dados: {
                               email: { type: 'text', caption: 'E-mail', disabled: false },
                           }
                       },
                       {
                           class: "col-3",
                           dados: {
                               usuario: { type: 'text', caption: 'Usuário', disabled: false }
                           }
                       },
                       {
                           class: "col-3",
                           dados: {
                            tipo_permissao: { type: 'text', caption: 'Permissão', disabled: false }
                           }
                       }
                   ]
               },
           },
           availableKeys: [ 'id', 'avatar', 'nome', 'email', 'tipo_permissao' ],
        };
    }
};
</script>