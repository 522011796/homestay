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
        <FormItem label="房间号" prop="username" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.username" placeholder="" class="w200"></Input>
        </FormItem>
        <FormItem label="房间分组" prop="mail">
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              请选择分组
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem>驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房型" prop="roomType" :rules="$filter_rules({required:true})">
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              {{roomTypeText}}
              <Input v-model="ruleForm.roomType" style="display: none"></Input>
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem data-name="1" data-text="驴打滚" @click.native="selRoomType($event)">驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房间特性" prop="roomTags">
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              请选择特性
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem style="background: #ffffff">
                <CheckboxGroup v-model="ruleForm.roomTags">
                  <div><Checkbox label="Eat"></Checkbox></div>
                  <div><Checkbox label="Eat1"></Checkbox></div>
                  <div class="line"></div>
                  <div>
                    <Button type="dashed" long size="small" icon="plus-round" class="text-left">添加特性</Button>
                  </div>
                </CheckboxGroup>
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
  export default {
    name: 'roomManage',
    data () {
      return {
        modal_loading: false,
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
        searchRoomType:'请选择房型',
        searchRoomGroup:'请选择分组',
        searchRoomTags:'请选择特性',
        searchRoomLocks:'请选择门锁状态',
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
              var list = this.tagList;
              if(data == ""){
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
                        list.tag
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
              if(!locks){
                return h('span',{style:{color:'#f16a6a'}},'未安装门锁');
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
                      this.edit(params.index)
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
                      this.remove(params.index)
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
          username: '',
          roomGroup:'',
          roomType: '',
          roomTags: []
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
              this.$Modal.remove()
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
          console.log(res.data.data);
          this.showLoading = false;
        });
      },
      show (index) {
        this.modalTitle = "添加房间";
        this.addModal = true;
      },
      edit (index) {
        this.modalTitle = "编辑房间";
        this.addModal = true;
      },
      remove (index) {
        this.data.splice(index, 1);
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
        this.ruleForm.roomType = event.currentTarget.getAttribute("data-name");
        this.roomTypeText = event.currentTarget.getAttribute("data-text");
      },
      save (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            //this.$Message.success('Success!');
            var data = Object.assign({}, this.ruleForm);
            console.log(data);
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
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addModal = false;
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
      }
    }
  }
</script>
<style>

</style>
