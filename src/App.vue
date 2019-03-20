<template>
  <div id="app">
    <mall-header></mall-header>
    <mall-bread></mall-bread>
    <router-view></router-view>
    <mall-footer></mall-footer>
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
