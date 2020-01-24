<template>
  <div>
     <location-cities></location-cities>
     <catalog-cities></catalog-cities>
     <balance></balance>
  </div>
</template>

<script>
import LocationCities from './components/LocationCities.vue'
import CatalogCities from './components/CatalogCities.vue'
import Balance from './components/Balance.vue'

export default {
  name: 'app',
  data() {
    return {
    }
  },
  components: {
    locationCities: LocationCities,
    catalogCities: CatalogCities,
    balance: Balance
  }
}
</script>

<style lang="scss">
 @import '../node_modules/bootstrap/scss/bootstrap.scss';
</style>
