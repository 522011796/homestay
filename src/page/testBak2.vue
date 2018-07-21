<template>
  <div>
    <div>
      <Form :model="ruleForm" ref="ruleForm" :label-width="80">
        <!--<FormItem label="test" prop="roomNo" :rules="$filter_rules({required:true})">
          <div>
            <Input type="text" style="width: 120px" v-model="ruleForm.roomNo"></Input>
            <i class=" fa fa-plus-circle" @click="add()"></i>
          </div>
        </FormItem>-->
        <FormItem v-for="(item,index) in ruleForm.inputList" :key="index" label="test" :prop="'inputList.' + index + '.roomNo'" :rules="$filter_rules({required:true})">
          <div>
            <Input type="text" v-model="item.roomNo" style="width: 120px"></Input>
            <i v-if="index==0" class="fa fa-plus-circle" @click="add()"></i>
            <i v-else class="fa fa-minus-circle" @click="muti(index)"></i>
          </div>
        </FormItem>
        <FormItem label="test2" prop="roomNo1" :rules="$filter_rules({required:true})">
          <div>
            <Input type="text" v-model="ruleForm.roomNo1" style="width: 120px"></Input>
          </div>
        </FormItem>
      </Form>
      <button type="button" @click="sub('ruleForm')">click</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        ruleForm:{
          inputList:[{
            roomNo:''
          }],
          roomNo1:''
        }
      }
    },
    created(){

    },
    methods:{
      add(){
        this.ruleForm.inputList.push(
          {roomNo:''}
        );
      },
      muti(index){
        this.ruleForm.inputList.splice(index,1);
      },
      sub(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            var str = "";
            for(var i=0;i<this.ruleForm.inputList.length;i++){
              str += this.ruleForm.inputList[i].roomNo+",";
            }
            console.log(str);
          }
        });
      }
    }
  }
</script>
<style>

</style>
