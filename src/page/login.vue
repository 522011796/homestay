<template>
  <div>
    <div class="h_panel">
      <div class="h_logo">
        <a href="javascript:;"></a>
      </div>
    </div>
    <div class="login_banner_panel" id="J_panel">
      <div class="wrap">
        <div class="layout_panel">
          <div class="layout" id="layout">
            <div class="nav_tabs_panel">
              <div id="nav-tabs" class="nav_tabs">
                <a class="navtab-link now" href="javascript:void(0);" data-tab="pwd">帐号登录</a><span class="line"></span>
              </div>
            </div>
            <div class="center-block" style="width: 80%">
              <Form :model="ruleForm" ref="ruleForm">
                <FormItem class="input-login-div" prop="username" :rules="$filter_rules({required:true})">
                  <Input class="input-login" v-model="ruleForm.username" placeholder="请输入账号"></Input>
                </FormItem>
                <FormItem class="input-login-div" prop="password" :rules="$filter_rules({required:true})">
                  <Input type="password" class="input-login" v-model="ruleForm.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem class="input-login-div" prop="captcha" :rules="$filter_rules({required:true})">
                  <Input class="input-login pull-left" v-model="ruleForm.captcha" style="width: 60%" placeholder="请输入验证"></Input>
                  <div class="pull-right" style="width: 36%;height:45px;">
                    <img :src="ticketImg" class="login-img" @click="changeImage()"/>
                  </div>
                  <div class="clearfix"></div>
                </FormItem>
                <FormItem>
                  <Button type="success" long size="large" :loading="loading" @click="handleSubmit('ruleForm')">
                    <span v-if="!loading">登录</span>
                    <span v-else>Loading...</span>
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <footer class="n-footer">
        <div class="container">
          <p class="text-font-white">
            <a class="text-font-white" href="http://www.netmoon.cn">网月官网</a> |
            <a class="text-font-white" href="http://www.netmoon.cn/aftersale.asp?wid=52">在线客服</a>
            辽ICP备12008717号
          </p>

          <p class="text-font-white">大连网月科技股份有限公司 © 版权所有</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        cas:'',
        casServer:'',
        loading:false,
        ticketImg:'',
        ruleForm: {
          username: '',
          password: '',
          captcha: '',
        }
      }
    },
    created(){
      this.initCfg();
      /*var testdata = {"casServer":{"host":"https://sso.9451.com","login":"/login","logout":"/logout"},"casClient":{"host":"http://192.168.11.56:8081","login":"/cas/login","logout":"/cas/logout"}}
      var data = Object.assign({}, testdata);
      this.cas = data;
      this.casServer = data.casClient.host + data.casClient.login;*/
    },
    methods:{
      urlMinusUri(){
        return window.location.protocol + "//" + window.location.host;
      },
      changeImage(){
        this.ticketImg = this.cas.casServer.host + '/captcha.jpg?random=' + Math.random();
      },
      initGetLt(){

      },
      initCfg(){
        let _self = this;
        this.$api.get('/proxy/server/cfgs', {}, res => {
          //console.log(JSON.stringify(res.data.data));
          let data = res.data;
          if(data.code == 200) {
            this.cas = data.data;
            this.casServer = data.data.casClient.host + data.data.casClient.login;
            this.changeImage();

            _self.getLt(function(res){
              if (res != null) {
                switch (res.body.code) {
                  case 200://认证服务器已经在线
                    //向应用服务器发起验证
                    var params = {
                      'ticket': res.body.data,
                      'forward': 'true'
                    };
                    _self.$api.get(_self.urlMinusUri()+_self.cas.casClient.login, params, res => {
                      switch (res.data.code) {
                        //已经是登陆成功的，跳转路由页
                        case 200:
                          console.log("登陆成功");
                          window.location = "/";
                          break;
                        case 422:
                          break;
                      }
                    });
                    break;
                }
              }
            });
          }else{
            this.$Message.success('初始化页面信息失败，请重新刷新页面！');
          }
        });
      },
      getLt(func){
        let version = "20161009";
        var params = {jsonpCallback:'jsonp'};
        this.$http.jsonp(this.cas.casServer.host + this.cas.casServer.login + "?getlt=true&service=" + this.casServer + "&version="+version, params).then(function(res){
          console.log(res);
          switch(res.code) {
            case 302:
              window.location = this.cas.casServer + this.cas.casServer.login + "?url=" + window.localtion + this.casServer + "&version=" + version;
              break;
            default:
              func(res);
          }
        });
      },
      handleSubmit (formName) {
        var _self = this;
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            _self.getLt(function (res) {
              switch (res.body.code) {
                case 200://如果已经在线则退出并重新获取lt再登陆
                  console.log(5);
                  var params = {'service': Object.assign({}, _self.cas.casClient)+'/login'};
                  console.log(params);
                  _self.$http.jsonp(_self.cas.casServer.host + _self.cas.casServer.logout, {params:params}).then(function(res){
                    console.log(6);
                    _self.getLt(function (res) {
                      _self.casLogin(res);
                    });
                  }).catch(e => {
                    // 打印一下错误
                    console.log(e)
                  });
                  break;
                default:
                  console.log(7);
                  _self.casLogin(res);
              }
            });
          }
        });
      },
      casLogin(ltres){
        var _self = this;
        console.log(8);
        console.log(ltres.body);
        switch (ltres.body.code) {
          case 301:
            console.log(9);
            //获取lt成功并且没有登陆到本应用
            var parms = Object.assign({}, this.ruleForm);
            console.log(ltres.data.data.lt);
            parms['lt'] = ltres.data.data.lt;
            parms['execution'] = ltres.data.data.execution;
            parms['service'] = ltres.data.service;
            parms['_eventId'] = 'submit';
            parms['type'] = 'employee';
            parms['jsonpCallback'] = 'jsonp';

            //像认证服务器发起认证
            _self.$http.jsonp(_self.cas.casServer.host + _self.cas.casServer.login + "?service=" + _self.casServer,{params:parms,jsonpCallback:"jsonp"}).then(function(authres){
              console.log(10);
              console.log(authres);
              switch (authres.body.code) {
                case 200:
                  //认证服务器认证通过，像应用服务器发起认证
                  var params = {
                    'ticket': authres.body.data,
                    'forward': 'true'
                  };
                  console.log(params);
                  this.$api.get(_self.urlMinusUri() + "/proxy" + _self.cas.casClient.login, params,res => {
                    console.log(111);
                    switch (res.data.code) {
                      //应用服务器认证不通过，提示结果
                      case 422:
                        _self.changeImage();
                        _self.$Message.error(res.data.desc);
                        break;
                      case 200:
                        console.log(12);
                        _self.$Message.success('登录成功，正在执行跳转，请稍后!');
                        setTimeout("window.location = '/';", 1000);
                        break;
                    }
                  },function(res) {
                    _self.$Message.error(res.data.desc);
                  });
                  break;
                case 501:
                  this.$Message.success('验证码输入错误！');
                  this.changeImage();
                  break;
                default :
                  this.$Message.success(ltres.data.desc);
                  this.changeImage();
                  break;
              }
            });
            break;
          default:
            break;
        }
      }
    }
  }
