<template>

	<section class="catalog-cities-section"><!-- CATALOG CITIES SECTION -->

		<div class="col-lg-7 mr-auto ml-auto">

		<div class="card" v-click-outside="hideDropdown"><!-- card -->
			<div class="catalog-cities-section__block">
				<div class="input-group animated fadeIn">
					<input class="form-control" v-on:input="(search == '') ? dropdown = true : ''" v-on:focus="(search == '') ? dropdown = true : ''" v-model="search" type="text"
					       autocomplete="nope" :placeholder="placeholderText">
					<input type="hidden" name="region" :value="regionId">
					<input type="hidden" name="city" :value="cityId">
				</div>
			</div>

			<div v-if="dropdown" class="catalog-cities-section__dropdown animated fadeIn">

				<div class="catalog-cities-section__dropdown-inner">

					<ul class="list-unstyled accordion" id="menu-accordion"><!-- LIST -->

						<li class="list-collapse animated fadeIn" v-for="(item,index) in filteredList">
							<!-- list item -->
							<div class="list-link d-flex justify-content-start"
							     v-bind:class="{collapsed : (filteredList.length > 1) && index !== 0}"
							     :id="'heading-' + item.id" 
							     data-toggle="collapse" 
							     :data-target="'#sub-menu-' + item.id"
							     v-bind:aria-expanded="(filteredList.length == 1 && index == 0) ? true : false"
							     :aria-controls="'sub-menu-' + item.id">

								<label class="form-check-label radio" :for="'region-' + item.id">
									<input class="form-check-input hidden" 
										   :value="{id: item.id,title: item.title}"
									       v-model="location" @change="getRegionInfo" 
									       type="radio" :name="item.id"
									       :id="'region-' + item.id">
									<span class="label"></span>{{ item.title }}
								</label>

							</div>

							<div class="catalog-cities-section__cities collapse"
							     v-bind:class="{show: (filteredList.length == 1) && index == 0}"
							     :id="'sub-menu-' + item.id" 
							     :aria-labelledby="'heading-' + item.id"
							     data-parent="#menu-accordion">
								<ul class="list-unstyled animated fadeIn">
									<li v-for="city in item.cities.data" 
										v-if="search.substring(1,4).trim().toLowerCase().indexOf(city.title.substring(1,4).trim().toLowerCase()) > -1">
										<div class="d-flex justify-content-start">

											<label class="form-check-label radio" 
											       :for="'city-'+ city.id">
												<input class="form-check-input hidden"
												       :value="{id: city.id, title: city.title}" 
												       v-model="location"
												       @change="getCityInfo" type="radio" :name="city.id"
												       :id="'city-' + city.id">
												<span class="label"></span>{{ city.title }}
											</label>

										</div>
									</li>
								</ul>
							</div>

						</li><!-- list item -->


					</ul><!-- LIST -->


				</div>

			</div>
		</div><!-- card -->

	 </div>

	</section><!-- CATALOG CITIES SECTION -->
</template>

<script>

	import ClickOutside from 'vue-click-outside';
	import axios from 'axios';

	
	export default {
		mounted() {
			var that = this;

			var html = document.documentElement;
			var lang = html.getAttribute('lang');
			(lang == 'ru') 
			  ? this.placeholderText = 'Все города' 
			  : this.placeholderText = 'All cities';

			axios({
				method: 'get',
				url: '/regions.json'
			})
				.then(function (response) {
					that.data = response.data.data;
				});
		},
		data() {
			return {
				dropdown: false,
				location: [],
				search: '',
				regionId: '',
				cityId: '',
				data: [],
				placeholderText: ''
			}
		},
		methods: {
			getRegionInfo() {
				this.cityId = '';
				this.search = this.location.title;
				this.regionId = this.location.id;
				this.dropdown = false;
			},
			getCityInfo() {
				this.regionId = '';
				this.search = this.location.title;
				this.cityId = this.location.id;
				this.dropdown = false;
			},
			hideDropdown() {
				this.dropdown = false
			}

		},
		computed: {
			filteredList() {
				return this.data.filter(item => {
					return item.cities.data.some(city => {

						if (city.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 
							|| (item.title.trim().toLowerCase() == 'московская область' && this.search.charAt(2).trim().toLowerCase().indexOf('москва'.charAt(2)) > -1)
							|| (item.title.trim().toLowerCase() == 'moscow region' && this.search.charAt(2).trim().toLowerCase().indexOf('moscow'.charAt(2)) > -1)) {
							return item;
						}
					});
				});
			},
			checkedRegionsList() {
				return this.checkedRegions;
			},
			checkedCitiesList() {
				return this.checkedCities;
			}
		},
		directives: {
			ClickOutside
		}
	}
