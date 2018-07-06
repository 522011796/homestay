<template>
  <div style="position: relative">
    <Spin fix v-if="showLoading" class="table-loading">
      <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
      <div class="text-green">Loading</div>
    </Spin>
    <Tabs @on-click="clkTab($event)">
      <TabPane label="人员管理" name="userList">
        <div class="padding-top0-top25" style="position: relative">
          <div>
            <Button type="success" icon="plus" @click="show(null,'userList')">
              添加保洁员
            </Button>
            <Input placeholder="请输入房间号" class="w180" v-model="searchName"></Input>
            <Button type="success" @click="search">搜索</Button>
          </div>
          <div>
            <Table :columns="columns" :data="data" class="margin-top10"></Table>
          </div>
          <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
        </div>
      </TabPane>

      <TabPane label="门卡管理" name="cardList">
        <div class="padding-top0-top25" style="position: relative">
          <div>
            <Poptip placement="bottom-start" width="100px">
              <Button type="success">添加门卡</Button>
              <div class="api" slot="content" style="height:100px;width: 100px;text-align: center">
                <img src="./../../assets/img/192.png" style="height:100px;width: 120px">
              </div>
            </Poptip>
            <Input placeholder="请输入名称" class="w180" v-model="searchCardName"></Input>
            <Button type="success" @click="searchCard">搜索</Button>
          </div>
          <div>
            <Table :columns="cardColumns" :data="dataCard" class="margin-top10"></Table>
          </div>
          <Page v-if="totalCardCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCardCount" :current="current" :page-size="pageNum"	 size="small" @on-change="initCard($event)" show-total></Page>
        </div>
      </TabPane>
    </Tabs>

    <!--添加保洁员信息-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addModal"
      title=""
      width="590"
      @on-visible-change = "chgModal">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleForm" ref="ruleForm" :label-width="80" style="width: 90%;margin:0 auto;">
        <FormItem label="姓名" prop="name" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.name" placeholder="" class="w100-full"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone" :rules="$filter_rules({required:true,type:'phone'})">
          <Input v-model="ruleForm.phone" placeholder="" class="w100-full"></Input>
        </FormItem>
        <FormItem label="分配门卡">
          <Dropdown trigger="click" class="w100-full" style="position: relative">
            <Button type="default" class="text-left w100-full">
              {{cardNameText}}
              <Icon type="arrow-down-b" style="position: absolute;right:10px;top:10px;"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%;height:120px;overflow-y: auto">
              <DropdownItem data-name="暂不分配" @click.native="selCard($event,'')">暂不分配</DropdownItem>
              <DropdownItem v-for="(item,index) in dataCardList" :key="index" :data-name="item.name" @click.native="selCard($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="开门密码">
          <RadioGroup v-model="ruleForm.needPassGroup" v-show="!oprType">
            <Radio label="暂不生成" data-name="false" @change.native="selNeedPass($event)"></Radio>
            <Radio label="立即生成" data-name="true" @change.native="selNeedPass($event)"></Radio>
          </RadioGroup>
          <RadioGroup v-show="oprType">
            <Radio label="删除密码" data-name="false" @change.native="selNeedPass($event)"></Radio>
            <Radio label="更换密码" data-name="true" @change.native="selNeedPass($event)"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择房间">
          <Transfer
            :data="dataRoom"
            :target-keys="targetKeys"
            :render-format="renderTrans"
            :titles="titles"
            :list-style="listStyle"
            @on-change="handleChange"></Transfer>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="saveUser('ruleForm')">保存</Button>
        <Button type="ghost" @click="handleReset('ruleForm')">取消</Button>
      </div>
    </Modal>

    <!--编辑门卡信息-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addCardModal"
      title=""
      @on-visible-change = "chgModal">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleCardForm" ref="ruleCardForm" :label-width="80" style="width: 60%;margin:0 auto;">
        <FormItem label="门卡名称" prop="name" :rules="$filter_rules({required:true})">
          <Input v-model="ruleCardForm.name" placeholder=""></Input>
        </FormItem>
        <FormItem label="备注" prop="remarks">
          <Input v-model="ruleCardForm.remarks" type="textarea" :rows="4" placeholder=""></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="saveCard('ruleCardForm')">保存</Button>
        <Button type="ghost" @click="handleReset('ruleCardForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  const delCardTips = "确定删除门卡";
  const sendMmsTips_1 = "开门密码将以短信方式发送至保洁员";
  const sendMmsTips_2 = "是否发送？";
  const delTips = "确定删除信息？";
  export default {
    name: 'employeeManage',
    data () {
      return {
        modal_loading: false,
        oprType:false,
        pageNum:12,
        current:1,
        roomList:[],
        totalCount:0,
        totalCardCount:0,
        showLoading:false,
        searchName:"",
        searchCardName:"",
        addCardModal:false,
        addModal:false,
        modalTitle:'',
        cardNameText:'暂不分配',
        titles:['可选房间','已选房间'],
        ruleCardForm:{
          id:'',
          name:'',
          remarks:''
        },
        ruleForm:{
          id:'',
          name:'',
          phone:'',
          cardId:'',
          cardName:'',
          needPass:false,
          needPassGroup:'暂不生成',
          rooms:'',
          userId:''
        },
        columns: [
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '管理房间',
            align: 'center',
            key: 'room_num'
          },
          {
            title: '开门密码',
            align: 'center',
            render: (h, params) => {
              if(params.row.pass_id){
                return h('div', [
                  h('a', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: (index) => {
                        this.sendMms(params)
                      }
                    }
                  }, '发送密码'),
                ]);
              }else{
                return h('div', [
                  h('span', '未分配'),
                ]);
              }
            }
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params,'userList')
                    }
                  }
                }, '编辑'),
                h('a', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        cardColumns: [
          {
            title: '门卡名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '备注',
            align: 'center',
            key: 'remarks'
          },
          {
            title: '操作',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params,'cardList')
                    }
                  }
                }, '编辑'),
                h('a', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeCard(params)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        data: [],
        dataCard: [],
        dataCardList:[],
        dataRoom: [],
        targetKeys:[],
        listStyle: {
          width: '180px',
        }
      }
    },
    created(){
      this.init();
      this.getCardList();
      this.getRoomList();
    },
    methods:{
      search(){
        this.init();
      },
      searchCard(){
        this.initCard();
      },
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          name:this.searchName
        };
        //console.log(this.$utils.clearData(params));
        this.showLoading = true;
        this.$api.get("/proxy/user/employee/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.data = data.list;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      initCard(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          name:this.searchCardName
        };
        this.showLoading = true;
        this.$api.get("/proxy/passport/card/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.dataCard = data.list;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      getRoomList(){
        var params = {
          page:1,
          num:10000
        };
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          var room = [];
          for(var i=0;i<data.list.length;i++){
            room.push({"key": data.list[i].id, "groupName": data.list[i].group_level1_name, 'label': data.list[i].room_no});
          }
          this.dataRoom = room;
        });
      },
      renderTrans(item) {
        return item.label + "("+item.groupName+")";
      },
      getCardList(){
        var params = {
          page:1,
          num:10000
        };
        this.showLoading = true;
        this.$api.get("/proxy/passport/card/list", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.dataCardList = data;
        });
      },
      clkTab(event){
        if(event == "userList"){
          this.init();
        }
        if(event == "cardList"){
          this.initCard();
        }
      },
      selCard(event,id){
        this.cardNameText = event.target.innerText;
        this.ruleForm.cardId = id;
        this.ruleForm.cardName = event.target.innerText;
      },
      selNeedPass(event){
        this.ruleForm.needPass = event.currentTarget.getAttribute("data-name");
      },
      saveCard(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            var data = this.ruleCardForm;
            this.$api.postQs('/proxy/passport/card/update', this.$utils.clearData(data) ,res => {
              this.$Message.success(res.data.desc);
              this.$refs[name].resetFields();
              this.addCardModal = false;
              this.initCard();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      saveUser(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            var data = this.ruleForm;
            console.log(this.ruleForm.id);
            var url = "";
            if(this.ruleForm.id){
              url = "/proxy/user/employee/update";
            }else {
              url = "/proxy/user/employee/add";
            }
            this.$api.postQs(url, this.$utils.clearData(data) ,res => {
              this.$Message.success(res.data.desc);
              this.$refs[name].resetFields();
              this.addModal = false;
              this.init();
            },res => {
              this.$Message.error(res.data.desc);
            },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      remove(item){
        var _self = this;
        this.$Modal.confirm({
          title: '删除信息',
          content: "<div class='font-15'>" + delTips +"</div>",
          onOk: () => {
            var data = {
              userId: item.row.id
            };
            _self.$api.postQs("/proxy/user/employee/delete", this.$utils.clearData(data) ,res => {
              this.$Message.success(res.data.desc);
              this.init();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      removeCard(item){
        var _self = this;
        this.$Modal.confirm({
          title: '删除信息',
          content: "<div class='font-15'>" + delCardTips + "<span class='text-green'>["+item.row.name+"]</span>" + "</div>",
          onOk: () => {
            var data = {
              id: item.row.id
            };
            _self.$api.postQs("/proxy/passport/card/delete", this.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              this.initCard();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      chgModal(status) {
        if(!status){
          this.closeModal();
        };
      },
      closeModal() {
        this.ruleCardForm = {
          name:'',
          remarks:''
        }
        this.ruleForm = {
          id:'',
          name:'',
          phone:'',
          cardId:'',
          cardName:'',
          needPass:false,
          needPassGroup:'暂不生成',
          rooms:"",
          userId:'',
        };
        this.targetKeys = [];
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addCardModal = false;
        this.addModal = false;
        this.closeModal();
      },
      show(item,type){
        if(type == 'cardList'){
          this.modalTitle = "编辑门卡";
          this.ruleCardForm.name = item.row.name;
          this.ruleCardForm.id = item.row.id;
          this.ruleCardForm.remarks = item.row.remarks;
          this.addCardModal = true;
        }

        if(item == null && type == 'userList'){
          this.modalTitle = "添加保洁人员";
          this.getRoomList();
          this.addModal = true;
        }
        if(item && type == 'userList'){
          this.modalTitle = "编辑保洁人员";
          this.$api.postQs("/proxy/user/employee/info", {userId:item.row.id} ,res => {
            var data = res.data.data;
            var rooms = [];
            var roomsStr = "";
            for(var i=0;i<data.roomList.length;i++){
              rooms.push(data.roomList[i].id);
              roomsStr += data.roomList[i].id + ",";
            }
            //console.log(data);
            this.ruleForm = {
              id:data.id,
              name:data.name,
              phone:data.phone,
              cardId:data.cardId,
              cardName:data.cardName,
              rooms: (roomsStr.substring(roomsStr.length-1)==',')?roomsStr.substring(0,roomsStr.length-1):roomsStr,
              userId:data.id,
              //needPass:false,
              needPassGroup:'暂不生成',
            };
            console.log(data.cardName);
            this.cardNameText = !data.cardName ? '暂不分配' : data.cardName;
            this.targetKeys = rooms;

            if(data.passId){
              this.oprType = true;
            }else{
              this.oprType = false;
              this.ruleForm.needPassGroup = '暂不生成';
              this.ruleForm.needPass = false;
            }
            console.log(this.ruleForm);
            this.addModal = true;
          },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
        }
      },
      sendMms(params){
        var _self = this;
        this.$Modal.confirm({
          title: '发送信息',
          content: "<div class='font-15'>" + sendMmsTips_1 + "<span class='text-green'>["+params.row.name+"]</span>" + sendMmsTips_2 + "</div>",
          onOk: () => {
            var data = {
              userId: params.row.id
            };
            _self.$api.postQs("/proxy/user/employee/pass/send", this.$utils.clearData(data) ,res => {
              this.$Message.success(res.data.desc);
              this.initCard();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      handleChange(newTargetKeys, direction, moveKeys) {
        console.log(newTargetKeys);
        console.log(direction);
        console.log(moveKeys);
        var rooms = "";
        this.targetKeys = newTargetKeys;
        for(var i=0;i<newTargetKeys.length;i++){
          rooms += newTargetKeys[i] + ",";
        }
        this.ruleForm.rooms = (rooms.substring(rooms.length-1)==',')?rooms.substring(0,rooms.length-1):rooms;
      }
    }
  }
</script>
<style>

</style>
