<template>
    <DataTable class="table" :value="dados" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
        <Column field="CODIGO" style="width: 100px; min-width: 100px" sortable header="Cód."></Column>
        <Column field="CLIENTE" sortable header="Cliente">
            <template #body="{ data }">
                <div class="flex items-center gap-3">
                    <div class="avatar placeholder">
                        <div class="bg-neutral text-neutral-content rounded-full w-9">
                            <span class="text-xs">{{ formatAvatarCliente((data).CLIENTE) }}</span>
                        </div>
                    </div>
                    <div>
                        <div class="font-bold">{{ (data).CLIENTE }}</div>
                        <div class="text-sm opacity-50">
                            <div class="badge badge-primary">{{ (data).CODCLIENTE }}</div>
                            {{ (data).EMPRESA }}
                        </div>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="TOTAL" style="width: 100px; min-width: 100px" sortable header="Total">
            <template #body="{ data }">
                <div>
                    <div class="font-bold">{{ formatMoeda((data).TOTAL) }}</div>
                </div>
            </template>
        </Column>
        <Column field="NAOSEPARADO" style="width: 100px; min-width: 100px" sortable header="Ñ.Sep"></Column>
        <Column field="SEPARADO" style="width: 100px; min-width: 100px" sortable header="Sep."></Column>
        <Column field="FALTAS" style="width: 100px; min-width: 100px" sortable header="Fal."></Column>
        <Column field="CADASTRO" style="width: 120px; min-width: 100px" sortable header="Cad.">
            <template #body="{ data }">
                <div>
                    <div class="font-bold">{{ formatData((data).CADASTRO) }}</div>
                </div>
            </template>
        </Column>
    </DataTable>
</template>
<script>
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import moment from 'moment';


    export default {
        components: {
            DataTable,
            Column
        },
        props: {
            dados: []
        },
        methods: {
            formatAvatarCliente(cliente) {
                let avatarSplit = cliente.split(" ");
                if (avatarSplit.length > 1) {
                    return (avatarSplit[0].substring(0,1) + avatarSplit[1].substring(0,1));
                }
                return cliente.replace(".", "").replace(" ", "").substring(0, 2);
            },
            numFormatter(num) {
                if (num > 999 && num < 1000000) {
                    return (num / 1000).toFixed(1).replace(".", ",") + "K";
                } else if (num > 1000000) {
                    return (num / 1000000).toFixed(1).replace(".", ",") + "M";
                } else if (num > 1000000000) {
                    return (num / 1000000000).toFixed(1).replace(".", ",") + "B";
                } else if (num > 1000000000000) {
                    return (num / 1000000000000).toFixed(1).replace(".", ",") + "T";
                } else if (num < 900) {
                    return num;
                }
            },
            formatMoeda(valor) {
                return parseFloat(valor).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                });
            },
            formatNumero(numero, qtd_decimais) {
                return parseFloat(numero).toLocaleString("pt-br", {
                    maximumSignificantDigits: qtd_decimais,
                });
            },
            formatData(date) {
                return moment(date).format("DD/MM/YYYY");
            },
        },
    };
</script>