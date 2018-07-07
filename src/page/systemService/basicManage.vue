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

      <div class="pull-left" style="position: relative">
        <div style="position: absolute;left:350px;z-index: 2">
          <Button type="success" class="basic-edit-btn" v-if="!editStatus" @click="edit()">编辑</Button>
          <Button type="success" class="basic-edit-btn" v-if="editStatus" :loading="loading" @click="save('ruleForm')">
            <span v-if="!loading">保存</span>
            <span v-else></span>
          </Button>

          <Button type="ghost" class="basic-edit-btn-cancel" v-if="editStatus" @click="cancel('ruleForm')">取消</Button>
        </div>
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
        </Form>

        <Form :label-width="120" :model="ruleTimeForm" ref="ruleTimeForm" style="position: relative">
          <FormItem label="默认退房时间:">
            <span v-if="!editTimeStatus">{{ruleTimeForm.defaultOutTime}}</span>
            <TimePicker v-if="editTimeStatus" format="HH:mm" :steps="[1,100]" type="time" placeholder="Select time" @on-change="selTime($event)" :value="ruleTimeForm.defaultOutTime" style="width: 80px"></TimePicker>
            <Button type="success" v-if="!editTimeStatus" @click="editTime()">编辑</Button>
            <Button type="success" v-if="editTimeStatus" @click="saveTime()">保存</Button>
            <Button type="ghost" v-if="editTimeStatus" @click="cancelTime()">取消</Button>
            <!--<Input v-if="editStatus" v-model="ruleForm.defaultOutTime" placeholder="" style="width: 200px"></Input>-->
          </FormItem>
        </Form>

        <Form v-if="setCaptcha" :label-width="120" :model="ruleCaptchaForm" ref="ruleCaptchaForm" style="position: relative">
          <FormItem label="管理员开锁密码:" prop="captcha" :rules="$filter_rules({required:true})">
            <Button type="success" v-if="!chgPwd" @click="chgLockPwd()">更换</Button>
            <div v-if="chgPwd">
              <div>
                <div>
                  <span>请输入管理员关联手机</span>
                  <span class="text-green">{{adminPhone}}</span>
                  <span>接收到的验证码</span>
                </div>
              </div>
              <div style="position: relative">
                <Input v-model="ruleCaptchaForm.captcha" placeholder="" style="width: 200px;"></Input>
                <Button v-if="!showTime" size="small" type="ghost" @click="getCaptcha()" style="position: absolute;right:128px;top:5px;z-index:2;">获取验证码</Button>
                <Button v-if="showTime" size="small" disabled style="position: absolute;right:128px;top:5px;z-index:2;">{{count}}s</Button>
                <Button type="success" @click="subCaptcha('ruleCaptchaForm')">提交</Button>
                <Button type="ghost" @click="cancelCaptcha('ruleCaptchaForm')">取消</Button>
              </div>
            </div>
          </FormItem>
        </Form>

        <Form v-if="setPwd" :label-width="120" :model="rulePwdForm" ref="rulePwdForm" style="position: relative">
          <FormItem label="管理员开锁密码:" prop="lockAdminPass" :rules="$filter_rules({required:true})">
            <div>
              <div>
                <span>管理员门卡和开门密码可以打开所有房间</span>
              </div>
              <div>
                <span class="pull-left w80">管理员门卡：</span>
                <div class="margin-bottom10 margin-left10">
                  <Dropdown trigger="click">
                    <Button type="ghost" href="javascript:;" class="custom-font-434343">
                      {{cardText}}
                      <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                    </Button>
                    <DropdownMenu slot="list" style="width: 100%">
                      <DropdownItem @click.native="selCard($event,'')">暂不分配</DropdownItem>
                      <DropdownItem v-for="(item,index) in cardList" :key="index"  @click.native="selCard($event,item.id)">{{item.name}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="margin-bottom10">
                <span class="pull-left w80">开门密码：</span>
                <div class="margin-left10">
                  <Input v-model="rulePwdForm.lockAdminPass" placeholder="" style="width: 100px"></Input>
                </div>
                <div class="clearfix"></div>
              </div>
              <div>
                <Button type="success" @click="subPwd('rulePwdForm')">保存</Button>
                <Button type="ghost" @click="cancelPwd('rulePwdForm')">取消</Button>
              </div>
            </div>
          </FormItem>
        </Form>
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
        setPwd:false,
        setCaptcha:true,
        showLoading:false,
        loading:false,
        adminPhone:'',
        cardText:'暂不分配',
        showTime:false,
        editTimeStatus:false,
        int:120,
        count: '',
        timer: null,
        timeText:'',
        ruleForm: {
          franchiseeId:'',
          name: '',
          contacts: '',
          phone: '',
          address: ''
        },
        ruleCaptchaForm: {
          captcha: ''
        },
        rulePwdForm: {
          lockAdminPass: '',
          ppsIds:''
        },
        ruleTimeForm:{
          franchiseeId:'',
          defaultOutTime:'12:00'
        },
        data: [],
        cardList:[]
      }
    },
    created(){
      this.init();
      this.getCards();
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
          this.ruleTimeForm.defaultOutTime = data.defaultOutTime;
          this.ruleTimeForm.franchiseeId = data.franchiseeId;
          this.showLoading = false;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      getCards(){
        var data = {page:1,num:10000};
        this.$api.get("/proxy/passport/card/list", {} ,res => {
          var data = Object.assign({}, res.data.data);
          this.cardList = data
        });
      },
      selTime(event){
        this.ruleTimeForm.defaultOutTime = event;
      },
      saveTime(){
        var params = Object.assign({}, this.ruleTimeForm);
        this.$api.postQs("/proxy/franchisee/outTime/update", params ,res => {
          this.$Message.success(res.data.desc);
          this.init();
          this.loading = false;
          this.editStatus = false;
          this.editTimeStatus = false;
          this.cancelPwd(formName);
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      selCard(event,id){
        this.cardText = event.target.innerText;
        this.rulePwdForm.ppsIds = id;
      },
      edit(){
        this.editStatus = true;
      },
      editTime(){
        this.editTimeStatus = true;
      },
      cancelTime(){
        this.editTimeStatus = false;
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
      },
      getCaptcha(){
        this.$api.get("/proxy/captcha/updLockAdminPassSms", {} ,res => {
          this.showTime = true;
          const TIME_COUNT = 5;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.showTime = true;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.showTime = false;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000)
          }
        });
      },
      subCaptcha(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {
              captcha : this.ruleCaptchaForm.captcha
            };
            this.$api.postQs("/proxy/captcha/updLockAdminPassSms/check", params ,res => {
              this.setPwd = true;
              this.setCaptcha = false;
              this.$refs[formName].resetFields();
            },res => {
              this.$Message.error(res.data.desc);
            },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      cancelCaptcha(formName){
        this.chgPwd = false;
        this.$refs[formName].resetFields();
      },
      subPwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = {
              lockAdminPass : this.rulePwdForm.lockAdminPass,
              ppsIds : this.rulePwdForm.ppsIds
            };
            this.$api.postQs("/proxy/franchisee/update/lockadminpass", params ,res => {
              this.$Message.success(res.data.desc);
              this.setPwd = true;
              this.chgPwd = false;
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      cancelPwd(formName){
        this.$refs[formName].resetFields();
        this.setPwd = false;
        this.chgPwd = false;
        this.setCaptcha = true;
        this.ruleCaptchaForm = {
          captcha: ''
        };
        this.rulePwdForm = {
          lockAdminPass: '',
            ppsIds:''
        };
        this.ruleTimeForm = {
          defaultOutTime: '',
          franchiseeId:''
        };
      }
    }
  }
</script>
<style>

</style>
