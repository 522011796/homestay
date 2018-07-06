<template>
  <div style="position: relative">
    <Spin fix v-if="showLoading" class="table-loading">
      <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
      <div class="text-green">Loading</div>
    </Spin>
    <div class="right-content-title">
      <span>系统维护</span>
      <span> > </span>
      <span>系统日志</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15" style="position: relative">
      <Dropdown trigger="click">
        <Button type="default">
          {{searchUserType}}
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list" style="width: 100%;height:120px;overflow-y: auto">
          <DropdownItem @click.native="selUserType($event,'')">全部</DropdownItem>
          <DropdownItem @click.native="selUserType($event,'40')">保洁员</DropdownItem>
          <DropdownItem @click.native="selUserType($event,'50')">客人</DropdownItem>
          <DropdownItem @click.native="selUserType($event,'20')">管理员</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown trigger="click">
        <Button type="default">
          {{searchGroupText}}
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list" style="width: 100%;height:120px;overflow-y: auto">
          <DropdownItem @click.native="selGroup($event,'')">全部</DropdownItem>
          <DropdownItem v-for="(item,index) in groupList.list" :key="index" :data-name="item.name" @click.native="selGroup($event,item.id)">{{item.name}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown trigger="click">
        <Button type="default">
          {{searchRoomText}}
          <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list" style="width: 100%;height:120px;overflow-y: auto">
          <DropdownItem @click.native="selRoom($event,'')">全部</DropdownItem>
          <DropdownItem v-for="(item,index) in roomList.list" :key="index" :data-name="item.name" @click.native="selRoom($event,item.room_no)">{{item.room_no}}({{item.group_level1_name}})</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="selStartTime($event)" style="width: 150px"></DatePicker>
      <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束时间" :options="optionsEnd" @on-change="selEndTime($event)" style="width: 150px"></DatePicker>
      <Input placeholder="请输入姓名" v-model="searchData.key" class="w100"></Input>
      <Button type="success" @click=search()>搜索</Button>
      <div class="margin-top10">
        <Table :columns="columns" :data="data" class="margin-top10"></Table>
      </div>
      <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {
        modal_loading: false,
        roomList:[],
        showLoading:false,
        userSearch:"",
        orderStatus:"",
        orderStatusText:'状态',
        orderChannel:"",
        orderChannelText:'渠道来源',
        searchUserType:'请选择角色',
        searchGroupText:'请选择分组',
        groupList:[],
        searchRoomText:'请选择房间号',
        roomList:[],
        orderPayType:'',
        orderPayTypeText:'支付类型',
        totalCount:0,
        current:1,
        pageNum:12,
        orderList:[],
        searchData:{
          userType:'',
          groupLevel1Id:'',
          roomNo:'',
          openTimeBegin:'',
          openTimeEnd:'',
          key:''
        },
        columns: [
          {
            title: '房号',
            align: 'center',
            key: 'room_no'
          },
          {
            title: '分组',
            align: 'center',
            key: 'room_group_name'
          },
          {
            title: '开门时间',
            align: 'center',
            key: 'open_time'
          },
          {
            title: '人员',
            align: 'center',
            key: 'real_name'
          },
          {
            title: '角色',
            align: 'center',
            key: 'user_type'
          },
          {
            title: '开门方式',
            align: 'center',
            key: 'oen_type'
          }
        ],
        data:[],
        optionsEnd: {
          disabledDate (date) {
            return false;
          }
        }
      }
    },
    created(){
      this.init();
      this.getGroupList();
      this.getRoomList();
    },
    methods:{
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          userType:this.searchData.userType,
          groupLevel1Id:this.searchData.groupLevel1Id,
          roomNo:this.searchData.roomNo,
          openTimeBegin:this.searchData.openTimeBegin,
          openTimeEnd:this.searchData.openTimeEnd,
          key:this.searchData.key
        };
        this.showLoading = true;
        this.$api.get("/proxy/log/openLog/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.data = data.list;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      getGroupList(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/group/page", params ,res => {
          this.groupList = res.data.data;
        });
      },
      getRoomList(){
        var params = {
          page:1,
          num:10000
        };
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomList = data;
        });
      },
      selUserType(event,type){
        this.searchData.userType = type;
        this.searchUserType = event.target.innerText;
        this.init();
      },
      selGroup(event,id){
        this.searchData.groupLevel1Id = id;
        this.searchGroupText = event.target.innerText;
        this.init();
      },
      selRoom(event,roomNo){
        this.searchData.roomNo = roomNo;
        this.searchRoomText = event.target.innerText;
        this.init();
      },
      selStartTime(event){
        this.searchData.openTimeBegin = event;
        this.optionsEnd = {
          disabledDate(date){
            var dateStart = new Date(event);
            return date && date.valueOf() < (dateStart);
          }
        };
      },
      selEndTime(event){
        this.searchData.openTimeEnd = event;
      },
      endTime(date){
        console.log(1);
      },
      search(){
        this.init();
      }
    }
  }
</script>
<style>

</style>
