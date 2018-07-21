<template>
  <div>
    <Button type="success" @click="show()">click</Button>
    <!--<Modal
      v-model="showmodel"
      title="Title"
      &lt;!&ndash;ok-text="保存"
      cancel-text="取消"&ndash;&gt;
      @on-ok="save"
      @on-cancel="cancel"
      width="760"
      >-->
      <Modal
      :styles="{top: '65px'}"
      v-model="showmodel"
      :mask-closable="false"
      :closable="false"
      @on-visible-change = "chgModal"  width="760" class="orderTab">

        <div slot="header" class="modalTitle">
          <Tabs @on-click="tabChange($event)" value="checkin">
            <TabPane label="入住" name="in"></TabPane>
            <TabPane label="预定" name="checkin"></TabPane>
          </Tabs>
        </div>

      <Form inline v-for="(item,index) in ruleForm" :key="index">
        <div class="editOrder">
          <FormItem label="姓名:" class="margin-bottom0" :label-width="50">
            <Input type="text" size="small" style="width:100px" v-model="item.relaName" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="手机:" class="margin-bottom0" :label-width="50">
            <Input type="text" size="small" style="width:100px" v-model="item.phone" :maxlength="11"></Input>
          </FormItem>
          <FormItem :label-width="50" label="证件:" class="margin-bottom0">
            <Select size="small" v-model="item.cardType" style="width:100px" @on-change="chgCardType($event,index)">
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
            <Input placeholder="" size="small" style="width:187px"  v-model="item.cardId" :maxlength="18"></Input>
          </FormItem>
        </div>

        <div class="editOrder">
          <FormItem :label-width="50" label="房间:" class="margin-bottom0">
            <Select v-model="item.roomId" clearable size="small" style="width:100px" @on-open-change="filterRoom($event,item.roomId,item.inTime,item.outTime,item.tags,item.roomTypeId,item,index)">
              <Option v-for="(itemRoom,indexRoom) in roomList" :key="indexRoom" :value="itemRoom.id" @click.native="chgRoom($event,index,itemRoom.id,itemRoom.room_no,itemRoom.group_level1_name,itemRoom.group_level1_id)">{{itemRoom.room_no}}({{itemRoom.group_level1_name}})</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="50" label="特性:" class="margin-bottom0">
            <Select v-model="item.tags" clearable size="small" style="width:100px" @on-change="chgMainTag($event,item,index)" @on-clear="clearTag()">
              <Option v-for="(itemTag,indexTag) in tagList" :key="indexTag" :value="itemTag.id">{{itemTag.tag}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="50" label="入住:" class="margin-bottom0">
            <Input v-if="tabType == 'in'" size="small" v-model="item.inTime + ' ' + item.inTimeArr" style="width: 153px"></Input>
            <DatePicker v-if="tabType == 'checkin'" size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.inTime" @on-change="chgMainTime($event,'mainInTime',index)"></DatePicker>
            <TimePicker v-show="item.timeType == 1 && tabType == 'checkin'" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
            <TimePicker v-show="item.timeType == 2 && tabType == 'checkin'" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
          </FormItem>
          <FormItem :label-width="50" label="离店:" class="margin-bottom0">
            <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.outTime" :options="optionsEnd" @on-change="chgMainTime($event,'mainOutTime',index)" @on-open-change="openOutTime($event,index,'main')"></DatePicker>
            <TimePicker v-show="item.timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
            <TimePicker v-show="item.timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
          </FormItem>
        </div>

        <div class="editOrder">
          <FormItem :label-width="50" label="房型:" class="margin-bottom0">
            <Select v-model="item.roomTypeId" clearable size="small" style="width:100px" @on-change="chgMainType($event,item,index)" @on-clear="clearRoomType()">
              <Option v-for="(itemType,indexType) in typeList" :key="indexType" :value="itemType.id">{{itemType.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
            <RadioGroup v-model="item.timeType" size="small" type="button" @on-change="selTimeType($event,index)">
              <Radio label="1">日租</Radio>
              <Radio label="2">时租</Radio>
            </RadioGroup>
          </FormItem>
        </div>

        <div class="margin-top10">
          <label class="text-green">
            <i class=" fa fa-plus-circle"></i>
            添加房间
          </label>
        </div>
      </Form>
      <div slot="footer">
        <div>
          <span class="custom-font-error">{{errorTips}}</span>
          <Button type="success" @click="save('ruleForm')">确认</Button>
          <Button type="ghost" @click="cancel('ruleForm')">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        errorTips:'',
        roomList:[],
        tagList:[],
        typeList:[],
        showmodel:false,
        tabType:'checkin',
        ruleForm:[{
          timeType:'1',
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
          inTime:this.$moment.unix(new Date().getTime()/1000).format('YYYY-MM-DD'),
          outTime:this.$moment.unix((new Date().getTime()+86400000)/1000).format('YYYY-MM-DD'),
          orderType:'',
          status:'',
          relaOrderList:[],
          orderId:'',
          orderStatus:'',
          groupName:'',
          inTimeArr:'12:00',
          outTimeArr:'12:00',
          subSn:'',
          liveNowGl:false,
          selTagId:'',//用于修改订单时候存主订单的tagid
          selTypeId:'',//用于修改订单时候存主订单的typeid
          roomTypeId:''
        }],
        optionsEnd: {
          disabledDate (date) {
            return false;
          }
        },
        optionsEndChild: {
          disabledDate (date) {
            return false;
          }
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
        this.setRoomRemain(this.ruleForm[0].inTime+' '+this.ruleForm[0].inTimeArr,this.ruleForm[0].outTime+' '+this.ruleForm[0].outTimeArr,this.ruleForm[0].selTagId,this.ruleForm[0].selTypeId,this.ruleForm[0],0,'init');
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
      },
      selMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleForm[index].inTimeArr = event;
          if(this.ruleForm[index].timeType == 2){
            var time1 = this.ruleForm[index].inTime + " " + event;
            var time = new Date(time1).getTime() + 3600000;
            this.ruleForm[index].outTimeArr = this.$moment.unix(time/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleForm[index].outTimeArr = event;
        }
      },
      chgMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleForm[index].inTime = event;
          if(this.ruleForm[index].timeType == 1){
            this.ruleForm[index].outTime = this.$moment.unix((new Date(event).getTime() + 86400000)/1000).format('YYYY-MM-DD');
          }
          if(this.ruleForm[index].timeType == 2){
            var time = event + " " + this.ruleForm[index].inTimeArr;
            this.ruleForm[index].outTime = event;
            this.ruleForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleForm[index].outTime = event;
        }
      },
      openOutTime(event,index,type){//根据入住时间控制离店时间禁用时间段
        var _self = this;
        if(event){
          if(type=='main'){
            this.optionsEnd = {
              disabledDate(date){
                let time = _self.ruleForm[index].inTime;
                let dateStart = new Date(time);
                return date && date.valueOf() < (dateStart);
              }
            };
          }
        }
      },
      filterRoom(event,roomId,startTime,endTime,tagId,typeId,obj,index){//过滤已经选择的房间
        if(event){
          this.setRoomRemain(startTime,endTime,tagId,typeId,obj,index,'openRoom');
        }
      },
      setRoomRemain(startTime,endTime,tagId,typeId,obj,index,type){
        this.roomArr = [];
        let startInTime = "";
        let endOutTime = "";
        let selfStartTime = startTime;
        let selfEndTime = endTime;
        let timeList = [];
        timeList.push(this.ruleForm[index]);
        for(var i=0;i<this.ruleForm[index].relaOrderList.length;i++){
          timeList.push(this.ruleForm[index].relaOrderList[i]);
        }
        for(var i=0;i<timeList.length;i++){
          if(i==0){
            if(obj != timeList[i]){
              this.roomArr.push(timeList[i].roomId);
            }
            startInTime = timeList[i].inTime;
            endOutTime = timeList[i].outTime;
          }else{
            if(obj != timeList[i]){
              this.roomArr.push(timeList[i].room_id);
            }
            startInTime = timeList[i].check_in_time;
            endOutTime = timeList[i].check_out_time;
          }
          if(obj != timeList[i]){
            if((selfStartTime <= startInTime && selfEndTime > startInTime) || (selfStartTime >= startInTime && selfStartTime < endOutTime)){
              this.roomArr = this.roomArr;
            }else{
              this.roomArr = [];
            }
          }
        }
        this.getRoomRemain(tagId,typeId,index,obj,type);
      },
      isInArray(arr,value){//判断数组中存在某个原素
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      },
      getRoomRemain(tagId,typeId,index,obj,type){
        let startTime = "";
        let endTime = "";
        if(index>=0){
          startTime = this.ruleForm[index].inTime + " " + this.ruleForm[index].inTimeArr;
          endTime = this.ruleForm[index].outTime + " " + this.ruleForm[index].outTimeArr;
        }else{
          startTime = this.ruleForm[index].inTime + " " + this.ruleForm[index].inTimeArr;
          endTime = this.ruleForm[index].outTime + " " + this.ruleForm[index].outTimeArr;
        }
        var params = {
          page:1,
          num:9999,
          startTime:startTime,
          endTime:endTime,
          roomTypeId:typeId,
          roomTagIds:tagId
        };

        this.$api.get("/proxy/room/remains", this.$utils.clearData(params) ,res => {
          //过滤已经被选的房间
          var data = Object.assign({}, res.data);
          var arr = [];
          for(var i=0;i<data.data.length;i++){
            if(this.isInArray(this.roomArr,data.data[i].id) == false){
              arr.push(data.data[i]);
            }
          }
          this.roomList = arr;
          //console.log(this.roomList);
          if(this.roomList.length == 0){
            if(index>=0){
              this.ruleForm[index].roomId = '';
            }else{
              this.ruleForm[index].roomId = '';
            }
          }else{
            if(type == 'init' || type != 'openRoom'){//如果是初始或者不是展开房间下拉框，执行自动选择房间的操作
              this.ruleForm[index].roomId = arr[0].id;
            }
          }
        });
      },
      save(){
        this.showmodel = true;
        console.log(this.ruleForm);
      },
      cancel(){

      },
      chgModal(status) {
        if(!status){

        };
      },
      selTimeType(event,index){
        if(event == 1){
          this.ruleForm[index].timeType = "1";
          this.ruleForm[index].inTime = this.ruleForm[index].inTime;
          this.ruleForm[index].outTime = this.$moment.unix((new Date(this.ruleForm[index].inTime).getTime()+86400000)/1000).format('YYYY-MM-DD');
          let time = this.ruleForm[index].inTime + " " + this.ruleForm[index].inTimeArr;
          this.ruleForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH') + ":00";
          this.ruleForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH') + ":00";
        }else if(event == 2){
          this.ruleForm[index].timeType = "2";
          this.ruleForm[index].inTime = this.ruleForm[index].inTime;
          this.ruleForm[index].outTime = this.ruleForm[index].inTime;
          let time = this.ruleForm[index].inTime + " " + this.ruleForm[index].inTimeArr;
          this.ruleForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH:mm');
          this.ruleForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH:mm');
        }
      },
      chgMainType(event,obj,index){
        this.ruleForm[index].selTypeId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,obj.selTagId,event,obj,index);
      },
      chgMainTag(event,obj,index){
        this.ruleForm[index].selTagId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,event,obj.roomTypeId,obj,index);
      },
      chgRoom(event,index,roomId,roomNo,groupName,groupId){
        this.ruleForm[index].roomId = roomId;
        this.ruleForm[index].roomNo = roomNo;
        this.ruleForm[index].groupName = groupName;
        this.ruleForm[index].roomGroupId = groupId;
      },
      tabChange(type){
        this.tabType = type;
        for(var i = 0;i < this.ruleForm.length;i++){
          if(type == 'in'){
            this.ruleForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleForm[i].inTimeArr = this.$moment().format('HH:mm');
            this.ruleForm[i].timeType = "1";
          }
          if(type == 'checkin'){
            this.ruleForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleForm[i].outTimeArr = "12:00";
            this.ruleForm[i].inTimeArr = "12:00";
            this.ruleForm[i].timeType = "1";
          }
        }
      },
      chgCardType(event,index){
        this.ruleForm[index].cardType = event;
      }
    }
  }
</script>
<style>

</style>
