<template>
  <div id="layui-body" style="background: #ffffff;border-radius: 5px" :style="styleMenuObject">
    <div style="float:left;width: 240px;" :style="styleMenuObject">
      <Menu></Menu>
    </div>
    <div style="margin-left:240px;border-left:1px solid #dddddd;" :style="styleMenuObject">
      <router-view></router-view>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  import Menu from './../../components/menu'
  export default {
    name: 'employeeManage',
    components: { Menu },
    data () {
      return {
        styleMenuObject: {
          height: '',
          'overflow-y':'auto',
        }
      }
    },
    created(){
      this.hh()
    },
    methods:{
      hh(){
        this.styleMenuObject.height = window.innerHeight-65-35+'px';
      },
      search(){
        console.log(111);
      }
    },
    mounted () {
      // 注：window.onresize只能在项目内触发1次
      var _self = this;
      window.onresize = function (){
        _self.hh();
      }
    }
  }
</script>
<style>

</style>
