<template>
  <div style="min-width: 1280px">
    <router-view></router-view>

    <Modal
      title="测试内容，如果你看到这个提示，表示浏览器版本验证生效(样式什么的请暂时忽略)"
      v-model="ieVersion"
      :closable="false"
      :mask-closable="false"  class="app-footer">

      <div class="text-center">
        <div>系统监测到浏览器为ie内核且版本偏低！</div>
        <div>推荐使用谷歌、火狐或者其他双核极速模式！</div>
        <div>如果你使用的是360、qq、搜狗等双核浏览器，请在顶部切换为极速模式访问！</div>
      </div>

      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import Head from './components/head'
export default {
  name: 'App',
  components: { Head },
  data () {
    return {
      msg: "",
      ieVersion:false
    }
  },
  created(){
    var getExplorer = (function() {//版本检测
      var explorer = window.navigator.userAgent,
        compare = function(s) { return (explorer.indexOf(s) >= 0); },
        ie11 = (function() { return ("ActiveXObject" in window) })();
      if (compare("MSIE") || ie11) { return 'ie'; }
      else if (compare("Firefox") && !ie11) { return 'Firefox'; }
      else if (compare("Chrome") && !ie11) { return 'Chrome'; }
      else if (compare("Opera") && !ie11) { return 'Opera'; }
      else if (compare("Safari") && !ie11) { return 'Safari'; }
    })()

    //注意：getExplorer返回结果是一个字符串，如判断是否为IE浏览器
    if (getExplorer == 'ie') {
      //alert('当前浏览器版本：IE');
      this.ieVersion = true;
    }
  }
}
</script>

<style>

</style>
