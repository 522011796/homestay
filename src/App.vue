<template>
  <div>
    <!--<div style="background: #3ab573">
      <div style="margin:0 35px;">
        <router-view></router-view>
      </div>
    </div>-->
    <router-view></router-view>
  </div>
</template>

<script>
import Head from './components/head'
export default {
  name: 'App',
  components: { Head },
  data () {
    return {
      msg: ""
    }
  }
}
</script>

<style>

</style>
