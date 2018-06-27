<template>
  <div>
    <div style="height:36px;line-height:36px;color: #3ab573;padding:0px 25px;">
      <span>订单管理</span>
      <span> > </span>
      <span>全部订单</span>
    </div>
    <div style="height:1px;background: #dddddd"></div>
    <div style="padding:0px 25px;margin-top:15px;">
      <div>
        <Input placeholder="请输入姓名或者手机号" style="width: 180px"></Input>
        <Button type="info">搜索</Button>
      </div>
      <div>
        <!--<table class="custom-table">
          <tr>
            <td class="custom-td-title">状态</td>
            <td class="custom-td-title">姓名</td>
            <td class="custom-td-title">电话</td>
            <td class="custom-td-title">房型</td>
            <td class="custom-td-title">房间</td>
            <td class="custom-td-title">入住时间</td>
            <td class="custom-td-title">渠道来源</td>
            <td class="custom-td-title">支付类型</td>
            <td class="custom-td-title">操作</td>
          </tr>
        </table>-->
        <Table :columns="columns" style="margin-top:10px;"></Table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {
        columns: [
          {
            title: '状态',
            align: 'center',
            key: 'status',
            renderHeader: (h,params)=>{
              return h('div',[
                h('strong','状态'),
                h('Icon',{
                  props:{
                    type: 'arrow-down-b'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      console.log(111);
                    }
                  }
                })
              ])
            }
          },
          {
            title: '姓名',
            align: 'center',
            key: 'username'
          },
          {
            title: '电话',
            align: 'center',
            key: 'phone'
          },
          {
            title: '房型',
            align: 'center',
            key: 'type'
          },
          {
            title: '房间',
            align: 'center',
            key: 'rooms'
          },
          {
            title: '入住时间',
            align: 'center',
            key: 'inTime'
          },
          {
            title: '渠道来源',
            align: 'center',
            key: 'src'
          },
          {
            title: '支付类型',
            align: 'center',
            key: 'orderType'
          }
        ]
      }
    }
  }
</script>
<style>

</style>
