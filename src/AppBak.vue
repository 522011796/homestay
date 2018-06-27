<template>
  <div>
    <div style="margin:0 35px;">
      <router-view>
        <Head></Head>
        <div class="footer" style="text-align:center;color:#ffffff;font-size:12px;">
          footer
        </div>
      </router-view>
    </div>
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
