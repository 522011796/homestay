<template>
  <div>
    <Button type="success" @click="show()">click</Button>
    <Modal
      v-model="showmodel"
      title="Title"
      ok-text="保存"
      cancel-text="取消"
      width="760"
      >

      <Form inline>
        <div class="editOrder">
          <FormItem label="姓名:" class="margin-bottom0" :label-width="50">
            <Input type="text" size="small" style="width:100px" v-model="ruleForm.relaName" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="手机:" class="margin-bottom0" :label-width="50">
            <Input type="text" size="small" style="width:100px" v-model="ruleForm.phone" :maxlength="11"></Input>
          </FormItem>
          <FormItem :label-width="50" label="证件:" class="margin-bottom0">
            <Select size="small" v-model="ruleForm.cardType" style="width:100px" @on-change="chgCardType($event)">
              <Option value="idcard">身份证</Option>
              <Option value="residenceBooklet">户口簿</Option>
              <Option value="passportCard1">外交护照</Option>
              <Option value="passportCard2">普通护照</Option>
              <Option value="passportCard3">公务护照</Option>
              <Option value="officeCard">军官证</Option>
              <Option value="copCard">警官证</Option>
              <Option value="soldierCard">士兵证</Option>
              <Option value="passCard">能行证</Option>
              <Option value="otherCard">其他</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
            <Input placeholder="" size="small" style="width:187px"  v-model="ruleForm.cardId" :maxlength="18"></Input>
          </FormItem>
        </div>

        <div class="editOrder">
          <FormItem :label-width="50" label="房间:" class="margin-bottom0">
            <Select v-model="ruleForm.roomId" clearable size="small" style="width:100px" @on-open-change="filterRoom($event,ruleForm.roomId,ruleForm.inTime,ruleForm.outTime,ruleForm.tags[0].id,ruleForm.roomTypeId,ruleForm)">
              <Option v-for="(item,index) in roomList" :key="index" :value="item.id" @click.native="chgRoom($event,item.id,item.room_no,item.group_level1_name,item.group_level1_id)">{{item.room_no}}({{item.group_level1_name}})</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="50" label="特性:" class="margin-bottom0">
            <Select v-model="ruleForm.tags[0].id" clearable size="small" style="width:100px" @on-change="chgMainTag($event,ruleForm)" @on-clear="clearTag()">
              <Option v-for="(item,index) in tagList" :key="index" :value="item.id">{{item.tag}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="50" label="入住:" class="margin-bottom0"><!--
                    <Input placeholder="" size="small" style="width:90px;" v-model="$moment.unix(ruleForm.inTime/1000).format('YYYY-MM-DD')"></Input>-->
            <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(ruleForm.inTime/1000).format('YYYY-MM-DD')" @on-change="chgMainTime($event,'mainInTime')"></DatePicker>
            <TimePicker v-show="timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.inTimeArr" @on-change="selMainTime($event,'mainInTime')"></TimePicker>
            <TimePicker v-show="timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.inTimeArr" @on-change="selMainTime($event,'mainInTime')"></TimePicker>
          </FormItem>
          <FormItem :label-width="50" label="离店:" class="margin-bottom0"><!--
                    <Input placeholder="" size="small" style="width:90px" v-model="$moment.unix(ruleForm.outTime/1000).format('YYYY-MM-DD')"></Input>-->
            <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(ruleForm.outTime/1000).format('YYYY-MM-DD')" :options="optionsEnd" @on-change="chgMainTime($event,'mainOutTime')" @on-open-change="openOutTime($event,null,'main')"></DatePicker>
            <TimePicker v-show="timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.outTimeArr" @on-change="selMainTime($event,'mainOutTime')"></TimePicker>
            <TimePicker v-show="timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.outTimeArr" @on-change="selMainTime($event,'mainOutTime')"></TimePicker>
          </FormItem>
        </div>

        <div class="editOrder">
          <FormItem :label-width="50" label="房型:" class="margin-bottom0">
            <Select v-model="ruleForm.roomTypeId" clearable size="small" style="width:100px" @on-change="chgMainType($event,ruleForm)" @on-clear="clearRoomType()">
              <Option v-for="(item,index) in typeList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
            <RadioGroup v-model="ruleForm.orderType" size="small" type="button" @on-change="selTimeType($event)">
              <Radio label="1">日租</Radio>
              <Radio label="2">时租</Radio>
            </RadioGroup>
          </FormItem>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        showmodel:false,
        ruleForm:{
          orderSn:'',
          payType:'',
          channel:'',
          remarks:'',
          realName:'',
          roomId:'',
          phone:'',
          cardType:'',
          cardId:'',
          roomNo:'',
          roomGroupName:'',
          roomGroupId:'',
          tags:[],
          inTime:'',
          outTime:'',
          orderType:'',
          status:'',
          relaOrderList:[],
          orderId:'',
          orderStatus:'',
          groupName:'',
          inTimeArr:'',
          outTimeArr:'',
          subSn:'',
          liveNowGl:false,
          selTagId:'',//用于修改订单时候存主订单的tagid
          selTypeId:'',//用于修改订单时候存主订单的typeid
          roomTypeId:''
        }
      }
    },
    created(){

    },
    methods:{
      show(){
        this.showmodel = true;
        this.getRoomList();
        this.getTag();
        this.getTypeList();
      },
      getRoomList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomList = data.list;
        });
      },
      getTag(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          this.tagList = res.data.data;
        });
      },
      getTypeList(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/type/list", params ,res => {
          this.typeList = res.data.data;
        });
      }
    }
  }
</script>
<style>

</style>
