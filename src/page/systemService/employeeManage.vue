<template>
  <div>
    <div class="right-content-title">
      <span>系统维护</span>
      <span> > </span>
      <span>人员管理</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15">
      <div>
        <Button type="success" icon="plus" @click="show()">
          添加保洁员
        </Button>
        <Input placeholder="请输入房间号" class="w180"></Input>
        <Button type="info">搜索</Button>
      </div>
      <div>
        <Table :columns="columns" :data="data" class="margin-top10"></Table>
      </div>
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