</script>
<style>
.h_panel, .login_banner{
  width: 1130px;
  margin: 0 auto;
}
.h_logo a {
  display: block;
  height: 58px;
  text-indent: -9999em;
}
.login_banner_panel {
  background: #f5f5f5;
  width: 100%;
  min-width: 1130px;
  height: 588px;
  position: absolute;
  left: 0;
  top: 68px;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  margin:0;
  padding:0;
  background-image: url(../assets/img/login-bg.png);
}
.h_logo {
  width: 200px;
  height: 58px;
  background: url(../assets/img/logo.png) no-repeat;
  margin-top:5px;
}
.layout_panel {
  padding-top: 0px;
  width: 1130px;
  margin: 0 auto;
  position: relative;
}
.wrap {
  padding-bottom: 0;
  position: relative;
  padding-top: 0 \9;
}
.layout {
  width: 380px;
  height: 420px;
  margin-bottom: 0;
  margin-right: 0;
  font-size: 14px;
  z-index: 4;
  background-color: #fff;
  margin: 65px auto 20px;
  position: relative;
  left:360px;
  border-radius: 10px;
}
.nav_tabs{
  font-size: 24px;
  color: #e0e0e0;
  height:82px;
  line-height: 82px;
  text-align: center;
  /*border-bottom: 1px solid #dddddd;*/
}
.nav_tabs a:hover,.nav_tabs a.now {
  color: #333333;
}
.labelbox {
  display: block;
  margin-bottom: 14px;
  border: 1px solid #e0e0e0;
}
.input-class{
  border-radius: 5px;
  width: 100%;
  height:45px;
  line-height: 45px;
  border:1px solid #dddddd;
}
.n-footer {
  height: 80px;
  margin-top: 120px;
  text-align: center;
}
.padding-errortips{
  padding:5px 0px;
}
a{
  color:#333333;
}
.btn-green{
  border-color: #31B573;
  background-color: #3CB371;
  color: #FFFFFF;
}
.btn-green:hover{
  background-color: #31B573;
  color: #FFFFFF;
}
.btn-green-border{
  border-color: #31B573;
  background-color: #FFFFFF;
}
.btn-green-border:hover {
  color: #ffffff;
}
.login-btn{
  width: 100%;
  height:45px
}
.login-img{
  height:100%;
  width: 100%;
}
</style>
