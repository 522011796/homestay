<template>
  <div style="height:65px;line-height:65px;background: #3ab573">
    <div style="float: left;height:100%;position: relative">
      <img src="../assets/img/logo-in.png" style="height:55px;margin-top:5px;margin-left:35px;" alt="">
    </div>
    <div style="float: left;">
      <span class="head-username">{{headUsername}}</span>
    </div>
    <div style="float: left;height:100%;width: 70%">
      <div style="text-align: center;">
        <router-link to="/" class="head-menu" :class="{'head-active':active=='home'}" @click.native="activeMenu($event,'home')">
          实时房态
          <i class="fa fa-caret-up fa-1x head-menu-icon" :class="{hidden:active!='home'}"></i>
        </router-link>
        <router-link to="/layout/allOrderManage" class="head-menu" :class="{'head-active':active=='orderService'}" @click.native="activeMenu($event,'orderService')">
          订单管理
          <i class="fa fa-caret-up fa-1x head-menu-icon" :class="{hidden: active != 'orderService'}"></i>
        </router-link>
        <router-link to="/layout/roomManage" class="head-menu" :class="{'head-active':active=='systemService'}" @click.native="activeMenu($event,'systemService')">
          系统维护
          <i class="fa fa-caret-up fa-1x head-menu-icon" :class="{hidden: active != 'systemService'}"></i>
        </router-link>
      </div>
    </div>
    <div style="width:10%;float: left;height:100%;text-align: right">
      <Dropdown trigger="click" style="height:45px;line-height:45px;">
        <a href="javascript:void(0)" style="color:#ffffff;">
          {{manageText}}
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem>
            <a href="http://reg.9451.com/findpas.php">找回密码</a>
          </DropdownItem>
          <DropdownItem @click.native="logout">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div style="clear: both"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapState,mapMutations } from 'vuex'
  export default {
    name: 'home',
    computed: {
      ...mapGetters(['getLeftFirstMenu'])
    },
    data () {
      return {
        msg: '111',
        active:'home',
        manageText:'test',
        headUsername:''
      }
    },
    created(){
      this.getSession();
    },
    methods:{
      ...mapMutations(['setLeftFirstMenu']),
      activeMenu(event,name){
        this.active = name;
        this.setLeftFirstMenu(name);
        localStorage.setItem('topMenu',name);
        localStorage.removeItem('leftMenu');
      },
      logout(){
        this.$api.get("/proxy/cas/logout", {} ,res => {
          localStorage.removeItem('topMenu');
          localStorage.removeItem('leftMenu');
          window.location = "#/login";
        });
      },
      getSession(){
        this.$api.get("/proxy/home/logininfo?loginInfo=username,name,franchiseeId,defaultOutTime", {} ,res => {
          this.manageText = res.data.loginInfo.username;
          this.headUsername = res.data.loginInfo.name
        });
      }
    },
    mounted(){
      this.active = localStorage.getItem('topMenu') ? localStorage.getItem('topMenu') : 'home';
      this.setLeftFirstMenu(localStorage.getItem('topMenu'));
    }
  }
</script>
