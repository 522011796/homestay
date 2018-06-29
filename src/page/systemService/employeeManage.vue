<template>
  <div>
    <div class="right-content-title">
      <span>系统维护</span>
      <span> > </span>
      <span>人员管理</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15" style="position: relative">
      <Spin fix v-if="showLoading" class="table-loading">
        <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
        <div class="text-green">Loading</div>
      </Spin>
      <div>
        <Button type="success" icon="plus" @click="show()">
          添加保洁员
        </Button>
        <Input placeholder="请输入房间号" class="w180" v-model="searchName"></Input>
        <Button type="info" @click="search">搜索</Button>
      </div>
      <div>
        <Table :columns="columns" :data="data" class="margin-top10"></Table>
      </div>
      <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'employeeManage',
    data () {
      return {
        pageNum:12,
        current:1,
        roomList:[],
        totalCount:0,
        showLoading:false,
        searchName:"",
        columns: [
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '管理房间',
            align: 'center',
            key: 'room_num'
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
      this.init();
    },
    methods:{
      search(){
        this.init();
      },
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          name:this.searchName
        };
        //console.log(this.$utils.clearData(params));
        this.showLoading = true;
        this.$api.get("/proxy/user/employee/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          console.log(data);
          this.data = data.list;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
    }
  }
</script>
<style>

</style>
