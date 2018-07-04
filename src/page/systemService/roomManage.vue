<template>
  <div style="position: relative">
    <Spin fix v-if="showLoading" class="table-loading">
      <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
      <div class="text-green">Loading</div>
    </Spin>
    <Tabs @on-click="clkTab($event)">
      <TabPane label="房间列表" name="roomList">
        <div class="padding-top0-lr25">
          <Button type="success" icon="plus" @click="show()">
            添加房间
          </Button>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              {{searchRoomGroup}}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%;height:120px;overflow-y: auto">
              <DropdownItem v-for="(item,index) in groups.list" :key="index" :data-name="item.name" @click.native="selGroup($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              {{searchRoomType}}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in types" :key="index" :data-name="item.name" @click.native="selType($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              {{searchRoomTags}}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in tags" :key="index" :data-name="item.name" @click.native="selTag($event,item.id)">{{item.tag}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              {{searchRoomLocks}}
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem  @click.native="selLocks($event,'online')">正常</DropdownItem>
              <DropdownItem  @click.native="selLocks($event,'offline')">异常</DropdownItem>
              <DropdownItem  @click.native="selLocks($event,'lowpwr')">电量低</DropdownItem>
              <DropdownItem  @click.native="selLocks($event,'none')">未添加</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input placeholder="请输入房间号" class="w150" v-model="roomNo"></Input>
          <Button type="success" @click="search()">搜索</Button>
          <Button @click="clearSearch()">清除</Button>

          <Table :columns="columns" :data="data" class="margin-top10"></Table>
          <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
        </div>
      </TabPane>
      <!--分组管理-->
      <TabPane label="分组管理" name="groupList">
        <div class="padding-tb10-lr25">
          <Card class="room-card-block">
            <div class="room-card-info">
              <div>
                <a href="javascript:;">
                  <Icon type="plus" size="35"/>
                </a>
              </div>
              <div>
                添加分组
              </div>
            </div>
          </Card>

          <Card class="room-card-list" v-for="(item,index) in groups.list" :key="index">
            <div class="room-card-list-block">
              <div class="room-card-list-info">
                <div class="room-card-list-num">{{item.room_num}}</div>
                <div class="room-card-list-text">{{item.name}}</div>
              </div>
              <div class="room-card-list-opr">
                <row>
                  <Col span="12" style="text-align: center">
                  <a href="javascript:;">编辑</a>
                  </Col>
                  <Col span="12" style="text-align: center">
                  <a href="javascript:;">删除</a>
                  </Col>
                </row>
              </div>
            </div>
          </Card>
        </div>
      </TabPane>
      <!--房间类型-->
      <TabPane label="房间类型" name="typeList">
        <div class="padding-tb10-lr25">
          <Card class="room-card-block">
            <div class="room-card-info">
              <a href="javascript:;">
                <div>
                  <a href="javascript:;">
                    <Icon type="plus" size="35"/>
                  </a>
                </div>
                <div>
                  添加房型
                </div>
              </a>
            </div>
          </Card>

          <Card class="room-card-list" v-for="(item,index) in types" :key="index">
            <div class="room-card-list-block">
              <div class="room-card-list-info">
                <div class="room-card-list-num">{{item.room_num}}</div>
                <div class="room-card-list-text">{{item.name}}</div>
              </div>
              <div class="room-card-list-opr">
                <row>
                  <Col span="12" style="text-align: center">
                  <a href="javascript:;">编辑</a>
                  </Col>
                  <Col span="12" style="text-align: center">
                  <a href="javascript:;">删除</a>
                  </Col>
                </row>
              </div>
            </div>
          </Card>
          <div style="clear:both;"></div>
        </div>
      </TabPane>
      <!--房间特性-->
      <TabPane label="房间特性" name="tagsList">
        <div class="padding-tb10-lr25">
          <Button type="success" icon="plus">
            添加特性
          </Button>
          <Tag type="dot" closable color="green" v-for="(item,index) in tags" :key="index" @on-close="delTags(item.id,item.tag)" style="position: relative;">
            {{item.tag}}
          </Tag>
        </div>
      </TabPane>
    </Tabs>

    <Modal
      :styles="{top: '65px'}"
      v-model="addModal"
      title=""
      @on-visible-change = "chgModal">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleForm" ref="ruleForm" :label-width="80" style="width: 60%;margin:0 auto;">
        <FormItem label="房间号" prop="roomNo" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.roomNo" placeholder="" class="w200"></Input>
        </FormItem>
        <FormItem label="房间分组" prop="groupLevel1Name" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.groupLevel1Name" style="display: none"></Input>
          <Dropdown trigger="custom" :visible="visibleGroup" class="w200" @on-clickoutside="closeOutSide()">
            <Button type="default" class="dropdown-align-100" @click="handleOpenGroup">
              {{roomGroupText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem v-for="(item,index) in groups.list" :key="index" :data-name="item.id" :data-text="item.name" @click.native="selRoomGroup($event)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房型" prop="roomType" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.roomType" style="display: none"></Input>
          <Dropdown trigger="custom" :visible="visibleType" class="w200" @on-clickoutside="closeOutSide()">
            <Button type="default" class="dropdown-align-100" @click="handleOpenType">
              {{roomTypeText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem v-for="(item,index) in types" :key="index" :data-name="item.id" :data-text="item.name" @click.native="selRoomType($event)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房间特性" prop="roomTags">
          <Dropdown trigger="custom" :visible="visibleTags" class="w200" @on-clickoutside="closeOutSide()">
            <Button type="default" class="dropdown-align-100" @click="handleOpenTags">
              {{roomTagsText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem style="background: #ffffff">
                <!--<div v-for="(item,index) in tags" :key="index">
                  <Checkbox v-model="item.id" :data-name="item.id" :label="item.tag" @on-change="selTagBox($event,item.id,item.tag)">{{item.tag}}</Checkbox>
                </div>-->
                <CheckboxGroup v-model="allCheckBox">
                  <div v-for="(item,index) in tags" :key="index">
                    <Checkbox :data-name="item.id" :label="item.tag" @change.native="selTagBox($event,item.id,item.tag)">{{item.tag}}</Checkbox>
                  </div>
                </CheckboxGroup>
                <div class="line"></div>
                <div>
                  <Button type="dashed" long size="small" icon="plus-round" class="text-left">添加特性</Button>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="save('ruleForm')">保存</Button>
        <Button type="ghost" @click="handleReset('ruleForm')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  const delTagsTips = "你确定要删除特性";
  const delRoomTips = "你确定要删除房间";
  export default {
    name: 'roomManage',
    data () {
      return {
        modal_loading: false,
        visibleGroup: false,
        visibleType: false,
        visibleTags: false,
        allCheckBox:[],
        roomNo:'',
        groupId:'',
        roomTypeId:'',
        lockStatus:'',
        pageNum:12,
        current:1,
        totalCount:0,
        showLoading:false,
        tagList:[],
        modalTitle:'添加房间',
        roomTypeText:'请选择房型',
        roomGroupText:'请选择分组',
        searchRoomType:'请选择房型',
        searchRoomGroup:'请选择分组',
        searchRoomTags:'请选择特性',
        searchRoomLocks:'请选择门锁状态',
        roomTagsText:'请选择特性',
        searchName:'',
        roomNo:'',
        groupId:'',
        roomTypeId:'',
        lockStatus:'',
        roomTagIds:'',
        columns: [
          {
            title: '房间号',
            align: 'center',
            key: 'room_no'
          },
          {
            title: '分组',
            align: 'center',
            key: 'group_level1_name'
          },
          {
            title: '房型',
            align: 'center',
            key: 'room_type'
          },
          {
            title: '特性',
            align: 'center',
            //key: 'room_tags'
            render: (h, params) => {
              var data = JSON.parse(params.row.room_tags);
              var list = this.tags;
              if(data.length == 0){
                return h('span','--');
              }else{
                return h('span',list.map(function (list,indexList) {
                  return h('span',data.map(function (data,index) {
                    if(data == list.id){
                      return h(
                        'label',
                        {
                          class:{roomTagName:true}
                        },
                        list.tag.length <= 4 ? list.tag : list.tag.substring(0,4)+'...'
                      )
                    }
                  }))
                }))
              }
            }
          },
          {
            title: '门锁',
            align: 'center',
            //key: 'locks'
            render: (h, params) => {
              var locks = params.row.locks;
              if(locks.length == 0){
                return h('span',{style:{color:'#f16a6a'}},'未安装门锁');
              }else{
                for(var i=0;i<locks.length;i++){
                  var battery = JSON.parse(locks[i].battery);
                  if(locks[i].status != 0){
                    return h('span',{style:{color:'#f16a6a'}},
                      异常
                    );
                  }else{
                    if(locks[i].olStatus != 0){
                      return h('div',{style:{color:'#f16a6a'}},
                        网络异常
                      );
                    }else{
                      if(battery.percent <= 10){
                        return h('div',{style:{color:'#f16a6a'}},
                          locks[i].identify + "("+ "电量:" +battery.percent+ "%" +")"
                        );
                      }else{
                        return h('div',
                          locks[i].identify + "("+ "电量:" +battery.percent+ "%" +")"
                        );
                      }
                    }
                  }
                }
              }
            }
          }
          ,
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
                      this.edit(params)
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
        data: [],
        addModal: false,
        ruleForm: {
          id:'',
          roomNo: '',
          roomType: '',
          roomTypeId: '',
          groupLevel1Id: '',
          groupLevel2Id: 0,
          groupLevel1Name:'',
          roomTags: [],
          roomTagIds: '',
          roomTagNames:[]
        },
        tags:[],
        types:[],
        groups:[]
      }
    },
    created(){
      this.init();
      this.getGroupList();
      this.getTypeList();
      this.getTagList();
    },
    methods:{
      clkTab(event){
        if(event == "roomList"){
          this.init();
          this.getGroupList();
          this.getTypeList();
          this.getTagList();
        }
        if(event == "groupList"){
          this.getGroupList();
        }
        if(event == "typeList"){
          this.getTypeList();
        }
        if(event == "tagsList"){
          this.getTagList();
        }
      },
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          roomNo:this.roomNo,
          groupId:this.groupId,
          roomTypeId:this.roomTypeId,
          lockStatus:this.lockStatus,
          roomTagIds:this.roomTagIds
        };
        //console.log(this.$utils.clearData(params));
        this.showLoading = true;
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.data = data.list;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      search(){
        this.init();
      },
      getRoomTag(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          var data = res.data.data;
          this.tagList = data;
        });
      },
      getTagList(){
        var params = {page:1,num:999};
        this.showLoading = true;
        this.$api.get("/proxy/room/tag/list", params ,res => {
          this.tags = res.data.data;
          this.showLoading = false;
        });
      },
      delTags(id,tagName){
        var _self = this;
        this.$Modal.confirm({
          title: '删除信息',
          content: "<div class='font-15'>"+delTagsTips+"<span class='text-green'>["+tagName+"]</span>" + "</div>",
          onOk: () => {
            var params = {id:id};
            _self.$api.postQs("/proxy/room/tag/delete", _self.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              _self.getTagList();
              //this.$Modal.remove()
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      getTypeList(){
        var params = {page:1,num:999};
        this.showLoading = true;
        this.$api.get("/proxy/room/type/list", params ,res => {
          this.types = res.data.data;
          this.showLoading = false;
        });
      },
      getGroupList(){
        var params = {page:1,num:999};
        this.showLoading = true;
        this.$api.get("/proxy/room/group/page", params ,res => {
          this.groups = res.data.data;
          this.showLoading = false;
        });
      },
      show (index) {
        this.modalTitle = "添加房间";
        this.addModal = true;
        this.ruleForm = this.ruleForm;
      },
      edit (params) {
        this.modalTitle = "编辑房间";
        this.allCheckBox = [];
        this.ruleForm.roomTags = [];
        this.ruleForm = {
          id:params.row.id,
          roomNo: params.row.room_no,
          roomType: params.row.room_type,
          roomTypeId: params.row.room_type_id,
          groupLevel1Id: params.row.group_level1_id,
          groupLevel2Id: 0,
          groupLevel1Name:params.row.group_level1_name,
          roomTags: JSON.parse(params.row.room_tags),
          roomTagIds: '',
          roomTagNames:[]
        };
        this.roomGroupText = params.row.group_level1_name;
        this.roomTypeText = params.row.room_type;

        var roomTags = JSON.parse(params.row.room_tags);
        for(var i=0;i<this.tags.length;i++){
          for(var k=0;k<roomTags.length;k++){
            if(this.tags[i].id == roomTags[k] && k < 2){
              this.ruleForm.roomTagNames.push(this.tags[i].tag);
            }
            if(this.tags[i].id == roomTags[k]){
              this.allCheckBox.push(this.tags[i].tag);
            }
          }
        }
        this.roomTagsText = this.ruleForm.roomTagNames == 0 ? this.roomTagsText : this.ruleForm.roomTagNames;
        this.addModal = true;
      },
      remove (event) {
        var _self = this;
        this.$Modal.confirm({
          title: '删除信息',
          content: "<div class='font-15'>"+delRoomTips+"<span class='text-green'>["+event.row.room_no+"]</span>" + "</div>",
          onOk: () => {
            var params = {id:event.row.id};
            _self.$api.postQs("/proxy/room/delete", _self.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              //_self.$Modal.remove();
              _self.init();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      ok () {
        this.$Message.info('Clicked ok');
      },
      cancel () {
        this.$Message.info('Clicked cancel');
      },
      chgModal(status) {
        //console.log(status);
      },
      selRoomType(event){
        this.ruleForm.roomTypeId = event.currentTarget.getAttribute("data-name");
        this.roomTypeText = event.currentTarget.getAttribute("data-text");
        this.visibleType = false;
        this.ruleForm.roomType = event.currentTarget.getAttribute("data-text");

      },
      selRoomGroup(event){
        this.ruleForm.groupLevel1Id = event.currentTarget.getAttribute("data-name");
        this.roomGroupText = event.currentTarget.getAttribute("data-text");
        this.visibleGroup = false;
        this.ruleForm.groupLevel1Name = event.currentTarget.getAttribute("data-text");;
      },
      save (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            var data = this.ruleForm;
            var ids = "";
            for(var i=0;i<this.ruleForm.roomTags.length;i++){
              ids += this.ruleForm.roomTags[i] + ",";
            }
            this.ruleForm.roomTags = JSON.stringify(this.ruleForm.roomTags);
            this.ruleForm.roomTagIds = (ids.substring(ids.length-1)==',')?ids.substring(0,ids.length-1):ids;
            var params = Object.assign({}, data);
            console.log(params);
            var url = "";
            if(this.ruleForm.id != ""){
              url = "/proxy/room/update";
            }else{
              url = "/proxy/room/add";
            }
            this.$api.postQs(url, this.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              this.$refs[name].resetFields();
              this.addModal = false;
              this.allCheckBox = [];
              this.init();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        })
      },
      selGroup(event,id){
        this.groupId = id;
        this.searchRoomGroup = event.target.innerText;
        this.init();
      },
      selType(event,id){
        this.roomTypeId = id;
        this.searchRoomType = event.target.innerText;
        this.init();
      },
      selTag(event,id){
        this.roomTagIds = id;
        this.searchRoomTags = event.target.innerText;
        this.init();
      },
      selLocks(event,status){
        this.lockStatus = status;
        this.searchRoomLocks = event.target.innerText;
        this.init();
      },
      selTagBox(event,id,name){
        console.log(event);
        if(event.target.checked){
          this.ruleForm.roomTags.push(id);
          if(this.ruleForm.roomTags.length < 4){
            this.ruleForm.roomTagNames.push(name.length <= 4 ? name : name.substring(0,4)+'...');
          }
        }
        if(!event.target.checked){
          for(var i = 0;i < this.ruleForm.roomTags.length; i++){
            if(this.ruleForm.roomTags[i] == id){
              this.ruleForm.roomTags.splice(i,1);
            }
          }
          this.ruleForm.roomTagNames = this.allCheckBox;
        }
        if(this.ruleForm.roomTags.length == 0){
          this.roomTagsText = '';
        }else{
          this.roomTagsText = this.ruleForm.roomTagNames;
        }
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addModal = false;
        this.closeModal();
      },
      handleOpenGroup(){
        this.visibleGroup = true;
      },
      handleOpenType(){
        this.visibleType = true;
      },
      handleOpenTags(){
        this.visibleTags = true;
      },
      isChecked(id){
        var id = JSON.parse(id);
        return true;
      },
      closeOutSide(){
        this.visibleGroup = false;
        this.visibleTags = false;
        this.visibleType = false;
      },
      clearSearch(){
        this.roomTypeId = "";
        this.roomTagIds = "";
        this.lockStatus = "";
        this.groupId = "";
        this.roomNo = "";
        this.searchRoomGroup = "请选择分组";
        this.searchRoomType = "请选择房型";
        this.searchRoomTags = "请选择特性";
        this.searchRoomLocks = "请选择门锁状态";
        this.init();
      },
      closeModal(){
        this.roomGroupText = "请选择分组";
        this.roomTypeText = "请选择房型";
        this.roomTagsText = "请选择特性";
        this.ruleForm = {
          id:'',
          roomNo: '',
          roomType: '',
          roomTypeId: '',
          groupLevel1Id: '',
          groupLevel2Id: 0,
          groupLevel1Name:'',
          roomTags: [],
          roomTagIds: '',
          roomTagNames:[]
        }
      }
    }
  }
</script>
<style>

</style>
