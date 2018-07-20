<template>
  <div>
    <div class="right-content-title">
      <span>订单管理</span>
      <span> > </span>
      <span>全部订单</span>
    </div>
    <div class="line-title"></div>
    <div class="padding-top0-top25 margin-top15" style="position: relative">
      <div>
        <Input placeholder="请输入姓名或者手机号" v-model="userSearch" clearable @on-change="search()" class="w180" maxlength="20"></Input>
        <Button type="success" @click=search()>搜索</Button>
      </div>
      <div class="margin-top10">
        <table class="custom-table">
          <tr>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  {{orderStatusText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem data-name="全部" @click.native="selStatus($event,'')">全部</DropdownItem>
                  <DropdownItem data-name="待排房" @click.native="selStatus($event,'waitPlan')">待排房</DropdownItem>
                  <DropdownItem data-name="未入住" @click.native="selStatus($event,'notLiveIn')">未入住</DropdownItem>
                  <DropdownItem data-name="已入住" @click.native="selStatus($event,'livedIn')">已入住</DropdownItem>
                  <DropdownItem data-name="已离店" @click.native="selStatus($event,'levelOff')">已离店</DropdownItem>
                  <DropdownItem data-name="已取消" @click.native="selStatus($event,'cancel')">已取消</DropdownItem>
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
                  {{orderChannelText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem data-name="全部" @click.native="selChannel($event,'')">全部</DropdownItem>
                  <DropdownItem data-name="线下" @click.native="selChannel($event,'1')">线下</DropdownItem>
                  <DropdownItem data-name="携程" @click.native="selChannel($event,'2')">携程</DropdownItem>
                  <DropdownItem data-name="艺龙" @click.native="selChannel($event,'3')">艺龙</DropdownItem>
                  <DropdownItem data-name="去哪儿" @click.native="selChannel($event,'4')">去哪儿</DropdownItem>
                  <DropdownItem data-name="飞猪" @click.native="selChannel($event,'5')">飞猪</DropdownItem>
                  <DropdownItem data-name="其他" @click.native="selChannel($event,'99')">其他</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">
              <Dropdown trigger="click">
                <a href="javascript:;" class="custom-font-434343">
                  {{orderPayTypeText}}
                  <Icon type="arrow-down-b" class="custom-font-434343"></Icon>
                </a>
                <DropdownMenu slot="list" style="width: 100%">
                  <DropdownItem @click.native="selPayType($event,'')">全部</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'1')">到店现付</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'2')">已担保</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'3')">全额预付</DropdownItem>
                  <DropdownItem @click.native="selPayType($event,'4')">部分预付</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </td>
            <td class="custom-td-title">操作</td>
          </tr>

          <tbody>
          <Spin fix v-if="showLoading" class="table-loading">
            <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
            <div class="text-green">Loading</div>
          </Spin>
          <tr v-if="totalCount!=0" v-for="(item,index) in orderList.list" :key="index">
            <td class="custom-td-value">
              <span v-if="item.order_status == 'waitPlan'">待排房</span>
              <span v-if="item.order_status == 'notLiveIn'">未入住</span>
              <span v-if="item.order_status == 'livedIn'">已入住</span>
              <span v-if="item.order_status == 'levelOff'">已离店</span>
              <span v-if="item.order_status == 'cancel'">已取消</span>
            </td>
            <td class="custom-td-value">
              <span>{{item.real_name}}</span>
            </td>
            <td class="custom-td-value">
              <span>{{item.phone}}</span>
            </td>
            <td class="custom-td-value">
              <span>{{item.room_type}}</span>
            </td>
            <td class="custom-td-value">
              <span>{{item.room_no}}({{item.room_group_name}})</span>
            </td>
            <td class="custom-td-value">
              <span>{{$moment.unix(item.check_in_time/1000).format("YYYY-MM-DD HH:mm")}}</span>
            </td>
            <td class="custom-td-value">
              <span v-if="item.channel == null">--</span>
              <span v-if="item.channel == '1'">线下</span>
              <span v-if="item.channel == '2'">携程</span>
              <span v-if="item.channel == '3'">艺龙</span>
              <span v-if="item.channel == '4'">去哪儿</span>
              <span v-if="item.channel == '5'">飞猪</span>
              <span v-if="item.channel == '99'">其他</span>
            </td>
            <td class="custom-td-value">
              <span v-if="item.pay_type == null">--</span>
              <span v-if="item.pay_type == '1'">到店现付</span>
              <span v-if="item.pay_type == '2'">已担保</span>
              <span v-if="item.pay_type == '3'">全额预付</span>
              <span v-if="item.pay_type == '4'">部分预付</span>
            </td>
            <td class="custom-td-value">
              <Button type="text" @click="detailOrder(item.id,item.order_sn)" class="text-green">详情</Button>
            </td>
          </tr>
          <tr v-if="totalCount==0">
            <td colspan="9" class="text-center">暂无数据</td>
          </tr>
          </tbody>
        </table>
        <Page v-if="totalCount!=0" class="margin-top10 margin-bottom10 text-right" :total="totalCount" :current="current" :page-size="pageNum"	 size="small" @on-change="init($event)" show-total></Page>
      </div>
    </div>

    <!--订单详细-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addDetailModal"
      :title="modalTitle"
      :mask-closable="false"
      :closable="false"
      @on-visible-change = "chgModal"  width="760">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form ref="ruleForm" label-position="right" :label-width="100" inline style="width: 100%;margin:0 auto;">
        <div v-if="updateStatus == false || (updateStatus && ruleForm.orderStatus == 'livedIn')">
          <FormItem label="订单号:" class="margin-bottom0">
            {{ruleForm.orderSn}}
          </FormItem>
          <FormItem label="支付类型:" class="margin-bottom0">
            <span v-if="ruleForm.payType == null">--</span>
            <span v-if="ruleForm.payType == '1'">到店现付</span>
            <span v-if="ruleForm.payType == '2'">已担保</span>
            <span v-if="ruleForm.payType == '3'">全额预付</span>
            <span v-if="ruleForm.payType == '4'">部分预付</span>
          </FormItem>
          <FormItem label="渠道来源:" class="margin-bottom0">
            <span v-if="ruleForm.payType == null">--</span>
            <span v-if="ruleForm.payType == '1'">线下</span>
            <span v-if="ruleForm.payType == '2'">携程</span>
            <span v-if="ruleForm.payType == '3'">艺龙</span>
            <span v-if="ruleForm.payType == '4'">去哪儿</span>
            <span v-if="ruleForm.payType == '5'">飞猪</span>
            <span v-if="ruleForm.payType == '99'">其他</span>
          </FormItem>
          <FormItem label="备注:" class="margin-bottom0">
            <span v-if="ruleForm.remarks == ''">--</span>
            <span v-else>{{ruleForm.remarks}}</span>
          </FormItem>
        </div>
        <div v-if="updateStatus">
          <FormItem label="订单号:" class="margin-bottom0">
            {{ruleForm.orderSn}}
          </FormItem>
          <FormItem label="支付类型:" class="margin-bottom0">
            <Select v-model="ruleForm.payType" style="width:100px" size="small">
              <Option value="1">到店现付</Option>
              <Option value="2">已担保</Option>
              <Option value="3">全额预付</Option>
              <Option value="4">部分预付</Option>
            </Select>
          </FormItem>
          <FormItem label="渠道来源:" class="margin-bottom0">
            <Select v-model="ruleForm.channel" style="width:100px" size="small">
              <Option value="1">线下</Option>
              <Option value="2">携程</Option>
              <Option value="3">艺龙</Option>
              <Option value="4">去哪儿</Option>
              <Option value="5">飞猪</Option>
              <Option value="99">其他</Option>
            </Select>
          </FormItem>
          <FormItem label="备注:" class="margin-bottom0">
            <Input v-model="ruleForm.remarks" type="textarea" style="width:604px"></Input>
          </FormItem>
        </div>
        <div class="line"></div>
        <!--批量操作按钮组-->
        <div v-if="showEditOrder" class="margin-bottom10">
          <Checkbox v-if="updateStatus == false" @on-change="selAllBox($event)" :value="chkAll"></Checkbox>
          <span v-if="goOutStatus">
            <Button type="success" :loading="loading" size="small" @click="setRoomStatus('outRoom')">
              <span v-if="!loading">批量办理退房</span>
              <span v-else>Loading...</span>
            </Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消办理退房</Button>
          </span>
          <span v-if="goInStatus">
            <Button type="success" :loading="loading" size="small" @click="setRoomStatus('inRoom')">
              <span v-if="!loading">批量办理入住</span>
              <span v-else>Loading...</span>
            </Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消办理入住</Button>
          </span>
          <span v-if="cancelOrderStatus">
            <Button type="success" :loading="loading" size="small" @click="setRoomStatus('cancelOrder')">
              <span v-if="!loading">批量取消订单</span>
              <span v-else>Loading...</span>
            </Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消操作</Button>
          </span>
          <span v-if="sendPwdStatus">
            <Button type="success" :loading="loading" size="small" @click="setRoomStatus('sendPwd')">
              <span v-if="!loading">批量发送密码</span>
              <span v-else>Loading...</span>
            </Button>
            <Button type="ghost" size="small" @click="cancelOrderOpr(false)">取消发送密码</Button>
          </span>
          <span class="custom-font-error">{{errorTips}}</span>
        </div>
        <div>
          <Checkbox @change.native="selOnlyBox($event,ruleForm.orderId,ruleForm.realName,ruleForm.phone,ruleForm.cardType,ruleForm.cardId,ruleForm.roomNo,ruleForm.groupName)" v-if="showEditOrder && updateStatus == false" class="pull-left orderListBox" :value="getCheck(ruleForm.orderId,ruleForm.status)" :true-value="ruleForm.orderId" :disabled="setDisabled(ruleForm.orderStatus)"></Checkbox>
          <Card class="orderCard pull-right" :class="{'w96-full':showEditOrder,'w100-full':!showEditOrder}">
            <div>
              <div>
                <div v-if="updateStatus == false || (updateStatus && ruleForm.orderStatus == 'livedIn')"">
                <FormItem :label-width="70" label="姓名:" class="margin-bottom0">
                  {{ruleForm.realName}}
                </FormItem>
                <FormItem :label-width="70" label="手机:" class="margin-bottom0">
                  {{ruleForm.phone}}
                </FormItem>
                <FormItem :label-width="70" label="证件:" class="margin-bottom0">
                  <span v-if="ruleForm.cardType == 'idcard'">身份证</span>
                </FormItem>
                <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                  {{ruleForm.cardId}}
                </FormItem>
              </div>
              <div v-if="updateStatus && ruleForm.orderStatus == 'notLiveIn'" class="editOrder">
                <FormItem :label-width="50" label="姓名:" class="margin-bottom0">
                  <Input placeholder="" size="small" style="width:100px" v-model="ruleForm.realName"></Input>
                </FormItem>
                <FormItem :label-width="50" label="手机:" class="margin-bottom0">
                  <Input placeholder="" size="small" style="width:100px" v-model="ruleForm.phone"></Input>
                </FormItem>
                <FormItem :label-width="50" label="证件:" class="margin-bottom0">
                  <Select size="small" v-model="ruleForm.cardType" style="width:100px" @on-change="chgCardType($event)">
                    <Option value="idcard">身份证</Option>
                    <Option value="residenceBooklet">户口簿</Option>
                    <Option value="passportCard1">外交护照</Option>
                    <Option value="passportCard2">普通护照</Option>
                    <Option value="passportCard3">公务护照</Option>
                    <Option value="officeCard">军官证</Option>
                    <Option value="copCard">警官证</Option>
                    <Option value="soldierCard">士兵证</Option>
                    <Option value="passCard">能行证</Option>
                    <Option value="otherCard">其他</Option>
                  </Select>
                </FormItem>
                <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                  <Input placeholder="" size="small" style="width:187px"  v-model="ruleForm.cardId"></Input>
                </FormItem>
              </div>
            </div>
            <div>
              <div v-if="updateStatus == false || (updateStatus && ruleForm.orderStatus == 'livedIn')"">
              <FormItem :label-width="70" label="房间:" class="margin-bottom0">
                {{ruleForm.roomNo}}({{ruleForm.roomGroupName}})
              </FormItem>
              <FormItem :label-width="70" label="特性:" class="margin-bottom0">
                    <span v-for="(item,index) in ruleForm.tags" :key="index">
                      <span v-if="index < 1">
                        {{item.type}}
                      </span>
                    </span>
                <Poptip placement="right" width="80">
                  <span class="fa fa-info-circle"></span>
                  <div class="api" slot="content">
                    <div v-for="(itemTag,index) in ruleForm.tags" :key="index">
                      {{itemTag.type}}
                    </div>
                  </div>
                </Poptip>
              </FormItem>
              <FormItem :label-width="70" label="入住:" class="margin-bottom0">
                {{$moment.unix(ruleForm.inTime/1000).format("YYYY-MM-DD HH:mm")}}
              </FormItem>
              <FormItem :label-width="70" label="离店:" class="margin-bottom0">
                {{$moment.unix(ruleForm.outTime/1000).format("YYYY-MM-DD HH:mm")}}
              </FormItem>
            </div>
            <div v-if="updateStatus && ruleForm.orderStatus == 'notLiveIn'" class="editOrder">
              <FormItem :label-width="50" label="房间:" class="margin-bottom0">
                <Select v-model="ruleForm.roomId" clearable size="small" style="width:100px" @on-open-change="filterRoom($event,ruleForm.roomId,ruleForm.inTime,ruleForm.outTime,ruleForm.tags[0].id,ruleForm.roomTypeId,ruleForm)">
                  <Option v-for="(item,index) in roomList" :key="index" :value="item.id" @click.native="chgRoom($event,item.id,item.room_no,item.group_level1_name,item.group_level1_id)">{{item.room_no}}({{item.group_level1_name}})</Option>
                </Select>
              </FormItem>
              <FormItem :label-width="50" label="特性:" class="margin-bottom0">
                <Select v-model="ruleForm.tags[0].id" clearable size="small" style="width:100px" @on-change="chgMainTag($event,ruleForm)" @on-clear="clearTag()">
                  <Option v-for="(item,index) in tagList" :key="index" :value="item.id">{{item.tag}}</Option>
                </Select>
              </FormItem>
              <FormItem :label-width="50" label="入住:" class="margin-bottom0"><!--
                    <Input placeholder="" size="small" style="width:90px;" v-model="$moment.unix(ruleForm.inTime/1000).format('YYYY-MM-DD')"></Input>-->
                <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(ruleForm.inTime/1000).format('YYYY-MM-DD')" @on-change="chgMainTime($event,'mainInTime')"></DatePicker>
                <TimePicker v-show="timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.inTimeArr" @on-change="selMainTime($event,'mainInTime')"></TimePicker>
                <TimePicker v-show="timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.inTimeArr" @on-change="selMainTime($event,'mainInTime')"></TimePicker>
              </FormItem>
              <FormItem :label-width="50" label="离店:" class="margin-bottom0"><!--
                    <Input placeholder="" size="small" style="width:90px" v-model="$moment.unix(ruleForm.outTime/1000).format('YYYY-MM-DD')"></Input>-->
                <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(ruleForm.outTime/1000).format('YYYY-MM-DD')" :options="optionsEnd" @on-change="chgMainTime($event,'mainOutTime')" @on-open-change="openOutTime($event,null,'main')"></DatePicker>
                <TimePicker v-show="timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.outTimeArr" @on-change="selMainTime($event,'mainOutTime')"></TimePicker>
                <TimePicker v-show="timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="ruleForm.outTimeArr" @on-change="selMainTime($event,'mainOutTime')"></TimePicker>
              </FormItem>
            </div>
        </div>
        <div>
          <div v-if="updateStatus == false || (updateStatus && ruleForm.orderStatus == 'livedIn')"">
          <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
            <span v-if="ruleForm.orderType == '1'">日租</span>
            <span v-if="ruleForm.orderType == '2'">时租</span>
          </FormItem>
          <FormItem :label-width="70" label="状态:" class="margin-bottom0">
            <span v-if="ruleForm.status == 'waitPlan'">待排房</span>
            <span v-if="ruleForm.status == 'notLiveIn'">未入住</span>
            <span v-if="ruleForm.status == 'livedIn'">已入住</span>
            <span v-if="ruleForm.status == 'levelOff'">已离店</span>
            <span v-if="ruleForm.status == 'cancel'">已取消</span>
          </FormItem>
        </div>
        <div v-if="updateStatus && ruleForm.orderStatus == 'notLiveIn'">
          <FormItem :label-width="50" label="房型:" class="margin-bottom0">
            <Select v-model="ruleForm.roomTypeId" clearable size="small" style="width:100px" @on-change="chgMainType($event,ruleForm)" @on-clear="clearRoomType()">
              <Option v-for="(item,index) in typeList" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
            <RadioGroup v-model="ruleForm.orderType" size="small" type="button" @on-change="selTimeType($event)">
              <Radio label="1">日租</Radio>
              <Radio label="2">时租</Radio>
            </RadioGroup>
          </FormItem>
        </div>
  </div>
  </div>
  </Card>
  <div class="clearfix"></div>
  </div>

  <!--关联房间-->
  <div v-if="ruleForm.relaOrderList.length > 0">
    <div class="text-green" style="height:35px;line-height:35px;">
      <span>关联房间</span>
    </div>
    <div v-for="(item,index) in ruleForm.relaOrderList" :key="index">
      <Checkbox @change.native="selOnlyBox($event,item.id,item.real_name,item.phone,item.card_type,item.card_id,item.room_no,item.room_group_name)" v-if="showEditOrder && updateStatus == false" class="pull-left orderListBox" :value="getCheck(item.id,item.order_status)" :true-value="item.id" :disabled="setDisabled(item.order_status)"></Checkbox>
      <Card class="orderCard pull-right margin-bottom10" :class="{'w96-full':showEditOrder,'w100-full':!showEditOrder}">
        <div>
          <div>
            <div v-if="updateStatus == false || (updateStatus && item.order_status == 'livedIn')">
              <FormItem :label-width="70" label="姓名:" class="margin-bottom0">
                {{item.real_name}}
              </FormItem>
              <FormItem :label-width="70" label="手机:" class="margin-bottom0">
                {{item.phone}}
              </FormItem>
              <FormItem :label-width="70" label="证件:" class="margin-bottom0">
                <span v-if="item.card_type == 'idcard'">身份证</span>
              </FormItem>
              <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                {{item.card_id}}
              </FormItem>
            </div>
            <div v-if="updateStatus && item.order_status == 'notLiveIn'" class="editOrder">
              <FormItem :label-width="50" label="姓名:" class="margin-bottom0">
                <Input placeholder="" size="small" style="width:100px" v-model="item.real_name"></Input>
              </FormItem>
              <FormItem :label-width="50" label="手机:" class="margin-bottom0">
                <Input placeholder="" size="small" style="width:100px" v-model="item.phone"></Input>
              </FormItem>
              <FormItem :label-width="50" label="证件:" class="margin-bottom0">
                <Select size="small" v-model="item.card_type" style="width:100px">
                  <Option value="idcard">身份证</Option>
                  <Option value="residenceBooklet">户口簿</Option>
                  <Option value="passportCard1">外交护照</Option>
                  <Option value="passportCard2">普通护照</Option>
                  <Option value="passportCard3">公务护照</Option>
                  <Option value="officeCard">军官证</Option>
                  <Option value="copCard">警官证</Option>
                  <Option value="soldierCard">士兵证</Option>
                  <Option value="passCard">能行证</Option>
                  <Option value="otherCard">其他</Option>
                </Select>
              </FormItem>
              <FormItem :label-width="70" label="证件号码:" class="margin-bottom0">
                <Input placeholder="" size="small" style="width:187px"  v-model="item.card_id"></Input>
              </FormItem>
            </div>
          </div>
          <div>
            <div v-if="updateStatus == false || (updateStatus && item.order_status == 'livedIn')">
              <FormItem :label-width="70" label="房间:" class="margin-bottom0">
                {{item.room_no}}({{item.room_group_name}})
              </FormItem>
              <FormItem :label-width="70" label="特性:" class="margin-bottom0">
                      <span v-for="(itemTag,index) in item.room_tags" :key="index">
                        <span v-if="index < 1">{{itemTag.type}}</span>
                      </span>
                <span>
                        <Poptip placement="right" width="80">
                          <span class="fa fa-info-circle"></span>
                          <div class="api" slot="content">
                            <div v-for="(itemTag,index) in item.room_tags" :key="index">
                              {{itemTag.type}}
                            </div>
                          </div>
                        </Poptip>
                      </span>
              </FormItem>
              <FormItem :label-width="70" label="入住:" class="margin-bottom0">
                {{$moment.unix(item.check_in_time/1000).format("YYYY-MM-DD HH:mm")}}
              </FormItem>
              <FormItem :label-width="70" label="离店:" class="margin-bottom0">
                {{$moment.unix(item.check_out_time/1000).format("YYYY-MM-DD HH:mm")}}
              </FormItem>
            </div>
            <div v-if="updateStatus && item.order_status == 'notLiveIn'"" class="editOrder">
            <FormItem :label-width="50" label="房间:" class="margin-bottom0">
              <Select v-model="item.room_id" clearable size="small" style="width:100px" @on-open-change="filterRoom($event,item.room_id,item.check_in_time,item.check_out_time,item.room_tags[0].id,item.room_type_id,item,index)">
                <Option v-for="(item,roomIndex) in roomList" :key="roomIndex" :value="item.id" @click.native="chgChildRoom($event,index,item.id,item.room_no,item.group_level1_name,item.group_level1_id)">{{item.room_no}}({{item.group_level1_name}})</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="特性:" class="margin-bottom0">
              <Select v-model="item.room_tags[0].id" clearable size="small" style="width:100px" @on-change="chgChildTag($event,index,item)" @on-clear="clearChildTag(index)">
                <Option v-for="(item,index) in tagList" :key="index" :value="item.id">{{item.tag}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="入住:" class="margin-bottom0"><!--
                      <Input placeholder="" size="small" style="width:90px;" v-model="$moment.unix(item.check_in_time/1000).format('YYYY-MM-DD')"></Input>-->
              <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(item.check_in_time/1000).format('YYYY-MM-DD')" @on-change="chgChildTime($event,index,'inTime')"></DatePicker>
              <TimePicker v-show="item.check_in_type == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.check_in_time_array[1]" @on-change="selChildTime($event,index,'inTime')"></TimePicker>
              <TimePicker v-show="item.check_in_type == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.check_in_time_array[1]" @on-change="selChildTime($event,index,'inTime')"></TimePicker>
            </FormItem>
            <FormItem :label-width="50" label="离店:" class="margin-bottom0"><!--
                      <Input placeholder="" size="small" style="width:90px" v-model="$moment.unix(item.check_out_time/1000).format('YYYY-MM-DD')"></Input>-->
              <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="$moment.unix(item.check_out_time/1000).format('YYYY-MM-DD')" :options='optionsEndChild' @on-change="chgChildTime($event,index,'outTime')" @on-open-change="openOutTime($event,index,'child')"></DatePicker>
              <TimePicker v-show="item.check_in_type == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.check_out_time_array[1]" @on-change="selChildTime($event,index,'outTime')"></TimePicker>
              <TimePicker v-show="item.check_in_type == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.check_out_time_array[1]" @on-change="selChildTime($event,index,'outTime')"></TimePicker>
            </FormItem>
          </div>
        </div>
        <div>
          <div v-if="updateStatus == false || (updateStatus && item.order_status == 'livedIn')">
            <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
              <span v-if="item.check_in_type == '1'">日租</span>
              <span v-if="item.check_in_type == '2'">时租</span>
            </FormItem>
            <FormItem :label-width="70" label="状态:" class="margin-bottom0">
              <span v-if="item.order_status == 'waitPlan'">待排房</span>
              <span v-if="item.order_status == 'notLiveIn'">未入住</span>
              <span v-if="item.order_status == 'livedIn'">已入住</span>
              <span v-if="item.order_status == 'levelOff'">已离店</span>
              <span v-if="item.order_status == 'cancel'">已取消</span>
            </FormItem>
          </div>
          <div v-if="updateStatus && item.order_status == 'notLiveIn'">
            <FormItem :label-width="50" label="房型:" class="margin-bottom0">
              <Select v-model="item.room_type_id" clearable size="small" style="width:100px" @on-change="chgChildType($event,index,item)" @on-clear="clearRoomChildType(index)">
                <Option v-for="(item,index) in typeList" :key="index" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
              <RadioGroup :value="''+item.check_in_type" size="small" type="button" @on-change="selTimeChildType($event,index)">
                <Radio label=1>日租</Radio>
                <Radio label=2>时租</Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </div>
    </div>
    </Card>
    <div class="clearfix"></div>
  </div>
  <div class="clearfix"></div>
  </div>
  </Form>
  <div slot="footer">
    <div v-if="!showEditOrder && updateStatus == false">
      <Button v-if="ruleForm.status == 'livedIn'" type="success" @click="goOut('ruleForm','outRoom',ruleForm.orderId,ruleForm.orderSn)">办理退房</Button>
      <Button v-if="ruleForm.status == 'livedIn'" type="ghost" @click="sendPwd('ruleForm','sendPwd',ruleForm.orderId,ruleForm.orderSn)">发送密码</Button>
      <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="goIn('ruleForm','inRoom',ruleForm.orderId,ruleForm.orderSn)">办理入住</Button>
      <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="cancelOrder('ruleForm','cancelOrder',ruleForm.orderId,ruleForm.orderSn)">取消订单</Button>
      <Button v-if="ruleForm.status == 'notLiveIn'" type="ghost" @click="updateOrder('ruleForm','chgOrder',ruleForm.orderId,ruleForm.orderSn,ruleForm.orderType)">修改订单</Button>
      <Button type="ghost" @click="handleReset('ruleForm')">关闭窗口</Button>
    </div>
    <div v-if="!showEditOrder && updateStatus">
      <span class="custom-font-error">{{errorTips}}</span>
      <Button type="success" @click="okUpdate('ruleForm','',ruleForm.orderId,ruleForm.orderSn)">确认</Button>
      <Button type="ghost" @click="cancelUpdate('ruleForm','',ruleForm.orderId,ruleForm.orderSn)">取消</Button>
    </div>
  </div>
  </Modal>
  </div>
</template>

<script>
  export default {
    name: 'allOrderManage',
    data () {
      return {
        loading:false,
        chkAll:false,
        showLoading:false,
        addDetailModal:false,
        goInStatus:false,
        goOutStatus:false,
        sendPwdStatus:false,
        cancelOrderStatus:false,
        showEditOrder:false,
        checkedOrder:false,
        trueValue:true,
        updateStatus:false,
        editStatus:false,
        timeType:1,
        modalTitle:'',
        userSearch:"",
        orderStatus:"",
        orderStatusText:'状态',
        orderChannel:"",
        orderChannelText:'渠道来源',
        orderPayType:'',
        orderPayTypeText:'支付类型',
        totalCount:0,
        current:1,
        pageNum:12,
        errorTips:'',
        orderList:[],
        roomList:[],
        tagList:[],
        typeList:[],
        orderDetailList:[],
        orderUserInfo:[],
        checkList: [],//选中的复选框
        checkAllList:0,//所有复选框个数
        oprType:'',//操作订单的类型
        allOrderId:'',//所有的orderid
        roomArr:[],//过滤已经选择的房间
        G_ORDERID:'',
        G_ORDERSN:'',
        errorTips:'',
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
        },
        optionsEnd: {
          disabledDate (date) {
            return false;
          }
        },
        optionsEndChild: {
          disabledDate (date) {
            return false;
          }
        }
      }
    },
    created(){

    },
    methods:{
      init(page){
        page = page ? page : 1;
        var params = {
          page:page,
          num:this.pageNum,
          userSearch:this.userSearch,
          orderStatus:this.orderStatus,
          channel:this.orderChannel,
          payType:this.orderPayType,
          filter:'currentLive'
        };
        this.showLoading = true;
        this.$api.get("/proxy/order/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.orderList = data;
          this.totalCount = data.totalCount;
          this.showLoading = false;
        });
      },
      getRoomList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomList = data.list;
        });
      },
      getTag(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          this.tagList = res.data.data;
        });
      },
      getTypeList(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/type/list", params ,res => {
          this.typeList = res.data.data;
        });
      },
      search(){
        this.init();
      },
      selStatus(event,type){
        this.orderStatus = type;
        this.orderStatusText = event.currentTarget.getAttribute("data-name");
        this.init();
      },
      selChannel(event,type){
        //console.log(event.target.innerText);
        this.orderChannel = type;
        this.orderChannelText = event.currentTarget.getAttribute("data-name");
        this.init();
      },
      selPayType(event,type){
        //console.log(event.target.innerText);
        this.orderPayType = type;
        this.orderPayTypeText = event.target.innerText;
        this.init();
      },
      chgModal(status) {
        if(!status){
          this.closeModal();
        };
      },
      detailOrder(orderId,orderSn){
        var _self = this;
        this.getRoomList();
        this.getTag();
        this.getTypeList();
        this.modalTitle = '订单详情';
        var params = {
          orderId : orderId,
          orderSn : orderSn
        };
        this.$api.postQs("/proxy/order/details2", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.orderDetailList = data;
          this.ruleForm = {
            orderSn:data.order_sn,
            payType:data.pay_type,
            channel:data.channel,
            remarks:data.remarks,
            realName:data.real_name,
            roomId:data.room_id,
            cardType:data.card_type,
            cardId:data.card_id,
            phone:data.phone,
            roomNo:data.room_no,
            roomGroupName:data.room_group_name,
            roomGroupId:data.room_group_id,
            tags:data.room_tags,
            inTime:data.check_in_time,
            outTime:data.check_out_time,
            orderType:""+data.check_in_type,
            status:data.order_status,
            relaOrderList:data.relaOrderList,
            orderId:data.id,
            orderStatus:data.order_status,
            groupName:data.room_group_name,
            inTimeArr:data.check_in_time_array[1],
            outTimeArr:data.check_out_time_array[1],
            subSn:data.sub_sn,
            roomTypeId:data.room_type_id
          };
          var listLength = 1;
          this.allOrderId = data.id + ",";
          if(data.relaOrderList.length > 0){
            listLength = data.relaOrderList.length + listLength;
            data.relaOrderList.forEach(function (item,index) {
              _self.allOrderId += item.id + ",";
            });
          }
          this.checkAllList = listLength;
          this.addDetailModal = true;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      handleReset(name) {
        this.$refs[name].resetFields();
        this.addDetailModal = false;
        this.closeModal();
        this.init();
      },
      cancelUpdate(formName,type,orderId,orderSn){
        this.$refs[formName].resetFields();
        this.detailOrder(orderId,orderSn);
        this.updateStatus = false;
        this.showEditOrder = false;
      },
      okUpdate(formName,type,orderId,orderSn){
        var _self = this;
        let orderArr = [];
        orderArr.push({
          realName:this.ruleForm.realName,
          phone:this.ruleForm.phone,
          roomId:this.ruleForm.roomId,
          roomNo:this.ruleForm.roomNo,
          roomGroupName:this.ruleForm.groupName,
          roomGroupId:this.ruleForm.roomGroupId,
          checkInType:this.ruleForm.orderType,
          checkInTime:this.$moment.unix(this.ruleForm.inTime/1000).format('YYYY-MM-DD') + "T" + this.ruleForm.inTimeArr,
          checkOutTime:this.$moment.unix(this.ruleForm.outTime/1000).format('YYYY-MM-DD') + "T" + this.ruleForm.outTimeArr,
          channel:this.ruleForm.channel,
          cardId:this.ruleForm.cardId,
          cardType:this.ruleForm.cardType,
          payType:this.ruleForm.payType,
          remarks:this.ruleForm.remarks,
          id:this.ruleForm.orderId,
          orderSn:this.ruleForm.orderSn,
          subSn:this.ruleForm.subSn,
          liveNow:false
        });

        this.ruleForm.relaOrderList.forEach(function(item, index) {
          orderArr.push({
            realName:item.real_name,
            phone:item.phone,
            roomId:item.room_id,
            roomNo:item.room_no,
            roomGroupName:item.room_group_name,
            roomGroupId:item.room_group_id,
            checkInType:item.check_in_type,
            checkInTime:_self.$moment.unix(item.check_in_time/1000).format('YYYY-MM-DD') + "T" + item.check_in_time_array[1],
            checkOutTime:_self.$moment.unix(item.check_out_time/1000).format('YYYY-MM-DD') + "T" + item.check_out_time_array[1],
            channel:item.channel,
            cardId:item.card_id,
            cardType:item.card_type,
            payType:item.pay_type,
            remarks:item.remarks,
            id:item.id,
            orderSn:item.order_sn,
            subSn:item.sub_sn,
            liveNow:false
          });
        });
        let phoneReg = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
        this.errorTips = '';
        //验证主订单
        if(this.ruleForm.realName == ""){
          this.errorTips = '请填写姓名!';
          return;
        }
        if(this.ruleForm.phone == ""){
          this.errorTips = '请填写手机号!';
          return;
        }
        if(!phoneReg.test(this.ruleForm.phone)){
          this.errorTips = '请填写正确的手机号码!';
          return;
        }
        if(!this.ruleForm.roomId){
          this.errorTips = '请选择房间!';
          return;
        }
        //验证关联订单
        for(var i=0;i<this.ruleForm.relaOrderList.length;i++){
          if(this.ruleForm.relaOrderList[i].real_name == ''){
            this.errorTips = '关联订单中的姓名不能为空!';
            break;
          }
          if(this.ruleForm.relaOrderList[i].phone == ''){
            this.errorTips = '关联订单中的手机号不能为空!';
            return;
          }
          if(!phoneReg.test(this.ruleForm.relaOrderList[i].phone)){
            this.errorTips = '关联订单中的手机号填写有误!';
            return;
          }
          if(!this.ruleForm.relaOrderList[i].room_id){
            this.errorTips = '关联订单中的房间不能为空!!';
            return;
          }
        }

        var params = {
          orders:orderArr
        };
        var postHeader = {"Content-Type":'application/json; charset=UTF-8'};
        this.$api.post('/proxy/order/multi-set', JSON.stringify(params) ,res => {
          this.$Message.success(res.data.desc);
          //this.detailOrder(orderId,orderSn);
          this.chkAll = false;
          this.showEditOrder =false;
          this.handleReset('ruleForm');
        },null,postHeader);
      },
      closeModal() {
        this.cancelOrderOpr(false);
      },
      goOut(formName,type,orderId,orderSn){
        this.errorTips = '';
        this.goOutStatus = true;
        this.showEditOrder = true;
        this.oprType = type;
        this.G_ORDERID = orderId;
        this.G_ORDERSN = orderSn;
      },
      goIn(formName,type,orderId,orderSn){
        this.errorTips = '';
        this.goInStatus = true;
        this.showEditOrder = true;
        this.oprType = type;
        this.G_ORDERID = orderId;
        this.G_ORDERSN = orderSn;
      },
      sendPwd(formName,type,orderId,orderSn){
        this.errorTips = '';
        this.sendPwdStatus = true;
        this.showEditOrder = true;
        this.oprType = type;
        this.G_ORDERID = orderId;
        this.G_ORDERSN = orderSn;
      },
      cancelOrder(formName,type,orderId,orderSn){
        this.errorTips = '';
        this.cancelOrderStatus = true;
        this.showEditOrder = true;
        this.oprType = type;
        this.G_ORDERID = orderId;
        this.G_ORDERSN = orderSn;
      },
      cancelOrderOpr(status,type){
        //this.detailOrder(this.G_ORDERID,this.G_ORDERSN);
        this.goOutStatus = status;
        this.showEditOrder = status;
        this.goInStatus = status;
        this.showEditOrder = status;
        this.sendPwdStatus = status;
        this.showEditOrder = status;
        this.cancelOrderStatus = status;
        this.showEditOrder = status;
        this.checkedOrder = status;
        this.oprType = '';
        this.chkAll = false;
        this.checkList = [];
        this.G_ORDERID = "";
        this.G_ORDERSN = "";
        this.errorTips = "";
        this.updateStatus = false;
      },
      updateOrder(formName,type,orderId,orderSn,timeType){
        this.updateStatus = true;
        this.showEditOrder = false;
        this.oprType = type;
        this.timeType = timeType;
        this.G_ORDERID = orderId;
        this.G_ORDERSN = orderSn;
      },
      selTimeType(event){
        if(event == 1){
          this.timeType = 1;
          this.ruleForm.inTime = this.ruleForm.inTime;
          this.ruleForm.outTime = this.ruleForm.inTime+86400000;
          let time = this.$moment.unix(this.ruleForm.inTime/1000).format('YYYY-MM-DD') + " " + this.ruleForm.inTimeArr;
          this.ruleForm.inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH') + ":00";
          this.ruleForm.outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH') + ":00";
        }else if(event == 2){
          this.timeType = 2;
          this.ruleForm.inTime = this.ruleForm.inTime;
          this.ruleForm.outTime = this.ruleForm.inTime;
          let time = this.$moment.unix(this.ruleForm.inTime/1000).format('YYYY-MM-DD') + " " + this.ruleForm.inTimeArr;
          this.ruleForm.inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH:mm');
          this.ruleForm.outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH:mm');
        }
      },
      selTimeChildType(event,index){
        if(event == 1){
          this.ruleForm.relaOrderList[index].check_in_type = 1;
          this.ruleForm.relaOrderList[index].check_in_time = this.ruleForm.relaOrderList[index].check_in_time;
          this.ruleForm.relaOrderList[index].check_out_time = this.ruleForm.relaOrderList[index].check_in_time+86400000;
          let time = this.$moment.unix(this.ruleForm.relaOrderList[index].check_in_time/1000).format('YYYY-MM-DD') + " " + this.ruleForm.relaOrderList[index].check_in_time_array[1];
          this.ruleForm.relaOrderList[index].check_in_time_array[1] = this.$moment.unix((new Date(time).getTime())/1000).format('HH') + ":00";
          this.ruleForm.relaOrderList[index].check_out_time_array[1] = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH') + ":00";
        }else if(event == 2){
          this.ruleForm.relaOrderList[index].check_in_type = 2;
          this.ruleForm.relaOrderList[index].check_in_time = this.ruleForm.relaOrderList[index].check_in_time;
          this.ruleForm.relaOrderList[index].check_out_time = this.ruleForm.relaOrderList[index].check_in_time;
          let time = this.$moment.unix(this.ruleForm.relaOrderList[index].check_in_time/1000).format('YYYY-MM-DD') + " " + this.ruleForm.relaOrderList[index].check_in_time_array[1];
          this.ruleForm.relaOrderList[index].check_in_time_array[1] = this.$moment.unix((new Date(time).getTime())/1000).format('HH:mm');
          this.ruleForm.relaOrderList[index].check_out_time_array[1] = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH:mm');
        }
      },
      selAllBox(event){
        var _self = this;
        this.checkList = [];
        this.orderUserInfo = [];
        if(event){
          this.chkAll = true;
          this.checkList.push(_self.orderDetailList.id);
          this.orderUserInfo.push({
            realName:_self.orderDetailList.real_name,
            phone:_self.orderDetailList.phone,
            cardType:_self.orderDetailList.card_type,
            cardId:_self.orderDetailList.card_id,
            id:_self.orderDetailList.id,
            groupName:_self.orderDetailList.room_group_name,
            roomNo:_self.orderDetailList.room_no
          });
          if(this.orderDetailList.relaOrderList.length > 0){
            this.orderDetailList.relaOrderList.forEach(function(item, index) {
              _self.checkList.push(item.id);
              _self.orderUserInfo.push({
                realName:item.real_name,
                phone:item.phone,
                cardType:item.card_type,
                cardId:item.card_id,
                id:item.id,
                groupName:item.room_group_name,
                roomNo:item.room_no
              });
            });
          }
        }
        //console.log(this.checkList);
      },
      selOnlyBox(event,val,realName,phone,cardType,cardId,roomNo,groupName){
        if(event.target.checked){
          this.checkList.push(val);
          this.orderUserInfo.push({
            realName:realName,
            phone:phone,
            cardType:cardType,
            cardId:cardId,
            id:val,
            groupName:groupName,
            roomNo:roomNo
          });
          if(this.checkList.length == this.checkAllList){
            this.chkAll = true;
          }
        }else{
          for(var i=0;i<this.checkList.length;i++){
            if(this.checkList[i] == val){
              this.checkList.splice(i,1);
            }
          }
          for(var i=0;i<this.orderUserInfo.length;i++){
            if(this.orderUserInfo[i].id == val){
              this.orderUserInfo.splice(i,1);
            }
          }
          this.chkAll = false;
        }
      },
      getCheck(item,type){
        if(this.oprType=='outRoom' && type == "livedIn"){
          return this.checkList.includes(item) ? item : false;
        }
        if(this.oprType=='sendPwd' && type == "livedIn"){
          return this.checkList.includes(item) ? item : false;
        }
        if(this.oprType=='sendPwd' && type == "notLiveIn"){
          return this.checkList.includes(item) ? item : false;
        }
        if(this.oprType=='inRoom' && type == "notLiveIn"){
          return this.checkList.includes(item) ? item : false;
        }
        if(this.oprType=='cancelOrder' && (type != "livedIn" && type != "levelOff")){
          return this.checkList.includes(item) ? item : false;
        }

        //如果有被禁用的项，过滤掉
        if(this.checkList.includes(item)){
          for(var i=0;i<this.checkList.length;i++){
            if(this.checkList[i] == item){
              this.checkList.splice(i,1);
            }
          }
          console.log(this.checkList);
        }
      },
      setDisabled(item){
        if(this.oprType=='outRoom' && item != "livedIn"){
          return true;
        }
        if(this.oprType=='sendPwd' && (item != "notLiveIn" && item != "livedIn")){
          return true;
        }
        if(this.oprType=='inRoom' && item != "notLiveIn"){
          return true;
        }
        if(this.oprType=='inRoom' && item == "livedIn"){
          return true;
        }
        if(this.oprType=='cancelOrder' && item == "livedIn"){
          return true;
        }
        if(this.oprType=='cancelOrder' && item == "levelOff"){
          return true;
        }
      },
      setRoomStatus(type){
        var url = "";
        var removeTips = "";
        var params = {};
        var postHeader_1 = {"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'};
        var postHeader_2 = {"Content-Type":'application/json; charset=UTF-8'};
        this.errorTips = "";
        if(this.checkList.length == 0){
          this.errorTips = "请选择需要操作的订单！";
          return;
        }
        if(this.oprType=='outRoom'){
          url = '/proxy/order/liveOut';
          params = {id:JSON.stringify(this.checkList).replace(/\[|]/g,'')};
          removeTips = "确定执行退房操作？";
        }
        if(this.oprType=='inRoom'){
          url = '/proxy/order/liveIn';
          params = {
            list: this.orderUserInfo
          };
          var removeTips_1 = "开门密码将立即发送至客人手机，确认将房间";
          var removeTips_2 = "置为入住？";
          var room = "";
          for(var i=0;i<this.orderUserInfo.length;i++){
            room += this.orderUserInfo[i].roomNo + "("+this.orderUserInfo[i].groupName+")" + ",";
          }
          room=(room.substring(room.length-1)==',')?room.substring(0,room.length-1):room;
          removeTips = "<div>"+removeTips_1+"</div>" + "<span class='custom-font-ffa044'>"+room+"</span>" + "<div>"+removeTips_2+"</div>";
        }
        if(this.oprType=='sendPwd'){
          url = '/proxy/order/sendOrderPass';
          params = {id:JSON.stringify(this.checkList).replace(/\[|]/g,'')};
          removeTips = "确定发送密码吗？";
        }
        if(this.oprType=='cancelOrder'){
          url = '/proxy/order/cancel';
          params = {id:JSON.stringify(this.checkList).replace(/\[|]/g,'')};
          removeTips = "确定取消该订单吗？";
        }
        var _self = this;
        this.$Modal.confirm({
          title: '批量操作信息',
          content: "<div class='font-15'>" + removeTips + "</div>",
          onOk: () => {
            this.loading = true;
            if(this.oprType=='inRoom'){
              _self.$api.post(url, JSON.stringify(params) ,res => {
                this.$Message.success(res.data.desc);
                this.checkList = [];
                this.detailOrder(this.G_ORDERID,this.G_ORDERSN);
                this.chkAll = false;
                this.showEditOrder =false;
                this.cancelOrderOpr(false);
                this.loading = false;
              },res=>{
                this.$Message.error(res.data.desc);
                this.loading = false;
              },postHeader_2);
            }else{
              _self.$api.postQs(url, params ,res => {
                this.$Message.success(res.data.desc);
                this.checkList = [];
                this.detailOrder(this.G_ORDERID,this.G_ORDERSN);
                this.chkAll = false;
                this.showEditOrder =false;
                this.cancelOrderOpr(false);
                this.loading = false;
              },res=>{
                this.$Message.error(res.data.desc);
                this.loading = false;
              },postHeader_1);
            }
          }
        });
      },
      chgRoom(event,roomId,roomNo,groupName,groupId){
        this.ruleForm.roomId = roomId;
        this.ruleForm.roomNo = roomNo;
        this.ruleForm.groupName = groupName;
        this.ruleForm.roomGroupId = groupId;
      },
      chgChildRoom($event,index,roomId,roomNo,groupName,groupId){
        this.ruleForm.relaOrderList[index].room_id = roomId;
        this.ruleForm.relaOrderList[index].room_no = roomNo;
        this.ruleForm.relaOrderList[index].room_group_name = groupName;
        this.ruleForm.relaOrderList[index].room_group_id = groupId;
      },
      chgCardType(event){
        this.ruleForm.cardType = event;
      },
      chgMainTime(event,type){
        if(type == 'mainInTime'){
          this.ruleForm.inTime = new Date(event).getTime();
          if(this.ruleForm.orderType == 1){
            this.ruleForm.outTime = new Date(event).getTime() + 86400000;
          }
          if(this.ruleForm.orderType == 2){
            var time = event + " " + this.ruleForm.inTimeArr;
            this.ruleForm.outTime = new Date(event).getTime();
            this.ruleForm.outTimeArr = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleForm.outTime = new Date(event).getTime();
        }
      },
      chgChildTime(event,index,type){
        var _self = this;
        if(type == 'inTime'){
          this.ruleForm.relaOrderList[index].check_in_time = new Date(event).getTime();
          if(this.ruleForm.relaOrderList[index].check_in_type == 1){
            this.ruleForm.relaOrderList[index].check_out_time = new Date(event).getTime() + 86400000;
          }
          if(this.ruleForm.relaOrderList[index].check_in_type == 2){
            var time = event + " " + this.ruleForm.relaOrderList[index].check_in_time_array[1];
            this.ruleForm.relaOrderList[index].check_out_time = new Date(event).getTime();
            this.ruleForm.relaOrderList[index].check_out_time_array[1] = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
            this.ruleForm.relaOrderList[index].check_out_time_array.splice(1,1,this.ruleForm.relaOrderList[index].check_out_time_array[1]);

          }
        }
        if(type == 'outTime'){
          this.ruleForm.relaOrderList[index].check_out_time = new Date(event).getTime();
        }
      },
      openOutTime(event,index,type){//根据入住时间控制离店时间禁用时间段
        var _self = this;
        if(event){
          if(type=='main'){
            this.optionsEnd = {
              disabledDate(date){
                let time = _self.ruleForm.inTime;
                let dateStart = new Date(_self.$moment.unix(time/1000).format('YYYY-MM-DD'));
                return date && date.valueOf() < (dateStart);
              }
            };
          }

          if(type=='child'){
            this.optionsEndChild = {
              disabledDate(date){
                let time = _self.ruleForm.relaOrderList[index].check_in_time;
                let dateStart = new Date(_self.$moment.unix(time/1000).format('YYYY-MM-DD'));
                return date && date.valueOf() < (dateStart);
              }
            };
          }
        }
      },
      chgMainTag(event,obj){
        this.ruleForm.selTagId = event;
        this.setRoomRemain(obj.check_in_time,obj.check_out_time,this.ruleForm.selTagId?this.ruleForm.selTagId:event,this.ruleForm.selTypeId ? this.ruleForm.selTypeId : this.ruleForm.roomTypeId,obj,null);
        //this.getRoomRemain(event,this.ruleForm.selTypeId ? this.ruleForm.selTypeId : this.ruleForm.roomTypeId,null,obj);
      },
      chgChildTag(event,index,obj){
        this.ruleForm.relaOrderList[index]['selTagId'] = event;
        this.setRoomRemain(obj.check_in_time,obj.check_out_time,this.ruleForm.relaOrderList[index]['selTagId']?this.ruleForm.relaOrderList[index]['selTagId']:event,this.ruleForm.relaOrderList[index]['selTypeId'] ? this.ruleForm.relaOrderList[index]['selTypeId'] : this.ruleForm.relaOrderList[index].room_type_id,obj,index);
        //this.getRoomRemain(event,this.ruleForm.relaOrderList[index]['selTypeId'] ? this.ruleForm.relaOrderList[index]['selTypeId'] : this.ruleForm.relaOrderList[index].room_type_id,index,obj);
      },
      chgMainType(event,obj){
        this.ruleForm.selTypeId = event;
        this.setRoomRemain(obj.check_in_time,obj.check_out_time,this.ruleForm.selTagId?this.ruleForm.selTagId:this.ruleForm.tags[0].id,this.ruleForm.selTypeId ? this.ruleForm.selTypeId : event,obj,null);
        //this.getRoomRemain(this.ruleForm.selTagId?this.ruleForm.selTagId:this.ruleForm.tags[0].id,event,null,obj);
      },
      chgChildType(event,index,obj){
        this.ruleForm.relaOrderList[index]['selTypeId'] = event;
        this.setRoomRemain(obj.check_in_time,obj.check_out_time,this.ruleForm.relaOrderList[index]['selTagId']?this.ruleForm.relaOrderList[index]['selTagId']:this.ruleForm.relaOrderList[index].room_tags[0].id,this.ruleForm.relaOrderList[index]['selTypeId'] ? this.ruleForm.relaOrderList[index]['selTypeId'] : event,obj,index);
        //this.getRoomRemain(this.ruleForm.relaOrderList[index]['selTagId']?this.ruleForm.relaOrderList[index]['selTagId']:this.ruleForm.relaOrderList[index].room_tags[0].id,event,index,obj);
      },
      getRoomRemain(tagId,typeId,index,obj){
        let startTime = "";
        let endTime = "";
        if(index>=0 && index != null){
          startTime = this.$moment.unix(this.ruleForm.relaOrderList[index].check_in_time/1000).format('YYYY-MM-DD') + " " + this.ruleForm.relaOrderList[index].check_in_time_array[1];
          endTime = this.$moment.unix(this.ruleForm.relaOrderList[index].check_out_time/1000).format('YYYY-MM-DD') + " " + this.ruleForm.relaOrderList[index].check_out_time_array[1];
        }else{
          startTime = this.$moment.unix(this.ruleForm.inTime/1000).format('YYYY-MM-DD') + " " + this.ruleForm.inTimeArr;
          endTime = this.$moment.unix(this.ruleForm.outTime/1000).format('YYYY-MM-DD') + " " + this.ruleForm.outTimeArr;
        }
        var params = {
          page:1,
          num:9999,
          startTime:startTime,
          endTime:endTime,
          roomTypeId:typeId,
          roomTagIds:tagId,
          notInIds:(this.allOrderId.substring(this.allOrderId.length-1)==',')?this.allOrderId.substring(0,this.allOrderId.length-1):this.allOrderId
        };

        this.$api.get("/proxy/room/remains", this.$utils.clearData(params) ,res => {
          //过滤已经被选的房间
          var data = Object.assign({}, res.data);
          var arr = [];
          for(var i=0;i<data.data.length;i++){
            if(this.isInArray(this.roomArr,data.data[i].id) == false){
              arr.push(data.data[i]);
            }
          }
          this.roomList = arr;
          if(this.roomList.length == 0){
            if(index>=0 && index != null){
              this.ruleForm.relaOrderList[index].room_id = '';
            }else{
              this.ruleForm.roomId = '';
            }
          }
          //默认选中第一个房间
          /*if(obj){
            if(index>=0 && index != null){
              if(this.roomList.length == 0){
                this.ruleForm.relaOrderList[index].room_id = '';
              }
              if(obj.roomId == this.roomList[0].id){
                if(this.roomList.length > 0){
                  this.ruleForm.relaOrderList[index].room_id = data.data[0].id;
                  this.ruleForm.relaOrderList[index].room_no = data.data[0].room_no;
                  this.ruleForm.relaOrderList[index].room_group_name = data.data[0].group_level1_name;
                  this.ruleForm.relaOrderList[index].room_group_id = data.data[0].group_level1_id;
                }else{
                  this.ruleForm.relaOrderList[index].room_id = '';
                }
              }else {
                if(this.roomList.length > 0){
                  this.ruleForm.relaOrderList[index].room_id = data.data[0].id;
                  this.ruleForm.relaOrderList[index].room_no = data.data[0].room_no;
                  this.ruleForm.relaOrderList[index].room_group_name = data.data[0].group_level1_name;
                  this.ruleForm.relaOrderList[index].room_group_id = data.data[0].group_level1_id;
                }else{
                  this.ruleForm.relaOrderList[index].room_id = '';
                }
              }
            }else{
              if(this.roomList.length == 0){
                this.ruleForm.roomId = '';
              }
              if(obj.roomId == this.roomList[0].id){
                if(this.roomList.length > 0){
                  this.ruleForm.roomId = data.data[0].id;
                  this.ruleForm.roomNo = data.data[0].room_no;
                  this.ruleForm.groupName = data.data[0].group_level1_name;
                  this.ruleForm.roomGroupId = data.data[0].group_level1_id;
                }else{
                  this.ruleForm.roomId = '';
                }
              }else {
                if(this.roomList.length > 0){
                  this.ruleForm.roomId = data.data[0].id;
                  this.ruleForm.roomNo = data.data[0].room_no;
                  this.ruleForm.groupName = data.data[0].group_level1_name;
                  this.ruleForm.roomGroupId = data.data[0].group_level1_id;
                }else{
                  this.ruleForm.roomId = '';
                }
              }
            }
          }*/
        });
      },
      selMainTime(event,type){
        if(type == 'mainInTime'){
          this.ruleForm.inTimeArr = event;
          if(this.ruleForm.orderType == 2){
            var time1 = this.$moment.unix(this.ruleForm.inTime/1000).format('YYYY-MM-DD') + " " + event;
            var time = new Date(time1).getTime() + 3600000;
            this.ruleForm.outTimeArr = this.$moment.unix(time/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleForm.outTimeArr = event;
        }
      },
      selChildTime(event,index,type){
        var _self = this;
        if(type == 'inTime'){
          this.ruleForm.relaOrderList[index].check_in_time_array[1] = event;
          if(this.ruleForm.relaOrderList[index].check_in_type == 2){
            var time = this.$moment.unix(this.ruleForm.relaOrderList[index].check_in_time/1000).format('YYYY-MM-DD') + " " + event;
            this.ruleForm.relaOrderList[index].check_out_time_array[1] = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
            this.ruleForm.relaOrderList[index].check_out_time_array.splice(1,1,this.ruleForm.relaOrderList[index].check_out_time_array[1]);
          }
        }
        if(type == 'outTime'){
          this.ruleForm.relaOrderList[index].check_out_time_array.splice(1,1,event);
        }
      },
      clearTag(){
        this.selTagId = '';
      },
      clearRoomType(){
        this.selTypeId = '';
      },
      clearRoomChildType(index){
        this.ruleForm.relaOrderList[index].selTypeId = '';
      },
      clearChildTag(index){
        this.ruleForm.relaOrderList[index].selTagId = '';
      },
      filterRoom(event,roomId,startTime,endTime,tagId,typeId,obj,index){//过滤已经选择的房间
        if(event){
          this.setRoomRemain(startTime,endTime,tagId,typeId,obj,index);
        }
      },
      setRoomRemain(startTime,endTime,tagId,typeId,obj,index){
        this.roomArr = [];
        let startInTime = "";
        let endOutTime = "";
        let selfStartTime = startTime;
        let selfEndTime = endTime;
        let timeList = [];
        timeList.push(this.ruleForm);
        for(var i=0;i<this.ruleForm.relaOrderList.length;i++){
          timeList.push(this.ruleForm.relaOrderList[i]);
        }
        for(var i=0;i<timeList.length;i++){
          if(i==0){
            if(obj != timeList[i]){
              this.roomArr.push(timeList[i].roomId);
            }
            startInTime = timeList[i].inTime;
            endOutTime = timeList[i].outTime;
          }else{
            if(obj != timeList[i]){
              this.roomArr.push(timeList[i].room_id);
            }
            startInTime = timeList[i].check_in_time;
            endOutTime = timeList[i].check_out_time;
          }
          if(obj != timeList[i]){
            if((selfStartTime <= startInTime && selfEndTime > startInTime) || (selfStartTime >= startInTime && selfStartTime < endOutTime)){
              this.roomArr = this.roomArr;
            }else{
              this.roomArr = [];
            }
          }
        }
        this.getRoomRemain(tagId,typeId,index,obj);
      },
      isInArray(arr,value){//判断数组中存在某个原素
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      }
    },
    mounted () {
      this.init();
    },
    watch: {
      'checkList': {
        handler: function(val, oldVal) {
          /*if (val.length === this.checkboxList.length) {
            this.checked = true;
          } else {
            this.checked = false;
          }*/
        }
      }
    },
  }
</script>
<style>

</style>
