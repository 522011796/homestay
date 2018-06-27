<template>
  <div>
    <div class="right-content-title">
      <span>系统维护</span>
      <span> > </span>
      <span>基础信息</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15">
      <Form :label-width="120" style="position: relative">
        <Button type="success" class="basic-edit-btn">编辑</Button>
        <FormItem label="组织名称:">
          xxxxxx
        </FormItem>
        <FormItem label="地址:">
          xxxxxx
        </FormItem>
        <FormItem label="联系人:">
          xxxxxx
        </FormItem>
        <FormItem label="联系电话:">
          xxxxxx
        </FormItem>
        <FormItem label="管理员开锁密码:">
          <Button type="success">更换</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'employeeManage',
    data () {
      return {
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
        data: [
          {
            username: 'John Brown',
            phone: 18,
            rooms:'大床房'
          }
        ]
      }
    }
  }
</script>
<style>

</style>
