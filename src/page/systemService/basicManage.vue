<template>
  <div>
    <div class="right-content-title">
      <span>系统维护</span>
      <span> > </span>
      <span>基础信息</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15" style="position: relative">
      <Spin fix v-if="showLoading" class="table-loading">
        <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
        <div class="text-green">Loading</div>
      </Spin>

      <div class="pull-left">
        <Form :label-width="120" :model="ruleForm" ref="ruleForm" style="position: relative">
          <FormItem label="组织名称:" prop="name" :rules="$filter_rules({required:true})">
            <span v-if="!editStatus && ruleForm.name == ''">暂无数据</span>
            <span v-else-if="!editStatus && ruleForm.name != ''">{{ruleForm.name}}</span>
            <Input v-if="editStatus" v-model="ruleForm.name" placeholder="" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="地址:" prop="address" :rules="$filter_rules({required:true})">
            <span v-if="!editStatus && ruleForm.address == ''">暂无数据</span>
            <span v-else-if="!editStatus && ruleForm.address != ''">{{ruleForm.address}}</span>
            <Input v-if="editStatus" type="textarea" :rows="2" v-model="ruleForm.address" placeholder="" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="联系人:" prop="contacts" :rules="$filter_rules({required:true})">
            <span v-if="!editStatus && ruleForm.contacts == ''">暂无数据</span>
            <span v-else-if="!editStatus && ruleForm.contacts != ''">{{ruleForm.contacts}}</span>
            <Input v-if="editStatus" v-model="ruleForm.contacts" placeholder="" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="联系电话:" prop="phone" :rules="$filter_rules({required:true})">
            <span v-if="!editStatus && ruleForm.phone == ''">暂无数据</span>
            <span v-else-if="!editStatus && ruleForm.phone != ''">{{ruleForm.phone}}</span>
            <Input v-if="editStatus" v-model="ruleForm.phone" placeholder="" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="管理员开锁密码:" prop="captcha" :rules="$filter_rules({required:true})">
            <Button type="success" v-if="!chgPwd" @click="chgLockPwd()">更换</Button>
            <div v-if="chgPwd">
              <div>
                <span>请输入管理员关联手机</span>
                <span class="text-green">{{adminPhone}}</span>
                <span>接收到的验证码</span>
              </div>
            </div>
            <div v-if="chgPwd">
              <Input v-model="ruleForm.captcha" placeholder="" style="width: 200px"></Input>
              <Button type="ghost">获取验证码</Button>
              <Button type="success">提交</Button>
            </div>
          </FormItem>
        </Form>
      </div>
      <div class="pull-left" style="margin-left:15px;">
        <Button type="success" class="basic-edit-btn" v-if="!editStatus" @click="edit()">编辑</Button>
        <Button type="success" class="basic-edit-btn" v-if="editStatus" :loading="loading" @click="save('ruleForm')">
          <span v-if="!loading">保存</span>
          <span v-else></span>
        </Button>

        <Button type="ghost" class="basic-edit-btn-cancel" v-if="editStatus" @click="cancel('ruleForm')">取消</Button>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'employeeManage',
    data () {
      return {
        editStatus:false,
        chgPwd:false,
        showLoading:false,
        loading:false,
        adminPhone:'',
        ruleForm: {
          franchiseeId:'',
          name: '',
          contacts: '',
          phone: '',
          address: '',
          captcha: '',
        },
        columns: [
          {
            title: '姓名',
            align: 'center',
            key: 'username'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '管理房间',
            align: 'center',
            key: 'rooms'
          },
          {
            title: '开门密码',
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
                    click: (index) => {

                    }
                  }
                }, '发送密码'),
              ]);
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
                      this.show(params.index)
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
        data: []
      }
    },
    created(){
      //this.init();
    },
    methods:{
      init(){
        this.showLoading = true;
        this.$api.postQs("/proxy/franchisee/get", {} ,res => {
          var data = Object.assign({}, res.data.data);
          this.ruleForm.name= data.name;
          this.ruleForm.address= data.address;
          this.ruleForm.contacts= data.contacts;
          this.ruleForm.phone= data.phone;
          this.ruleForm.franchiseeId = data.franchiseeId;
          this.adminPhone = data.phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
          this.showLoading = false;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      edit(){
        this.editStatus = true;
      },
      save(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var params = Object.assign({}, this.ruleForm);
            this.$api.postQs("/proxy/franchisee/update", params ,res => {
              this.$Message.success(res.data.desc);
              this.init();
              this.loading = false;
              this.editStatus = false;
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      cancel(formName){
        this.editStatus = false;
        this.init();
        this.$refs[formName].resetFields();
      },
      chgLockPwd(){
        this.chgPwd = true;
      }
    }
  }
</script>
<style>

</style>
