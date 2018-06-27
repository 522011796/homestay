<template>
  <div>
    <div class="right-content-title">
      <span>订单管理</span>
      <span> > </span>
      <span>全部订单</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15">
      <div>
        <Input placeholder="请输入姓名或者手机号" class="w180"></Input>
        <Button type="success">搜索</Button>
      </div>
      <div class="margin-top10">
        <table class="custom-table">
          <tr>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  状态
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem>全部</DropdownItem>
                  <DropdownItem>待排房</DropdownItem>
                  <DropdownItem>未入住</DropdownItem>
                  <DropdownItem>已入住</DropdownItem>
                  <DropdownItem>已离店</DropdownItem>
                  <DropdownItem>已取消</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">姓名</td>
            <td class="custom-td-title">电话</td>
            <td class="custom-td-title">房型</td>
            <td class="custom-td-title">房间</td>
            <td class="custom-td-title">入住时间</td>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  渠道来源
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem>全部</DropdownItem>
                  <DropdownItem>线下</DropdownItem>
                  <DropdownItem>携程</DropdownItem>
                  <DropdownItem>艺龙</DropdownItem>
                  <DropdownItem>去哪儿</DropdownItem>
                  <DropdownItem>飞猪</DropdownItem>
                  <DropdownItem>其他</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  支付类型
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem>全部</DropdownItem>
                  <DropdownItem>到店现付</DropdownItem>
                  <DropdownItem>已担保</DropdownItem>
                  <DropdownItem>全额预付</DropdownItem>
                  <DropdownItem>部分预付</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">操作</td>
          </tr>

          <tr>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
            <td class="custom-td-value">1</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {

      }
    }
  }
</script>
<style>

</style>
