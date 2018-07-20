<template>
  <div class="menu-text">
    <div id="systemService" :class="{'hidden':getLeftFirstMenu!='systemService'}" style="padding:15px 35px;">
        <router-link to="/layout/roomManage" @click.native="activeSliderMenu('roomManage')">
          <div :class="{'menu-active-green':menu=='roomManage'}" style="height:35px;line-height:35px;text-align: center;border-radius: 5px">
          房间管理
          </div>
        </router-link>
        <router-link to="/layout/employeeManage" @click.native="activeSliderMenu('employeeManage')">
          <div :class="{'menu-active-green':menu=='employeeManage'}" style="height:35px;line-height:35px;text-align: center;border-radius: 5px;margin-top:10px;">
          人员管理
          </div>
        </router-link>
        <router-link to="/layout/basicManage" @click.native="activeSliderMenu('basicManage')">
          <div :class="{'menu-active-green':menu=='basicManage'}" style="height:35px;line-height:35px;text-align: center;border-radius: 5px;margin-top:10px;">
            基础信息
          </div>
        </router-link>
        <router-link to="/layout/logManage" @click.native="activeSliderMenu('logManage')">
          <div :class="{'menu-active-green':menu=='logManage'}" style="height:35px;line-height:35px;text-align: center;border-radius: 5px;margin-top:10px;">
            系统日志
          </div>
        </router-link>
    </div>

    <div id="orderService" :class="{'hidden':getLeftFirstMenu!='orderService'}" style="padding:15px 35px;">
      <router-link to="/layout/allOrderManage" @click.native="activeSliderMenu('allOrderManage')">
        <div :class="{'menu-active-green':menu=='allOrderManage'}" style="height:35px;line-height:35px;border-radius: 5px;text-align: center;">
          全部订单
        </div>
      </router-link>
      <router-link to="/layout/preInOrderManage" @click.native="activeSliderMenu('preInOrderManage')">
        <div :class="{'menu-active-green':menu=='preInOrderManage'}" style="height:35px;line-height:35px;border-radius: 5px;text-align: center;margin-top:10px;position: relative">
          今日预住
          <Badge :count="preInOrder" class-name="demo-badge-alone menu-badge text-green"></Badge>
        </div>
      </router-link>
      <router-link to="/layout/nowInOrderManage" @click.native="activeSliderMenu('nowInOrderManage')">
        <div :class="{'menu-active-green':menu=='nowInOrderManage'}" style="height:35px;line-height:35px;border-radius: 5px;text-align: center;margin-top:10px;position: relative">
          当前入住
          <Badge :count="nowInOrder" class-name="demo-badge-alone menu-badge text-green"></Badge>
        </div>
      </router-link>
      <router-link to="/layout/preOutOrderManage" @click.native="activeSliderMenu('preOutOrderManage')">
        <div :class="{'menu-active-green':menu=='preOutOrderManage'}" style="height:35px;line-height:35px;border-radius: 5px;text-align: center;margin-top:10px;position: relative">
          今日预离
          <Badge :count="preOutOrder" class-name="demo-badge-alone menu-badge text-green"></Badge>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mapState,mapMutations } from 'vuex'
  export default {
    name: 'Menu',
    computed: {//计算属性，监听值是否存在变化
      ...mapGetters(['getLeftFirstMenu']),
      menu: function(){
        this.menuActice = this.$route.name;
        return this.menuActice;
      }
    },
    data () {
      return {
        menuActice: '',
        preInOrder:0,
        preOutOrder:0,
        nowInOrder:0,
      }
    },
    created(){
      this.getNum();
    },
    methods:{
      activeSliderMenu(item){
        this.menuActice = item;
      },
      getNum(){
        this.$api.get("/proxy/order/static", {} ,res => {
          var data = Object.assign({}, res.data).data;
          this.preInOrder = data.todayCheckIn == 0 ? 0 : data.todayCheckIn;
          this.preOutOrder = data.todayCheckOut == 0 ? 0 : data.todayCheckOut;
          this.nowInOrder = data.currentLive == 0 ? 0 : data.currentLive;
        });
      }
    }
  }
</script>
