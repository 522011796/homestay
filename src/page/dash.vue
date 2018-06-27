<template>
  <div>
    <Head></Head>
    <div style="padding:0px 35px 0px 35px;background: #3ab573">
      <div>
        <router-view></router-view>
      </div>
    </div>
    <Footer style="background: #3ab573;height:35px;line-height:35px;"></Footer>
  </div>
</template>

<script>
  import Menu from './../components/menu'
  import Head from './../components/head'
  import Footer from './../components/footer'
  export default {
    name: 'dash',
    components: { Menu,Head,Footer }
  }
</script>
<style>

</style>
