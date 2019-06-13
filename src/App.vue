<template>
  <div id="app">
    <mall-header v-show="$route.path !== '/adminIndex/*'"></mall-header>
    <mall-bread v-show="$route.name !== '/adminIndex/*'"></mall-bread>
    <router-view></router-view>
    <mall-footer v-show="$route.name !== '/adminIndex/*'"></mall-footer>
  </div>
</template>

<script>
import mallHeader from 'components/header'
import mallBread from 'components/navbread'
import mallFooter from 'components/footer'

export default {
  name: 'app',
  components:{
    mallHeader,
    mallBread,
    mallFooter
  }
}
</script>

<style>
</style>
