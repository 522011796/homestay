<template>
  <div>
    <Button type="success" @click="show()">click</Button>
    <Modal
      v-model="showmodel"
      title="Title"
      ok-text="保存"
      cancel-text="取消"
      width="700"
      >
        <Form inline class="editOrder">
          <FormItem label="姓名:" class="margin-bottom0" :label-width="70">
            <Input type="text" size="small" style="width:100px" v-model="ruleForm.relaName" :maxlength="20"></Input>
          </FormItem>
          <FormItem label="手机:" class="margin-bottom0" :label-width="70">
            <Input type="text" size="small" style="width:100px" v-model="ruleForm.phone" :maxlength="11"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        showmodel:false,
        ruleForm:{
          orderSn:'',
          payType:'',
          channel:'',
          remarks:'',
          realName:'',
          roomId:'',
          phone:'',
          cardType:'',
          cardId:'',
          roomNo:'',
          roomGroupName:'',
          roomGroupId:'',
          tags:[],
          inTime:'',
          outTime:'',
          orderType:'',
          status:'',
          relaOrderList:[],
          orderId:'',
          orderStatus:'',
          groupName:'',
          inTimeArr:'',
          outTimeArr:'',
          subSn:'',
          liveNowGl:false,
          selTagId:'',//用于修改订单时候存主订单的tagid
          selTypeId:'',//用于修改订单时候存主订单的typeid
          roomTypeId:''
        }
      }
    },
    created(){

    },
    methods:{
      show(){
        this.showmodel = true;
      }
    }
  }
</script>
<style>

</style>
