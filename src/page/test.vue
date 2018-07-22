<template>
  <div>
    <Button type="success" @click="showOrder()">click</Button>
    <Button type="success" @click="goIn(403,7,'珠江广场',3)">goIn</Button>
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
      @on-visible-change = "chgOrderModal"  width="760" class="orderTab">

        <div slot="header" class="modalTitle">
          <Tabs @on-click="tabChange($event)" :value="tabType">
            <TabPane label="入住" name="in"></TabPane>
            <TabPane label="预定" name="checkin"></TabPane>
          </Tabs>
        </div>

      <Form ref="ruleOrderForm" inline v-for="(item,index) in ruleOrderForm" :key="index" class="margin-bottom10" style="position:relative">
        <i v-if="index != 0" class=" fa fa-remove" style="position: absolute;right:-13px;top:40px;" @click="mutiOrder(index)"></i>
        <div style="border:1px solid #dddddd;border-radius: 5px">
          <div class="editOrder">
            <FormItem label="姓名:" class="margin-bottom0" :label-width="50">
              <Input type="text" size="small" style="width:100px" v-model="item.realName" :maxlength="20"></Input>
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
                <Option v-for="(itemRoom,indexRoom) in roomOrderList" :key="indexRoom" :value="itemRoom.id" @click.native="chgRoom($event,index,itemRoom.id,itemRoom.room_no,itemRoom.group_level1_name,itemRoom.group_level1_id)">{{itemRoom.room_no}}({{itemRoom.group_level1_name}})</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="特性:" class="margin-bottom0">
              <Select v-model="item.tags" clearable size="small" style="width:100px" @on-change="chgMainTag($event,item,index)" @on-clear="clearTag(index)">
                <Option v-for="(itemTag,indexTag) in tagOrderList" :key="indexTag" :value="itemTag.id">{{itemTag.tag}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="入住:" class="margin-bottom0">
              <Input v-if="tabType == 'in'" size="small" v-model="item.inTime + ' ' + item.inTimeArr" style="width: 153px"></Input>
              <DatePicker v-if="tabType == 'checkin'" size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.inTime" @on-change="chgMainTime($event,'mainInTime',index)"></DatePicker>
              <TimePicker v-show="item.timeType == 1 && tabType == 'checkin'" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
              <TimePicker v-show="item.timeType == 2 && tabType == 'checkin'" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
            </FormItem>
            <FormItem :label-width="50" label="离店:" class="margin-bottom0">
              <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.outTime" :options="optionsOrderEnd" @on-change="chgMainTime($event,'mainOutTime',index)" @on-open-change="openOutTime($event,index,'main')"></DatePicker>
              <TimePicker v-show="item.timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
              <TimePicker v-show="item.timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
            </FormItem>
          </div>

          <div class="editOrder">
            <FormItem :label-width="50" label="房型:" class="margin-bottom0">
              <Select v-model="item.roomTypeId" clearable size="small" style="width:100px" @on-change="chgMainType($event,item,index)" @on-clear="clearRoomType(index)">
                <Option v-for="(itemType,indexType) in typeOrderList" :key="indexType" :value="itemType.id">{{itemType.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
              <RadioGroup v-model="item.timeType" size="small" type="button" @on-change="selTimeType($event,index)">
                <Radio label="1">日租</Radio>
                <Radio label="2">时租</Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </div>
      </Form>
      <div class="margin-top10">
        <label class="text-green" @click="addOrder()">
          <i class=" fa fa-plus-circle"></i>
          添加房间
        </label>
      </div>

      <div>
        <Form inline :label-width="70">
          <div class="editOrder">
            <FormItem label="支付类型:" class="margin-bottom0">
              <Select v-model="payType" clearable style="width:100px" size="small">
                <Option value="1">到店现付</Option>
                <Option value="2">已担保</Option>
                <Option value="3">全额预付</Option>
                <Option value="4">部分预付</Option>
              </Select>
            </FormItem>
            <FormItem label="渠道来源:" class="margin-bottom0">
              <Select v-model="channel" clearable style="width:100px" size="small">
                <Option value="1">线下</Option>
                <Option value="2">携程</Option>
                <Option value="3">艺龙</Option>
                <Option value="4">去哪儿</Option>
                <Option value="5">飞猪</Option>
                <Option value="99">其他</Option>
              </Select>
            </FormItem>
          </div>
          <div class="editOrder">
            <FormItem label="备注:" class="margin-bottom0">
              <Input v-model="remarks" type="textarea" style="width:654px" placeholder=""  :maxlength="400"></Input>
            </FormItem>
          </div>
        </Form>
      </div>

      <div slot="footer">
        <div>
          <span class="custom-font-error font-12">{{errorTips}}</span>
          <Button type="success" @click="save('ruleOrderForm')">确认</Button>
          <Button type="ghost" @click="cancel('ruleOrderForm')">取消</Button>
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
        roomOrderList:[],
        tagOrderList:[],
        typeOrderList:[],
        showmodel:false,
        tabType:'checkin',
        payType:'',
        channel:'',
        remarks:'',
        orderOprType: '',
        ruleOrderForm:[{
          timeType:'1',
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
          groupName:'',
          inTimeArr:'12:00',
          outTimeArr:'12:00',
          liveNowGl:false,
          selTagId:'',//用于修改订单时候存主订单的tagid
          selTypeId:'',//用于修改订单时候存主订单的typeid
          roomTypeId:''
        }],
        optionsOrderEnd: {
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
      showOrder(roomNo,roomId,groupName,groupId){
        this.showmodel = true;
        this.getRoomOrderList();
        this.getTagOrderList();
        this.getTypeOrderList();
        var inData = [];
        if(this.tabType == 'in'){//如果为入住，传入相对应的值
          inData.push({
            roomId:roomId,
            roomNo:roomNo,
            groupName:groupName,
            roomGroupName:groupName,
            roomGroupId:groupId
          });
        }
        this.setRoomRemain(this.ruleOrderForm[0].inTime+' '+this.ruleOrderForm[0].inTimeArr,this.ruleOrderForm[0].outTime+' '+this.ruleOrderForm[0].outTimeArr,this.ruleOrderForm[0].selTagId,this.ruleOrderForm[0].selTypeId,this.ruleOrderForm[0],0,'init',inData);
      },
      getRoomOrderList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomOrderList = data.list;
        });
      },
      getTagOrderList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          this.tagOrderList = res.data.data;
        });
      },
      getTypeOrderList(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/type/list", params ,res => {
          this.typeOrderList = res.data.data;
        });
      },
      selMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleOrderForm[index].inTimeArr = event;
          if(this.ruleOrderForm[index].timeType == 2){
            var time1 = this.ruleOrderForm[index].inTime + " " + event;
            var time = new Date(time1).getTime() + 3600000;
            this.ruleOrderForm[index].outTimeArr = this.$moment.unix(time/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleOrderForm[index].outTimeArr = event;
        }
      },
      chgMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleOrderForm[index].inTime = event;
          if(this.ruleOrderForm[index].timeType == 1){
            this.ruleOrderForm[index].outTime = this.$moment.unix((new Date(event).getTime() + 86400000)/1000).format('YYYY-MM-DD');
          }
          if(this.ruleOrderForm[index].timeType == 2){
            var time = event + " " + this.ruleOrderForm[index].inTimeArr;
            this.ruleOrderForm[index].outTime = event;
            this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleOrderForm[index].outTime = event;
        }
      },
      openOutTime(event,index,type){//根据入住时间控制离店时间禁用时间段
        var _self = this;
        if(event){
          if(type=='main'){
            this.optionsOrderEnd = {
              disabledDate(date){
                let time = _self.ruleOrderForm[index].inTime;
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
      setRoomRemain(startTime,endTime,tagId,typeId,obj,index,type,initData){
        this.roomArr = [];
        let startInTime = "";
        let endOutTime = "";
        let selfStartTime = startTime;
        let selfEndTime = endTime;
        let timeList = [];
        timeList.push(this.ruleOrderForm[index]);
        for(var i=0;i<this.ruleOrderForm.length;i++){
          if(obj != this.ruleOrderForm[i]){
            this.roomArr.push(this.ruleOrderForm[i].roomId);
          }
          startInTime = this.ruleOrderForm[i].inTime;
          endOutTime = this.ruleOrderForm[i].outTime;
          if(obj != this.ruleOrderForm[i]){
            if((selfStartTime <= startInTime && selfEndTime > startInTime) || (selfStartTime >= startInTime && selfStartTime < endOutTime)){
              this.roomArr = this.roomArr;
            }else{
              this.roomArr = [];
            }
          }
        }
        //console.log(this.roomArr);
        this.getRoomRemain(tagId,typeId,index,obj,type,initData);
      },
      isInArray(arr,value){//判断数组中存在某个原素
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      },
      getRoomRemain(tagId,typeId,index,obj,type,initData){
        let startTime = "";
        let endTime = "";
        if(index>=0){
          startTime = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          endTime = this.ruleOrderForm[index].outTime + " " + this.ruleOrderForm[index].outTimeArr;
        }else{
          startTime = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          endTime = this.ruleOrderForm[index].outTime + " " + this.ruleOrderForm[index].outTimeArr;
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
          this.roomOrderList = arr;
          //console.log(this.roomOrderList);
          if(this.roomOrderList.length == 0){
            if(index>=0){
              this.ruleOrderForm[index].roomId = '';
            }else{
              this.ruleOrderForm[index].roomId = '';
            }
          }else{
            if(type == null){
              this.ruleOrderForm[index].roomId = arr[0].id;
              this.ruleOrderForm[index].roomNo = arr[0].room_no;
              this.ruleOrderForm[index].groupName = arr[0].group_level1_name;
              this.ruleOrderForm[index].roomGroupName = arr[0].group_level1_name;
              this.ruleOrderForm[index].roomGroupId = arr[0].group_level1_id;
            }else if(type == 'init' || type != 'openRoom'){//如果是初始或者不是展开房间下拉框，执行自动选择房间的操作
              if(this.tabType == 'in'){
                this.ruleOrderForm[index].roomId = initData[0].roomId;
                this.ruleOrderForm[index].roomNo = initData[0].roomNo;
                this.ruleOrderForm[index].groupName = initData[0].groupName;
                this.ruleOrderForm[index].roomGroupName = initData[0].roomGroupName;
                this.ruleOrderForm[index].roomGroupId = initData[0].roomGroupId;
              }else{
                this.ruleOrderForm[index].roomId = arr[0].id;
                this.ruleOrderForm[index].roomNo = arr[0].room_no;
                this.ruleOrderForm[index].groupName = arr[0].group_level1_name;
                this.ruleOrderForm[index].roomGroupName = arr[0].group_level1_name;
                this.ruleOrderForm[index].roomGroupId = arr[0].group_level1_id;
              }
            }
          }
        });
      },
      save(){
        //验证关联订单
        let phoneReg = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
        this.errorTips = '';
        var _self = this;
        let orderArr = [];

        this.ruleOrderForm.forEach(function(item, index) {
          orderArr.push({
            realName:item.realName,
            phone:item.phone,
            roomId:item.roomId,
            roomNo:item.roomNo,
            roomGroupName:item.groupName,
            roomGroupId:item.roomGroupId,
            checkInType:item.timeType,
            checkInTime:item.inTime + "T" + item.inTimeArr,
            checkOutTime:item.outTime + "T" + item.outTimeArr,
            cardId:item.cardId,
            cardType:item.cardType,
            liveNow:_self.orderOprType == 'in' ? true : false,
            payType: _self.payType ? _self.payType : '',
            channel: _self.channel ? _self.channel : '',
            remarks: _self.remarks ? _self.remarks : '',
          });
        });


        for(var i=0;i<this.ruleOrderForm.length;i++){
          if(this.ruleOrderForm[i].realName == ''){
            this.errorTips = '订单中的姓名不能为空!';
            return;
          }
          if(this.ruleOrderForm[i].phone == ''){
            this.errorTips = '订单中的手机号不能为空!';
            return;
          }
          if(!phoneReg.test(this.ruleOrderForm[i].phone)){
            this.errorTips = '订单中的手机号填写有误!';
            return;
          }
          if(!this.ruleOrderForm[i].roomId){
            this.errorTips = '订单中的房间不能为空!!';
            return;
          }
        }
        //console.log(orderArr);return;
        var params = {
          orders:orderArr
        };
        var postHeader = {"Content-Type":'application/json; charset=UTF-8'};
        this.$api.post('/proxy/order/multi-set', JSON.stringify(params) ,res => {
          this.$Message.success(res.data.desc);
          this.cancel('ruleOrderForm');
        },res => {
          this.$Message.error(res.data.desc);
        },postHeader);
      },
      cancel(name){
        //this.$refs[name].resetFields();
        this.showmodel = false;
        this.closeModal();
      },
      closeModal(){
        this.errorTips = '',
          this.roomOrderList=[],
          this.tagOrderList=[],
          this.typeOrderList=[],
          this.showmodel=false,
          this.tabType='checkin',
          this.orderOprType= '',
          this.payType='',
          this.channel='',
          this.remarks='',
          this.ruleOrderForm = [{
            timeType:'1',
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
            groupName:'',
            inTimeArr:'12:00',
            outTimeArr:'12:00',
            liveNowGl:false,
            selTagId:'',//用于修改订单时候存主订单的tagid
            selTypeId:'',//用于修改订单时候存主订单的typeid
            roomTypeId:''
          }]
      },
      chgOrderModal(status) {
        if(!status){
          this.closeModal();
        };
      },
      selTimeType(event,index){
        if(event == 1){
          this.ruleOrderForm[index].timeType = "1";
          this.ruleOrderForm[index].inTime = this.ruleOrderForm[index].inTime;
          this.ruleOrderForm[index].outTime = this.$moment.unix((new Date(this.ruleOrderForm[index].inTime).getTime()+86400000)/1000).format('YYYY-MM-DD');
          let time = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          this.ruleOrderForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH') + ":00";
          this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH') + ":00";
        }else if(event == 2){
          this.ruleOrderForm[index].timeType = "2";
          this.ruleOrderForm[index].inTime = this.ruleOrderForm[index].inTime;
          this.ruleOrderForm[index].outTime = this.ruleOrderForm[index].inTime;
          let time = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          this.ruleOrderForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH:mm');
          this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH:mm');
        }
      },
      chgMainType(event,obj,index){
        this.ruleOrderForm[index].selTypeId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,obj.selTagId,event,obj,index);
      },
      chgMainTag(event,obj,index){
        this.ruleOrderForm[index].selTagId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,event,obj.roomTypeId,obj,index);
      },
      chgRoom(event,index,roomId,roomNo,groupName,groupId){
        this.ruleOrderForm[index].roomId = roomId;
        this.ruleOrderForm[index].roomNo = roomNo;
        this.ruleOrderForm[index].groupName = groupName;
        this.ruleOrderForm[index].roomGroupName = groupName;
        this.ruleOrderForm[index].roomGroupId = groupId;
      },
      tabChange(type){
        this.tabType = type;
        for(var i = 0;i < this.ruleOrderForm.length;i++){
          if(type == 'in'){
            this.ruleOrderForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleOrderForm[i].inTimeArr = this.$moment().format('HH:mm');
            this.ruleOrderForm[i].timeType = "1";
          }
          if(type == 'checkin'){
            this.ruleOrderForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleOrderForm[i].outTimeArr = "12:00";
            this.ruleOrderForm[i].inTimeArr = "12:00";
            this.ruleOrderForm[i].timeType = "1";
          }
        }
      },
      chgCardType(event,index){
        this.ruleOrderForm[index].cardType = event;
      },
      addOrder(){
        //console.log(this.ruleOrderForm[0]);
        this.ruleOrderForm.push({
          timeType:this.ruleOrderForm[this.ruleOrderForm.length-1].timeType,
          realName:this.ruleOrderForm[this.ruleOrderForm.length-1].realName,
          roomId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomId,
          phone:this.ruleOrderForm[this.ruleOrderForm.length-1].phone,
          cardType:this.ruleOrderForm[this.ruleOrderForm.length-1].cardType,
          cardId:this.ruleOrderForm[this.ruleOrderForm.length-1].cardId,
          //roomNo:this.ruleOrderForm[this.ruleOrderForm.length-1].roomNo,
          //roomGroupName:this.ruleOrderForm[this.ruleOrderForm.length-1].roomGroupName,
          //roomGroupId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomGroupId,
          tags:this.ruleOrderForm[this.ruleOrderForm.length-1].tags,
          inTime:this.ruleOrderForm[this.ruleOrderForm.length-1].inTime,
          outTime:this.ruleOrderForm[this.ruleOrderForm.length-1].outTime,
          //groupName:this.ruleOrderForm[this.ruleOrderForm.length-1].groupName,
          inTimeArr:this.ruleOrderForm[this.ruleOrderForm.length-1].inTimeArr,
          outTimeArr:this.ruleOrderForm[this.ruleOrderForm.length-1].outTimeArr,
          liveNowGl:false,
          selTagId:this.ruleOrderForm[this.ruleOrderForm.length-1].selTagId,//用于修改订单时候存主订单的tagid
          selTypeId:this.ruleOrderForm[this.ruleOrderForm.length-1].selTypeId,//用于修改订单时候存主订单的typeid
          roomTypeId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomTypeId
        });
        let startTime = this.ruleOrderForm[this.ruleOrderForm.length-1].inTime;
        let endTime = this.ruleOrderForm[this.ruleOrderForm.length-1].outTime;
        let tagId = this.ruleOrderForm[this.ruleOrderForm.length-1].selTagId;
        let typeId = this.ruleOrderForm[this.ruleOrderForm.length-1].selTypeId;
        let obj = this.ruleOrderForm[this.ruleOrderForm.length-1];
        this.setRoomRemain(startTime,endTime,tagId,typeId,obj,this.ruleOrderForm.length-1,null)
      },
      mutiOrder(index){
        this.ruleOrderForm.splice(index,1);
      },
      clearTag(index){
        this.ruleOrderForm[index].selTagId = '';
      },
      clearRoomType(index){
        this.ruleOrderForm[index].selTypeId = '';
      },
      goIn(roomNo,roomId,groupName,groupId){
        this.tabType = 'in';
        this.orderOprType = 'in';
        this.showOrder(roomNo,roomId,groupName,groupId);
      }
    }
  }
</script>
<style>

</style>
