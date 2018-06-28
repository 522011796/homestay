<template>
  <div>
    <Tabs value="name1">
      <TabPane label="房间列表" name="name1">
        <div class="padding-top0-lr25">
          <Button type="success" icon="plus" @click="show()">
            添加房间
          </Button>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              请选择分组
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list" style="width: 100%">
              <DropdownItem>驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              请选择房型
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              请选择房态
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown trigger="click" class="margin-top0-lr8">
            <Button type="default">
              请选择门锁状态
              <Icon type="arrow-down-b"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem>驴打滚</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input placeholder="请输入房间号" class="w150"></Input>
          <Button type="success">搜索</Button>
          <Button>清除</Button>

          <Table :columns="columns" :data="data" class="margin-top10"></Table>
        </div>
      </TabPane>
      <!--分组管理-->
      <TabPane label="分组管理" name="name2">
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

          <Card class="room-card-list" v-for="(item,index) in types" :key="index">
            <div class="room-card-list-block">
              <div class="room-card-list-info">
                <div class="room-card-list-num">12</div>
                <div class="room-card-list-text">温江</div>
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
      <TabPane label="房间类型" name="name3">
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
                <div class="room-card-list-num">12</div>
                <div class="room-card-list-text">大床房</div>
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
      <TabPane label="房间特性" name="name4">
        <div class="padding-tb10-lr25">
          <!--<Button type="primary" icon="plus">
            添加特性
          </Button>
          <Button v-for="(item,index) in tags" :key="index" type="success" style="position: relative;width: 60px">
            {{item.tag}}
            <i class=" fa fa-close type-close"></i>
          </Button>-->
          <Button type="success" icon="plus">
            添加特性
          </Button>
          <Tag type="dot" closable color="green" v-for="(item,index) in tags" :key="index" style="position: relative;">
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
  export default {
    name: 'roomManage',
    data () {
      return {
        modal_loading: false,
        modalTitle:'添加房间',
        roomTypeText:'请选择房型',
        columns: [
          {
            title: '房间号',
            align: 'center',
            key: 'roomNo'
          },
          {
            title: '分组',
            align: 'center',
            key: 'area'
          },
          {
            title: '房型',
            align: 'center',
            key: 'type'
          },
          {
            title: '特性',
            align: 'center',
            key: 'tags'
          },
          {
            title: '门锁',
            align: 'center',
            key: 'lock'
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
        data: [
          {
            roomNo: 'John Brown',
            area: 18,
            type:'大床房',
            tags: '朝阳',
            lock: 'lock1',
            opr: ''
          }
        ],
        addModal: false,
        ruleForm: {
          username: '',
          roomGroup:'',
          roomType: '',
          roomTags: []
        },
        tags:[{
          tag:'ceshi'
        }],
        types:[
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          },
          {
            name:'type'
          }
        ]
      }
    },
    methods:{
      init(){
        console.log(1);
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
        console.log(status);
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
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addModal = false;
      }
    }
  }
</script>
<style>

</style>
