<template>
  <div>
    <div style="width: 300px;margin:50px auto;">
      <div><Checkbox @on-change="checkAll($event)" :value="chkAll">all</Checkbox></div>
      <hr>
      <div>
        <!--<Checkbox v-for="(item,index) in checkAllData" :key="index" @on-change="chk($event)" :value="getCheck(item.key)" :true-value="item.key" :false-value="item.key">{{item.str}}</Checkbox>-->
        <Checkbox v-for="(item,index) in checkAllData" :key="index" @change.native="chk($event,item.key)" :value="getCheck(item.key,item.status)" :true-value="item.key" :disabled="setDisabled(item.status)">{{item.str}}</Checkbox>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        chkAll:false,
        checkAllData:[
          {key:'a',str:'a',status:'yes'},
          {key:'b',str:'b',status:'no'},
          {key:'c',str:'c',status:'yes'},
          {key:'d',str:'d',status:'no'}
        ],
        checkList:[]
      }
    },
    created(){

    },
    methods:{
      chk(event,val){
        if(event.target.checked){
          this.checkList.push(val);
          if(this.checkList.length == this.checkAllData.length){
            this.chkAll = true;
          }
        }else{
          for(var i=0;i<this.checkList.length;i++){
            if(this.checkList[i] == val){
              this.checkList.splice(i,1);
              this.chkAll = false;
            }
          }
        }
      },
      getCheck(item,status){
        if(status != "no"){
          return this.checkList.includes(item) ? item : false;
        }
      },
      checkAll(event){
        this.checkList = [];
        if(event){
          this.chkAll = true;
          for(var i=0;i<this.checkAllData.length;i++){
            if(this.checkAllData[i].status != "no"){
              this.checkList.push(this.checkAllData[i].key);
            }
          }
        }
        console.log(this.checkList);
      },
      setDisabled(item){
        if(item == "no"){
          return true;
        }
      }
    }
  }
</script>
<style>

</style>
