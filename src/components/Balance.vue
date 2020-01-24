<template>
	<section class="balance-section">
		<div>
			<h3 class="animated fadeIn">Баланс: {{ balanceTitle }} {{ balance_lang }}</h3>
		</div>
		<div v-if="!balanceInput">
			<button class="btn btn-default animated fadeIn" @click="showBalanceInput">Пополнить баланс</button>
		</div>
		<div v-if="balanceInput">
			<div class="form-group animated fadeIn">
				<div>
					<input type="number" name="total_sum" class="form-control" @input="changeBalance" v-model="balance"
					       min="" max="">
				</div>
				<div>
					<button type="submit" class="btn btn-default" @click="hideBalanceInput">Выставить счет</button>
				</div>
			</div>
			<div class="alert alert-warning animated fadeIn" v-if="fill">Введите сумму</div>
		</div>
	</section>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				balanceTitle: 0,
				balanceInput: false,
				balance: '',
				fill: false,
				balance_count: 0,
				balance_lang: '$'
			}
		},
		created() {

		},
		mounted() {
			this.balanceTitle = this.balance_count;
		},
		methods: {
			changeBalance(e) {
				this.balanceTitle = e.target.value.replace(/[^0-9]+/g, '');
				if (this.balanceTitle !== 0) {
					this.fill = false;
				}
			},
			showBalanceInput() {
				this.balanceInput = true;
				this.balanceTitle = this.balance_count;
			
			},
			hideBalanceInput() {

				if (this.balance !== '') {
					this.balanceTitle = parseInt(this.balance);
					this.balance_count = this.balanceTitle
					this.balanceInput = false;

				} else {
					this.fill = true;
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.balance-section {
		margin-top: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		h3 {
		   font-family: opensanssemibold;
		}
		.form-group {
			display: flex;
		}

		.form-control {
			border: 1px solid #c2c2c2;
			border-radius: 0 !important;
			font-family: opensans;
			&:focus {
				border: 1px solid #c2c2c2 !important;
				outline: none !important;
				box-shadow: none !important;
			}
		}

		.btn {
			background-color: #FEE756 !important;
			color: #000000 !important;
			border: 1px solid #FEE756 !important;
			border-radius: 0 !important;
			box-shadow: none !important;
			font-family: opensanssemibold;
			&:active, &:visited, &:focus {
				background-color: #FEE756 !important;
				color: #000000 !important;
				border: 1px solid #FEE756 !important;
				border-radius: 0 !important;
				box-shadow: none !important;
				outline: none !important;
			}
		}
	}

</style>
