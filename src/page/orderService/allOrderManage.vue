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
                <span>{{$moment.unix(item.check_in_time/1000).format("YYYY-MM-DD HH:mm")}}</span>
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
                <Button type="text" @click="detailOrder(item.id,item.order_sn)">详情</Button>
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

    <!--订单详细-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addDetailModal"
      :title="modalTitle"
      @on-visible-change = "chgModal"  width="760">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form  ref="ruleForm" label-position="right" :label-width="100" inline style="width: 100%;margin:0 auto;">
        <FormItem label="订单号:" class="margin-bottom0">
            {{ruleForm.orderSn}}
        </FormItem>
        <FormItem label="支付类型:" class="margin-bottom0">
          <span v-if="ruleForm.payType == null">--</span>
          <span v-if="ruleForm.payType == '1'">到店现付</span>
          <span v-if="ruleForm.payType == '2'">已担保</span>
          <span v-if="ruleForm.payType == '3'">全额预付</span>
          <span v-if="ruleForm.payType == '4'">部分预付</span>
        </FormItem>
        <FormItem label="渠道来源:" class="margin-bottom0">
          <span v-if="ruleForm.payType == null">--</span>
          <span v-if="ruleForm.payType == '1'">线下</span>
          <span v-if="ruleForm.payType == '2'">携程</span>
          <span v-if="ruleForm.payType == '3'">艺龙</span>
          <span v-if="ruleForm.payType == '4'">去哪儿</span>
          <span v-if="ruleForm.payType == '5'">飞猪</span>
          <span v-if="ruleForm.payType == '99'">其他</span>
        </FormItem>
        <FormItem label="备注:" class="margin-bottom0">
          <span v-if="ruleForm.remarks == ''">--</span>
          <span v-if="ruleForm.payType == '1'">{{ruleForm.remarks}}</span>
        </FormItem>
        <div class="line"></div>
        <!--批量操作按钮组-->
        <div v-if="showEditOrder" class="margin-bottom10">
          <Checkbox @on-change="selAllBox($event)"></Checkbox>
          <span v-if="goOutStatus">
            <Button type="success" size="small">批量办理退房</Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消办理退房</Button>
          </span>
          <span v-if="goInStatus">
            <Button type="success" size="small">批量办理入住</Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消办理入住</Button>
          </span>
          <span v-if="cancelOrderStatus">
            <Button type="success" size="small">批量取消订单</Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消操作</Button>
          </span>
          <span v-if="sendPwdStatus">
            <Button type="success" size="small">批量发送密码</Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消发送密码</Button>
          </span>
        </div>
        <div>
          <Checkbox @change.native="selOnlyBox($event)" v-if="showEditOrder" class="pull-left orderListBox" :true-value="ruleForm.orderId" :value="true"></Checkbox>
          <Card class="orderCard pull-right" :class="{'w96-full':showEditOrder,'w100-full':!showEditOrder}">
            <div>
              <div>
                <FormItem :label-width="70" label="姓名:" class="margin-bottom0">
                  {{ruleForm.realName}}
                </FormItem>
                <FormItem :label-width="70" label="手机:" class="margin-bottom0">
                  {{ruleForm.phone}}
                </FormItem>
                <FormItem :label-width="70" label="证件:" class="margin-bottom0">
                  <span v-if="ruleForm.cardType == 'idcard'">身份证</span>
                </FormItem>
                <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                  {{ruleForm.cardId}}
                </FormItem>
              </div>
              <div>
                <FormItem :label-width="70" label="房间:" class="margin-bottom0">
                  {{ruleForm.roomNo}}({{ruleForm.roomGroupName}})
                </FormItem>
                <FormItem :label-width="70" label="特性:" class="margin-bottom0">
              <span v-for="(item,index) in ruleForm.tags">
                {{item.type}}
              </span>
                </FormItem>
                <FormItem :label-width="70" label="入住:" class="margin-bottom0">
                  {{$moment.unix(ruleForm.inTime/1000).format("YYYY-MM-DD HH:mm")}}
                </FormItem>
                <FormItem :label-width="70" label="离店:" class="margin-bottom0">
                  {{$moment.unix(ruleForm.outTime/1000).format("YYYY-MM-DD HH:mm")}}
                </FormItem>
              </div>
              <div>
                <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
                  <span v-if="ruleForm.orderType == '1'">日租</span>
                  <span v-if="ruleForm.orderType == '2'">时租</span>
                </FormItem>
                <FormItem :label-width="70" label="状态:" class="margin-bottom0">
                  <span v-if="ruleForm.status == 'waitPlan'">待排房</span>
                  <span v-if="ruleForm.status == 'notLiveIn'">未入住</span>
                  <span v-if="ruleForm.status == 'livedIn'">已入住</span>
                  <span v-if="ruleForm.status == 'levelOff'">已离店</span>
                  <span v-if="ruleForm.status == 'cancel'">已取消</span>
                </FormItem>
              </div>
            </div>
          </Card>
          <div class="clearfix"></div>
        </div>

        <!--关联房间-->
        <div v-if="ruleForm.relaOrderList.length > 0">
          <div class="text-green" style="height:35px;line-height:35px;">
            <span>关联房间</span>
          </div>
          <div v-for="(item,index) in ruleForm.relaOrderList" :key="index">
            <Checkbox @on-change="selOnlyBox($event)" v-if="showEditOrder" class="pull-left orderListBox" :true-value="item.orderId" :value="true"></Checkbox>
            <Card class="orderCard pull-right" :class="{'w96-full':showEditOrder,'w100-full':!showEditOrder}">
              <div>
                <div>
                  <FormItem :label-width="70" label="姓名:" class="margin-bottom0">
                    {{item.real_name}}
                  </FormItem>
                  <FormItem :label-width="70" label="手机:" class="margin-bottom0">
                    {{item.phone}}
                  </FormItem>
                  <FormItem :label-width="70" label="证件:" class="margin-bottom0">
                    <span v-if="item.card_type == 'idcard'">身份证</span>
                  </FormItem>
                  <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                    {{item.card_id}}
                  </FormItem>
                </div>
                <div>
                  <FormItem :label-width="70" label="房间:" class="margin-bottom0">
                    {{item.room_no}}({{item.room_group_name}})
                  </FormItem>
                  <FormItem :label-width="70" label="特性:" class="margin-bottom0">
              <span v-for="(item,index) in item.tags" :key="index">
                {{item.type}}
              </span>
                  </FormItem>
                  <FormItem :label-width="70" label="入住:" class="margin-bottom0">
                    {{$moment.unix(item.check_in_time/1000).format("YYYY-MM-DD HH:mm")}}
                  </FormItem>
                  <FormItem :label-width="70" label="离店:" class="margin-bottom0">
                    {{$moment.unix(item.check_out_time/1000).format("YYYY-MM-DD HH:mm")}}
                  </FormItem>
                </div>
                <div>
                  <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
                    <span v-if="item.check_in_type == '1'">日租</span>
                    <span v-if="item.check_in_type == '2'">时租</span>
                  </FormItem>
                  <FormItem :label-width="70" label="状态:" class="margin-bottom0">
                    <span v-if="item.order_status == 'waitPlan'">待排房</span>
                    <span v-if="item.order_status == 'notLiveIn'">未入住</span>
                    <span v-if="item.order_status == 'livedIn'">已入住</span>
                    <span v-if="item.order_status == 'levelOff'">已离店</span>
                    <span v-if="item.order_status == 'cancel'">已取消</span>
                  </FormItem>
                </div>
              </div>
            </Card>
          </div>
          <div class="clearfix"></div>
        </div>
      </Form>
      <div slot="footer">
        <div v-if="!showEditOrder">
          <Button v-if="ruleForm.status == 'livedIn'" type="success" @click="goOut('ruleForm')">办理退房</Button>
          <Button v-if="ruleForm.status == 'livedIn'" type="ghost" @click="sendPwd('ruleForm')">发送密码</Button>
          <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="goIn('ruleForm')">办理入住</Button>
          <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="cancelOrder('ruleForm')">取消订单</Button>
          <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="updateOrder('ruleForm')">修改订单</Button>
          <Button type="ghost" @click="handleReset('ruleForm')">关闭窗口</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {
        showLoading:false,
        addDetailModal:false,
        goInStatus:false,
        goOutStatus:false,
        sendPwdStatus:false,
        cancelOrderStatus:false,
        showEditOrder:false,
        checkedOrder:false,
        trueValue:true,
        modalTitle:'',
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
        orderList:[],
        orderDetailList:[],
        checkList: [1,2],
        ruleForm:{
          orderSn:'',
          payType:'',
          channel:'',
          remarks:'',
          realName:'',
          phone:'',
          cardType:'',
          cardId:'',
          roomNo:'',
          roomGroupName:'',
          tags:[],
          inTime:'',
          outTime:'',
          orderType:'',
          status:'',
          relaOrderList:[],
          orderId:''
        }
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
          payType:this.orderPayType
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
      },
      chgModal(status) {
        if(!status){
          this.closeModal();
        };
      },
      detailOrder(orderId,orderSn){
        this.modalTitle = '订单详情';
        var params = {
          orderId : orderId,
          orderSn : orderSn
        };
        this.$api.postQs("/proxy/order/details2", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          console.log(data);
          this.orderDetailList = data;
          this.ruleForm = {
            orderSn:data.order_sn,
            payType:data.pay_type,
            channel:data.channel,
            remarks:data.remarks,
            realName:data.real_name,
            cardType:data.card_type,
            cardId:data.card_id,
            phone:data.phone,
            roomNo:data.room_no,
            roomGroupName:data.room_group_name,
            tags:data.room_tags,
            inTime:data.check_in_time,
            outTime:data.check_out_time,
            orderType:data.check_in_type,
            status:data.order_status,
            relaOrderList:data.relaOrderList,
            orderId:data.id
          };
          this.addDetailModal = true;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addDetailModal = false;
        this.closeModal();
      },
      closeModal() {
      },
      goOut(formName){
        this.goOutStatus = true;
        this.showEditOrder = true;
      },
      goIn(formName){
        this.goInStatus = true;
        this.showEditOrder = true;
      },
      sendPwd(formName){
        this.sendPwdStatus = true;
        this.showEditOrder = true;
      },
      cancelOrder(formName){
        this.cancelOrderStatus = true;
        this.showEditOrder = true;
      },
      cancelOrderOpr(status){
        this.goOutStatus = status;
        this.showEditOrder = status;
        this.goInStatus = status;
        this.showEditOrder = status;
        this.sendPwdStatus = status;
        this.showEditOrder = status;
        this.cancelOrderStatus = status;
        this.showEditOrder = status;
        this.checkedOrder = status;
      },
      selAllBox(event){
        var _self = this;
        this.checkedOrder = event;
        this.checkList.push(_self.orderDetailList.id);
        if(this.orderDetailList.relaOrderList.length > 0){
          this.orderDetailList.relaOrderList.forEach(function(item, index) {
            _self.checkList.push(item.id);
          });
        }
        //console.log(_self.checkList);
      },
      selOnlyBox(event){
        console.log(event);
        //console.log(event.currentTarget.getAttribute("true-value"));
        //this.checkedOrder = event;
      }
    },
    mounted () {
      this.init();
    },
    watch: {
      'checkList': {
        handler: function(val, oldVal) {
          console.log(val);
          /*if (val.length === this.checkboxList.length) {
            this.checked = true;
          } else {
            this.checked = false;
          }*/
        }
      }
    },
  }
</script>
<style>

</style>