</script>

<style lang="scss" scoped>
	.catalog-cities-section {
		margin-top: 100px;
		.card {
			width: 100%;
			border-radius: 8px 8px 0 0;
			border: none;
			padding: 0;
			background-color: transparent;
		}
		.input-group {
			position: relative;
		}
		.form-control {
			border-left: none !important;
			border: 1px solid #b3b3b3;
			padding: 0 32px 0 25px;
			height: 50px;
			border-radius: 25px !important;
			font-family: opensanssemibold;
			&:focus, &:active {
				border: 1px solid #b3b3b3 !important;
				border-left: none !important;
				box-shadow: none !important;
				outline: none !important;
			}
		}
	}
	.catalog-cities-section__block {
		color: #000;
		padding: 0;
		z-index: 300;
	}
	.catalog-cities-section__dropdown {
		position: absolute;
		top: 30px;
		left: 0;
		background: #ffffff;
		width: 100%;
		padding: 15px 20px;
		border: 1px solid #ddd;
		min-height: 300px;
		overflow-y: auto;
		box-shadow: -0.5px 0.5px 20px rgba(9, 9, 9, 0.5);
		z-index: 200;
	}
	.catalog-cities-section__dropdown-inner {
		display: -webkit-box;
		display: -moz-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 0px;
		height: 230px;
		.accordion {
			display: block;
			margin-top: 20px;
			overflow-y: scroll;
			height: 100%;
			&::-webkit-scrollbar {
				width: 8px;
			}
			&::-webkit-scrollbar-track {
				background: #fff;
				width: 8px;
			}
			&::-webkit-scrollbar-thumb {
				background: #ccc;
				width: 8px;
			}
		}
		ul {
			width: 100%;
			padding-left: 0 !important;
			margin-left: 0 !important;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			li {
				padding-left: 0 !important;
				margin-left: 0 !important;
				padding: 8px 0 0 0;
				width: 100%;
				font-family: opensans;
				&.list-collapse {
					& > .list-link {
						display: flex;
						justify-content: flex-start;

						span {
							align-self: flex-start;
						}

						&[aria-expanded="true"] {
							text-decoration: none;

							&::before {
								background: url('~@/assets/location-select/arrow-gray-down.png') no-repeat center center;
								background-size: auto auto;
								width: 11px;
								height: 11px;
							}
						}

						&::before {
							content: "";
							float: left;
							margin-right: 5px;
							background: url('~@/assets/location-select/arrow-gray-right.png') no-repeat center center;
							background-size: auto auto;
							width: 11px;
							height: 11px;
							margin-top: 7px;
						}
					}

					ul {
						li {
							width: 100%;
						}
					}
				}
			}

		}
	}

	.catalog-cities-section__cities {
		.radio {
			.label {
				margin-left: 50px;
			}
		}
	}

	$primary: #333485;
	$gray: #C8CCD4;
	.radio {
		position: relative;
		cursor: pointer;
		line-height: 20px;
		color: #000;
		margin: 5px 0 5px 0;

		.label {
			position: relative;
			display: block;
			float: left;
			margin-right: 10px;
			margin-left: 5px;
			width: 20px;
			height: 20px;
			border: 2px solid $gray;
			border-radius: 100%;
			-webkit-tap-highlight-color: transparent;

			&:after {
				content: '';
				position: absolute;
				top: 3px;
				left: 3px;
				width: 10px;
				height: 10px;
				border-radius: 100%;
				background: $primary;
				transform: scale(0);
				transition: all .2s ease;
				opacity: .08;
				pointer-events: none;
			}

			&:hover {
				.label:after {
					transform: scale(3.6);
				}
			}
		}
	}

	input[type="radio"]:checked + .label {
		border-color: $primary;

		&:after {
			transform: scale(1);
			transition: all .2s cubic-bezier(.35, .9, .4, .9);
			opacity: 1;
		}
	}

	.hidden {
		display: none;
	}

	@media (max-width: 576px) {
		.catalog-cities-section__cities {
			.radio {
				.label {
					margin-left: 22px;
				}
			}
		}
		.catalog-cities-section__dropdown {
			padding: 15px 10px;
		}
	}

	/*media queries*/

</style>
