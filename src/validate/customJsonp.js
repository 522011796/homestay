// 处理http的参数
import qs from 'qs';

var hybrid = {
  // 用于vue安装这个插件 这个方法的第一个参数是 Vue 构造器 , 第二个参数是一个可选的选项对象:
  install (Vue, options) {
    // 把当前的对象挂载到vue的全局
    Vue.prototype.$hybrid = this;
    Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue({data:{'message':''}, template:'<div> {{message}} </div>'});
    this.$eventHub = Vue.prototype.$eventHub;
    Vue.prototype.$myMethod = function (options) {  // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
      // 逻辑...
      console.log('我是实例上的一个方法' + options);
    }
  },
  crossHttp(baseUrl,param={}) {
    return new Promise ((resolve, reject) => {
      let script = document.createElement("script");
      let params = '&' + qs.stringify(param);
      script.src = baseUrl + params;
      document.body.insertBefore(script, document.body.firstChild);
      window.jsonp = function (response,err) {
        // 对response数据进行操作代码
        console.log('jsonp 回掉成功' + JSON.stringify(response) +"code:"+response.code);
        /*if (response.code == '301') {
          resolve(response);
        }else */if(response.code == '200'){
          resolve(response);
        } else {
          resolve(response);
        }
      }
    })
  }

}
// window对象
window.Hybrid = hybrid;
// 导出
export default hybrid;
