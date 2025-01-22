<template>
	<div class="mb-3">
		<label :for="'form_' + Key" class="form-label d-block">{{ Field.caption }}</label>

		<template v-if="Field.type === 'select'">
			<select v-model="localTempItem" :disabled="Field.disabled" :id="'form_' + Key" class="form-select">
				<option v-for="option in Field.base_dados" :key="option.value" :value="option.value"
					:disabled="(valorTotal * 1) < (option.valor_minimo * 1)">
					{{ option.display }}
				</option>
			</select>
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>

		<template v-else-if="Field.type === 'textarea'">
			<textarea :disabled="Field.disabled" class="form-control" :id="'form_' + Key" v-model="localTempItem"
				rows="3" :aria-required="Field.required ? 'true' : 'false'" placeholder="Digite aqui..."></textarea>
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>

		<template v-else-if="Field.type === 'checkbox'">
			<input type="checkbox" :v-model="localTempItem" :disabled="Field.disabled" :id="'form_' + Key"
				class="form-check-input" :aria-required="Field.required ? 'true' : 'false'" />
			<label :for="'form_' + Key" class="form-check-label ms-2">{{ Field.caption }}</label>
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>

		<template v-else-if="Field.type === 'radio'">
			<div v-for="option in Field.base_dados" :key="option.value" class="form-check">
				<input type="radio" :value="option.value" v-model="localTempItem" :disabled="Field.disabled"
					:id="'form_' + Key + '_' + option.value" class="form-check-input" />
				<label :for="'form_' + Key + '_' + option.value" class="form-check-label ms-2">{{ option.display
					}}</label>
			</div>
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>

		<template v-else-if="Field.type === 'color'">
			<input type="color" v-model="localTempItem" :disabled="Field.disabled" :id="'form_' + Key"
				class="form-control form-control-color" :aria-required="Field.required ? 'true' : 'false'" />
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>


		<!-- Seletor customizado -->
		<template v-else-if="Field.type === 'seletorCustomizado'">
			<div class="mb-3">
				<div class="mb-2">
					<div class="row px-2" v-for="(linha, index) in localTempItem" :key="index">
						<div class="col-1">
							<i class='bx bxs-crown text-warning' v-if="linha.principal == 1"></i>
							<a href="#" @click="mudarPrincipal(index)"><i class='bx bx-crown'
									v-if="linha.principal !== 1"></i></a>
						</div>
						<div class="col-10">
							{{ linha.nome }}
						</div>
						<div class="col-1">
							<a href="#" @click="deletarVendedor(index)"
								v-if="linha.principal !== 1 && localTempItem.length > 1"><i
									class="bx bx-trash text-danger"></i></a>
						</div>
					</div>
				</div>


				<input type="text" class="form-control" v-model="buscaItem" @input="buscaEndPoint"
					placeholder="Buscar..." :disabled="Field.disabled" />

				<div v-if="base_dados.length > 0" class="dropdown-list">
					<div v-for="(bd, index) in base_dados" :key="index" @click="adicionarAoSeletor(bd)"
						class="dropdown-item list-group-item list-group-item-action">
						<strong>{{ bd.id }}</strong> {{ bd.nome }}
					</div>
				</div>
			</div>
		</template>

		<template v-else-if="Field.type !== 'datetime'">
			<input :type="Field.type" v-model="localTempItem" :id="'form_' + Key" :disabled="Field.disabled"
				class="form-control" :aria-required="Field.required ? 'true' : 'false'" placeholder="Digite aqui..." />
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>

		<template v-else>
			<input type="datetime-local" v-model="localTempItem" :disabled="Field.disabled" :id="'form_' + Key"
				class="form-control" :aria-required="Field.required ? 'true' : 'false'" />
			<div v-if="Field.required && !localTempItem" class="text-danger">Este campo é obrigatório.</div>
		</template>
	</div>




</template>

<script>
import axios from 'axios';
import _ from "lodash";
export default {
	props: {
		tempItem: Object,
		Field: Object,
		Key: String,
		valorTotal: { type: Number, default: 0 },
		EndPoint: { type: String, default: '' }
	},
	computed: {
		localTempItem: {
			get() {
				return this.tempItem[this.Key];
			},
			set(value) {
				this.$emit('update:tempItem', { ...this.tempItem, [this.Key]: value });
			}
		}
	},
	data() {
		return {
			base_dados: [],
			buscaItem: ''
		};
	},
	methods: {
		buscaEndPoint: _.debounce(function () {
			axios.get(this.Field.EndPoint, { params: { busca: this.buscaItem } }).then((response) => {
				this.base_dados = response.data.data.map((item) => {
					return { id: item.id, nome: item.nome, email: item.email, telefone: item.telefone, principal: 0 };
				});
				console.log(this.base_dados);
			});
		}, 300),
		adicionarAoSeletor(item) {
			console.log(this.localTempItem, item);
			this.localTempItem = [...this.localTempItem, item];
			this.buscaItem = '';
			this.base_dados = [];
		},
		deletarVendedor(index) {
			this.localTempItem.splice(index, 1);
		},
		mudarPrincipal(index) {
			this.localTempItem.forEach((item, i) => {
				if (i === index) {
					item.principal = 1;
				} else {
					item.principal = 0;
				}
			});
		}
	}
}
</script>

<style scoped>
.text-danger {
	color: #dc3545;
}

.dropdown-list {
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
	background-color: white;
	position: absolute;
	z-index: 1000;
	max-height: 200px;
	overflow-y: auto;
}

.dropdown-item {
	padding: 0.5rem 1rem;
	cursor: pointer;
}

.dropdown-item:hover {
	background-color: #f8f9fa;
}
</style>
