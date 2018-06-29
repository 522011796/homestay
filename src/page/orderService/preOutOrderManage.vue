<template>
  <div>
    <div class="right-content-title">
      <span>订单管理</span>
      <span> > </span>
      <span>全部订单</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15" style="position: relative">
      <div>
        <Input placeholder="请输入姓名或者手机号" v-model="userSearch" class="w180"></Input>
        <Button type="success" @click=search()>搜索</Button>
      </div>
      <div class="margin-top10">
        <table class="custom-table">
          <tr>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  {{orderStatusText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem data-name="全部" @click.native="selStatus($event,'')">全部</DropdownItem>
                  <DropdownItem data-name="待排房" @click.native="selStatus($event,'waitPlan')">待排房</DropdownItem>
                  <DropdownItem data-name="未入住" @click.native="selStatus($event,'notLiveIn')">未入住</DropdownItem>
                  <DropdownItem data-name="已入住" @click.native="selStatus($event,'livedIn')">已入住</DropdownItem>
                  <DropdownItem data-name="已离店" @click.native="selStatus($event,'levelOff')">已离店</DropdownItem>
                  <DropdownItem data-name="已取消" @click.native="selStatus($event,'cancel')">已取消</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">姓名</td>
            <td class="custom-td-title">电话</td>
            <td class="custom-td-title">房型</td>
            <td class="custom-td-title">房间</td>
            <td class="custom-td-title">入住时间</td>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  {{orderChannelText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem data-name="全部" @click.native="selChannel($event,'')">全部</DropdownItem>
                  <DropdownItem data-name="线下" @click.native="selChannel($event,'1')">线下</DropdownItem>
                  <DropdownItem data-name="携程" @click.native="selChannel($event,'2')">携程</DropdownItem>
                  <DropdownItem data-name="艺龙" @click.native="selChannel($event,'3')">艺龙</DropdownItem>
                  <DropdownItem data-name="去哪儿" @click.native="selChannel($event,'4')">去哪儿</DropdownItem>
                  <DropdownItem data-name="飞猪" @click.native="selChannel($event,'5')">飞猪</DropdownItem>
                  <DropdownItem data-name="其他" @click.native="selChannel($event,'99')">其他</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  {{orderPayTypeText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem @click.native="selPayType($event,'')">全部</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'1')">到店现付</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'2')">已担保</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'3')">全额预付</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'4')">部分预付</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">操作</td>
          </tr>

          <tbody>
            <Spin fix v-if="showLoading" class="table-loading">
              <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
              <div class="text-green">Loading</div>
            </Spin>
            <tr v-if="totalCount!=0" v-for="(item,index) in orderList.list" :key="index">
              <td class="custom-td-value">
                <span v-if="item.order_status == 'waitPlan'">待排房</span>
                <span v-if="item.order_status == 'notLiveIn'">未入住</span>
                <span v-if="item.order_status == 'livedIn'">已入住</span>
                <span v-if="item.order_status == 'levelOff'">已离店</span>
                <span v-if="item.order_status == 'cancel'">已取消</span>
              </td>
              <td class="custom-td-value">
                <span>{{item.real_name}}</span>
              </td>
              <td class="custom-td-value">
                <span>{{item.phone}}</span>
              </td>
              <td class="custom-td-value">
                <span>{{item.room_type}}</span>
              </td>
              <td class="custom-td-value">
                <span>{{item.room_no}}({{item.room_group_name}})</span>
              </td>
              <td class="custom-td-value">
                <span>{{$moment.unix(item.check_in_time/1000).format("YYYY-MM-DD hh:mm")}}</span>
              </td>
              <td class="custom-td-value">
                <span v-if="item.channel == null">--</span>
                <span v-if="item.channel == '1'">线下</span>
                <span v-if="item.channel == '2'">携程</span>
                <span v-if="item.channel == '3'">艺龙</span>
                <span v-if="item.channel == '4'">去哪儿</span>
                <span v-if="item.channel == '5'">飞猪</span>
                <span v-if="item.channel == '99'">其他</span>
              </td>
              <td class="custom-td-value">
                <span v-if="item.pay_type == null">--</span>
                <span v-if="item.pay_type == '1'">到店现付</span>
                <span v-if="item.pay_type == '2'">已担保</span>
                <span v-if="item.pay_type == '3'">全额预付</span>
                <span v-if="item.pay_type == '4'">部分预付</span>
              </td>
              <td class="custom-td-value">
                <a href="javascript:;">详情</a>
              </td>
            </tr>
            <tr v-if="totalCount==0">
              <td colspan="9" class="text-center">暂无数据</td>
            </tr>
          </tbody>
        </table>
        <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {
        showLoading:false,
        userSearch:"",
        orderStatus:"",
        orderStatusText:'状态',
        orderChannel:"",
        orderChannelText:'渠道来源',
        orderPayType:'',
        orderPayTypeText:'支付类型',
        totalCount:0,
        current:1,
        pageNum:12,
        orderList:[]
      }
    },
    created(){

    },
    methods:{
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          userSearch:this.userSearch,
          orderStatus:this.orderStatus,
          channel:this.orderChannel,
          payType:this.orderPayType,
          filter:'todayCheckOut'
        };
        console.log(this.$utils.clearData(params));
        this.showLoading = true;
        this.$api.get("/proxy/order/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.orderList = data;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      search(){
        this.init();
      },
      selStatus(event,type){
        this.orderStatus = type;
        this.orderStatusText = event.currentTarget.getAttribute("data-name");
        this.init();
      },
      selChannel(event,type){
        //console.log(event.target.innerText);
        this.orderChannel = type;
        this.orderChannelText = event.currentTarget.getAttribute("data-name");
        this.init();
      },
      selPayType(event,type){
        //console.log(event.target.innerText);
        this.orderPayType = type;
        this.orderPayTypeText = event.target.innerText;
        this.init();
      }
    },

    mounted () {
      this.init();
    }
  }
</script>
<style>

</style>
