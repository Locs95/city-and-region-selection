<template>
 <section class="location-cities-section"><!-- LOCATION SELECT SECTION -->
   
     <div class="col-lg-7 mr-auto ml-auto">

      <div class="card" v-click-outside="hideDropdown"><!-- card -->
        <div class="location-cities-section__block d-flex justify-content-lg-start justify-content-md-start justify-content-center align-items-center">
          <div class="location-cities-section__location-icon"></div>
          <div class="location-cities-section__location-city"
               v-bind:class="{'location-cities-section__location-city_black': dropdown == true}">
            <a href="#" v-on:click="dropdown = true">{{ selectedResult }}</a>
            <input type="hidden" name="region" :value="locRegionId">
            <input type="hidden" name="city" :value="locCityId">
          </div>
        </div>

        <div v-if="dropdown" class="location-cities-section__dropdown">

          <div class="location-cities-section__dropdown-inner">

            <div class="input-group animated fadeIn">
              <div class="input-group-prepend">
              <span class="input-group-text"></span>
              </div>
              <input class="form-control" 
                     v-model="search" 
                     type="text" 
                     autocomplete="off"
                     placeholder="Найти город">
            </div>


            <ul class="list-unstyled accordion" id="menu-accordion"><!-- LIST -->

              <li class="list-collapse animated fadeIn" v-for="(item,index) in filteredList">
                <!-- list item -->
                <div class="list-link d-flex justify-content-start"
                     v-bind:class="{collapsed : (filteredList.length > 1) && index !== 0}"
                     id="heading-1" 
                     data-toggle="collapse" 
                     :data-target="'#sub-menu-' + item.id"
                     v-bind:aria-expanded="(filteredList.length == 1 && index == 0) ? true : false"
                     :aria-controls="'sub-menu-' + item.id">
                  <label class="form-check-label radio" 
                         :for="'location_region-' + item.id">
                    <input class="form-check-input hidden" 
                           :value="{id: item.id, title: item.title}"
                           v-model="location" @change="getLocRegionInfo" 
                           type="radio"
                           :name="item.id" :id="'location_region-' + item.id">
                    <span class="label"></span><span class="radio__title">{{ item.title }}</span>
                  </label>
                </div>

                <div class="location-cities-section__cities collapse"
                     v-bind:class="{show: (filteredList.length == 1) && index == 0}"
                     :id="'sub-menu-' + item.id" :aria-labelledby="'heading-' + item.id"
                     data-parent="#menu-accordion">
                  <ul class="list-unstyled animated fadeIn">
                    <li v-for="city in item.cities.data"  
                        v-if="search.substring(1,4).trim().toLowerCase().indexOf(city.title.substring(1,4).trim().toLowerCase()) > -1">
                      <div class="d-flex justify-content-start">
                        <label class="form-check-label radio" 
                               :for="'location_city-'+ city.id">
                          <input class="form-check-input hidden"
                                 :value="{id: city.id, title: city.title}" 
                                 v-model="location"
                                 @change="getLocCityInfo" type="radio" 
                                 :name="city.id"
                                 :id="'location_city-' + city.id">
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

  </section><!-- LOCATION SELECT SECTION -->
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
        ? this.selectedResult = 'Все города' 
        : this.selectedResult = 'All cities';

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
        selectedResult: '',
        location: [],
        search: '',
        locRegionId: '',
        locCityId: '',
        data: []
      }
    },
    methods: {
      getLocRegionInfo() {
        this.locCityId = '';
        this.selectedResult = this.location.title;
        this.locRegionId = this.location.id;
      },
      getLocCityInfo() {
        this.locRegionId = '';
        this.selectedResult = this.location.title;
        this.locCityId = this.location.id
      },
      hideDropdown() {
        this.dropdown = false
      }

    },
    computed: {

      filteredList() {
        return this.data.filter(item => {

          return item.cities.data.some(city => {

            if (city.title.trim().toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1
              || (item.title.trim().toLowerCase() == 'московская область' && this.search.charAt(2).trim().toLowerCase().indexOf('москва'.charAt(2)) > -1) 
              || (item.title.trim().toLowerCase() == 'moscow region' && this.search.charAt(2).trim().toLowerCase().indexOf('moscow'.charAt(2)) > -1)) {
              return item;
            }
          });

        });

      }

    },
    directives: {
      ClickOutside
    }
  }
</script>

<style lang="scss" scoped>
@font-face {
  font-family: opensans;
  src: url('~@/assets/fonts/opensans.ttf');
}
@font-face {
  font-family: opensanssemibold;
  src: url('~@/assets/fonts/opensanssemibold.ttf');
}
.location-cities-section {
  margin-top: 100px;
    .card {
      width: 100%;
      border-radius: 8px 8px 0 0;
      border: none;
      padding: 0;
      background-color: transparent;
    }
    .card_white {
      background-color: #fff;
      padding: 15px 15px 0 15px;
    }
    .input-group-prepend {
      z-index: 9999;
    }
    .input-group {
      position: relative;
    }
    .input-group-text {
      background-color: #fff;
      border-right: none !important;
      border: 2px solid #dddddd;
      border-radius: 0.60rem;
      width: 30px;
      background: url('~@/assets/location-select/zoom-icon.png') no-repeat center right;
      background-size: 20px 20px;
    }
    .form-control {
      border-left: none !important;
      border: 2px solid #dddddd;
      border-radius: 0 0.60rem 0.60rem 0 !important;
      z-index: 9999;

      &:focus, &:active {
        border: 2px solid #dddddd !important;
        border-left: none !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }
  }
  .location-cities-section__block {
    color: #000;
    padding: 0 0 0 30px;
    z-index: 600;
  }
  .location-cities-section__location-icon {
    background: url('~@/assets/location-select/location.png') no-repeat center center;
    background-size: 13px auto;
    width: 14px;
    height: 18px;
  }
  .location-cities-section__location-city {
    color: blue;
    margin-left: 8px;
    font-family: opensanssemibold;
    font-weight: 800;
    &>a {
      color: blue;
      font-weight: 800;
    }
  }
  .location-cities-section__location-city_black {
    color: #000 !important;
    font-weight: 800;
    &>a {
      color: #000 !important;
      font-weight: 800;
    }
  }
  .location-cities-section__dropdown {
    position: absolute;
    top: -15px;
    left: 0;
    background: #ffffff;
    width: 100%;
    padding: 15px 25px 30px 25px;
    border: 1px solid #ddd;
    min-height: 300px;
    border-radius: 8px;
    overflow-y: auto;
    z-index: 500;
  }
  .location-cities-section__dropdown-inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 45px;
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

  .location-cities-section__cities {
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

  .radio__title {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    text-align: left;
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

  /*media queries*/
  @media (max-width: 767px) {
    .location-cities-section__block {
      padding: 0;
    }
  }

  @media (max-width: 576px) {
    .location-cities-section__dropdown {
      padding: 15px 10px;
    }
    .location-cities-section__cities {
      .radio {
        font-size: 14px;

        .label {
          margin-left: 25px;
        }
      }
    }
    .radio__title {
      font-size: 14px;
    }
    .location-cities-section__location-city {
      font-size: 15px;
      margin-left: 5px;
      text-align: center;
    }
  }

  /*media queries*/
</style>
