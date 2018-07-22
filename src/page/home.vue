<template>
  <div class="main-content-bg">
    <div class="home-left-menu">
      <div class="home-left-menu-search">
        <Input icon="ios-search" v-model="searchRoomNo" clearable @on-click="search" @on-change="search" placeholder="请输入房间号" style="width: 200px" :maxlength="20"></Input>
      </div>
      <!--快捷搜索-->
      <div class="margin-top15-left20">
        <div>
          <span class="home-title">房间筛选</span>
        </div>
        <div style="margin-top:10px;position: relative">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomGroup}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in groupList.list" :key="index" :data-name="item.name" @click.native="selGroup($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <i v-if="groupClose" class="fa fa-close custom-font-ffa044" style="position: absolute;top:0px;right:5px;" @click="closeGroup()"></i>
        </div>
        <div class="margin-top15" style="position: relative">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomType}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in typeList" :key="index" :data-name="item.name" @click.native="selType($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <i v-if="typeClose" class="fa fa-close custom-font-ffa044" style="position: absolute;top:0px;right:5px;" @click="closeType()"></i>
        </div>
        <div class="margin-top15" style="position: relative">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomTags}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in tagList" :key="index" :data-name="item.tag" @click.native="selTag($event,item.id)">{{item.tag}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <i v-if="tagsClose" class="fa fa-close custom-font-ffa044" style="position: absolute;top:0px;right:5px;" @click="closeTag()"></i>
        </div>
      </div>
      <div class="margin-top15-left20">
        <div>
          <span class="home-title">房态统计</span>
        </div>
        <div class="margin-top10">
            <div v-for="(item,index) in statusList" :key="index">
              <Row class="w200 margin-top10" v-if="item.status == 0">
                <Col span="20">
                <span>全部</span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 1">
                <Col span="20">
                <span>空净</span>
                <span class="home-status-num block-green"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 2">
                <Col span="20">
                <span>空脏</span>
                <span class="home-status-num block-gray"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 3">
                <Col span="20">
                <span>住净</span>
                <span class="home-status-num block-blue"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 4">
                <Col span="20">
                <span>住脏</span>
                <span class="home-status-num block-link"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 99">
                <Col span="20">
                <span>停用</span>
                <span class="home-status-num block-red"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 101">
                <Col span="20">
                <span>预定</span>
                <span class="home-status-num">
                  <i class="fa fa-calendar-minus-o text-green" style="font-size: 10px"></i>
                </span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 102">
                <Col span="20">
                <span>维修</span>
                <span class="home-status-num">
                  <i class="fa fa-warning custom-font-ffa044" style="font-size: 10px"></i>
                </span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
            </div>
        </div>
      </div>
    </div>
    <div class="home-right-menu" :style="styleMenuObject">
      <Spin fix v-if="showLoading">
        <Icon type="load-c" size=25 class="demo-spin-icon-load text-green"></Icon>
        <div class="text-green">Loading</div>
      </Spin>
      <div>
        <Button type="success" icon="plus" @click="showOrder()">
          创建订单
        </Button>
        <Dropdown trigger="click" class="w100">
          <a class="text-gray" href="javascript:void(0)">
            {{orderByText}}
            <Icon type="arrow-down-b" style="float: right;position: relative;top:2px;"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem data-name="1" data-text="按房型排序" @click.native="sortRoomList($event)">按房型排序</DropdownItem>
            <DropdownItem data-name="2" data-text="按房态排序" @click.native="sortRoomList($event)">按房态排序</DropdownItem>
            <DropdownItem data-name="3" data-text="按区域排序" @click.native="sortRoomList($event)">按区域排序</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="line"></div>
      <div class="margin-top15">
        <div v-for="(item,index) in roomList" :key="index">
          <div class="" v-if="item.orderBy == 1">
            <div class="custom-font-434343 strong-font font-15 margin-top15">
              <span class="">{{item.orderByName}}</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
          </div>

          <div class="" v-if="item.orderBy == 2">
            <div class="custom-font-434343 strong-font font-15 margin-top15" v-if="item.orderById == 1">
              <span class="">空净</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
            <div class="custom-font-434343 strong-font font-15 margin-top15" v-if="item.orderById == 2">
              <span class="">空脏</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
            <div class="custom-font-434343 strong-font font-15 margin-top15" v-if="item.orderById == 3">
              <span class="">住净</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
            <div class="custom-font-434343 strong-font font-15 margin-top15" v-if="item.orderById == 4">
              <span class="">住脏</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
            <div class="custom-font-434343 strong-font font-15 margin-top15" v-if="item.orderById == 99">
              <span class="">停用</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
          </div>
          <div class="" v-if="item.orderBy == 3">
            <div class="custom-font-434343 strong-font font-15 margin-top15">
              <span class="">{{item.orderByName}}</span>
              <span class="text-green">{{item.size}}</span>
              <span>间</span>
            </div>
          </div>

          <Poptip class="margin-bottom10 home-pop" placement="bottom" width="310" v-for="(item,index) in item.list" :key="index" @on-popper-show="getOrderList(item.id)" style="position: relative">
            <Card class="home-card-border home-card-content">
              <div class="home-card-block">
                <div class="home-card-title font-15">{{item.room_no}}</div>
                <div class="home-card-area">{{item.name}}</div>
                <div class="home-card-parm">
                  <span class="font-12">{{item.room_type}}</span>
                  <span>
                    <!--<Tag>
                      <tagsName :tags="item.room_tags"></tagsName>
                    </Tag>-->
                    <component v-bind:my-data="item.room_tags" v-bind:my-list="allTagList" v-bind:is="currentView">
                      <!-- 组件在 vm.currentview 变化时改变！ -->
                    </component>
                    <span v-if="JSON.parse(item.room_tags).length > 2">
                      <Poptip trigger="hover" placement="right" width="80">
                        <i class="fa fa-info-circle text-green"></i>
                        <div class="api" slot="content">
                          <div v-for="(itemTag,indexTag) in JSON.parse(item.room_tags)" :key="indexTag">
                            <div v-for="(itemAll,indexAll) in allTagList" :key="indexAll">
                              <div v-if="itemTag == itemAll.id">
                                {{itemAll.tag}}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Poptip>
                    </span>
                  </span>
                </div>
                <div class="margin-top10">
                  <!--<span class="home-room-statusIcon-bulid span-inline"></span>
                  <span class="home-room-statusIcon-clean span-inline"></span>-->
                  <i class="fa fa-calendar-minus-o text-green" aria-hidden="true" v-if="item.book_status != 0"></i>
                  <i class="fa fa-warning custom-font-ffa044" aria-hidden="true" v-if="item.fix_status == 1"></i>
                </div>
                <div>
                  <div class="home-card-lock-status">
                    <div v-if="item.iotdeviceId">
                      <div v-if="item.status == 2">
                        <div v-if="item.battery_status == 2">
                          <span class="home-room-lockIcon-status span-inline"></span>
                          <span class="home-room-lock-text">门锁电量低</span>
                        </div>
                        <div v-else>
                          <span class="home-room-lockIcon-status span-inline"></span>
                          <span class="home-room-lock-text">门锁异常</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.iotdeviceId == null">
                      <span class="home-room-lockIcon-status span-inline"></span>
                      <span class="home-room-lock-text">门锁未安装</span>
                    </div>
                  </div>
                  <div class="home-card-room-status">
                    <div class="home-room-statusBg-kongjing home-room-status-text" v-if="item.use_status == 1">
                      空净
                    </div>
                    <div class="home-room-statusBg-kongzang home-room-status-text" v-if="item.use_status == 2">
                      空脏
                    </div>
                    <div class="home-room-statusBg-zhujing home-room-status-text" v-if="item.use_status == 3">
                      住净
                    </div>
                    <div class="home-room-statusBg-zhuzang home-room-status-text" v-if="item.use_status == 4">
                      住脏
                    </div>
                    <div class="home-room-statusBg-stop home-room-status-text" v-if="item.use_status == 99">
                      停用
                    </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </Card>
            <div class="api" slot="content" style="position: relative;">
              <div v-if="item.iotdeviceId">
                <div v-if="item.status == 2">
                  <div v-if="item.battery_status == 2">
                    <span class="custom-font-ffa044">告警:</span>
                    <span class="custom-font-ffa044">门锁电量低</span>
                  </div>
                  <div v-else>
                    <span class="custom-font-ffa044">告警:</span>
                    <span class="custom-font-ffa044">门锁异常</span>
                  </div>
                </div>
              </div>
              <div v-if="item.enable_des">
                <span class="custom-font-ffa044">停用:</span>
                <span class="custom-font-ffa044">{{item.enable_des}}</span>
              </div>
              <div v-if="item.fix_des">
                <span class="custom-font-ffa044">故障:</span>
                <span class="custom-font-ffa044">{{item.fix_des}}</span>
              </div>
              <div class="margin-top10">
                <template>
                  <div v-if="item.use_status == 1 && item.iotdeviceId">
                    <div v-if="item.status == 2">
                      <div v-if="item.battery_status == 2">
                        <Button type="success" size="small" disabled>入住</Button>
                        <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                        <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                        <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                        <Button type="error" size="small" v-if="item.book_status != 1" @click="show('stop',item.id,item.room_no,item.name)">停用</Button>
                      </div>
                      <div v-else>
                        <Button type="success" size="small" @click="goIn(item.room_no,item.id,item.group_level1_name,item.group_level1_id)">入住</Button>
                        <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                        <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                      </div>
                    </div>
                    <div v-else>
                      <Button type="success" size="small" @click="goIn(item.room_no,item.id,item.group_level1_name,item.group_level1_id)">入住</Button>
                      <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                      <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                      <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                      <Button type="error" size="small" v-if="item.book_status != 1" @click="show('stop',item.id,item.room_no,item.name)">停用</Button>
                    </div>
                  </div>
                  <div v-if="item.use_status == 1 && !item.iotdeviceId">
                    <Button type="success" size="small" disabled>入住</Button>
                    <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                    <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                    <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                    <Button type="error" size="small" v-if="item.book_status != 1" @click="show('stop',item.id,item.room_no,item.name)">停用</Button>
                  </div>
                </template>

                <template>
                  <div v-if="item.use_status == 2">
                    <Button type="success" size="small" @click="goIn(item.room_no,item.id,item.group_level1_name,item.group_level1_id)">入住</Button>
                    <Button type="ghost" size="small" @click="setJing(item.id)">置净</Button>
                    <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                    <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                    <Button type="error" size="small" v-if="item.book_status != 1" @click="show('stop',item.id,item.room_no,item.name)">停用</Button>
                  </div>
                </template>

                <template>
                  <div v-if="item.use_status == 3">
                    <Button type="ghost" size="small" @click="setLogut(item.live_order_id,item.room_no,item.name)">退房</Button>
                    <Button type="ghost" size="small" @click="setLong(item.live_order_id,item.live_real_name,item.live_start_time,item.live_end_time)">延住</Button>
                    <Button type="ghost" size="small" @click="setChgRoom(item.live_order_id,item.room_no,item.group_level1_name,item.live_real_name,item.live_start_time,item.live_end_time)">换房</Button>
                    <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                    <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                    <Button type="warning" size="small"v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                  </div>
                </template>

                <template>
                  <div v-if="item.use_status == 4">
                    <Button type="ghost" size="small" @click="setLogut(item.live_order_id,item.room_no,item.name)">退房</Button>
                    <Button type="ghost" size="small" @click="setLong(item.live_order_id,item.live_real_name,item.live_start_time,item.live_end_time)">延住</Button>
                    <Button type="ghost" size="small" @click="setChgRoom(item.live_order_id,item.room_no,item.group_level1_name,item.live_real_name,item.live_start_time,item.live_end_time)">换房</Button>
                    <Button type="ghost" size="small" @click="setJing(item.id)">置净</Button>
                    <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                    <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                  </div>
                </template>

                <template>
                  <div v-if="item.use_status == 99">
                    <Button type="ghost" size="small" @click="setEnable(item.id)">启用</Button>
                    <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                    <Button type="warning" size="small" v-else @click="show('fault',item.id,item.room_no,item.name)">故障</Button>
                  </div>
                </template>
              </div>
              <div>
                <Card class="margin-top15 home-roomlist-status border-green" v-if="item.live_user_id">
                  <div>
                    <Row>
                      <Col span="12">
                      <span class="small-text text-green">订单状态</span>
                      <span class="small-text text-green">入住</span>
                      </Col>
                      <Col span="12">
                      <span class="small-text text-green">姓名</span>
                      <span class="small-text text-green">{{username}}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="12">
                      <span class="small-text text-green">入住</span>
                      <span class="small-text text-green">{{$moment.unix(inTime/1000).format("YYYY-MM-DD HH:mm")}}</span>
                      </Col>
                      <Col span="12">
                      <span class="small-text text-green">离店</span>
                      <span class="small-text text-green">{{$moment.unix(outTime/1000).format("YYYY-MM-DD HH:mm")}}</span>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
              <!--<div class="margin-top10">
                <div class="line"></div>
                <Row :gutter="16">
                  <Col span="12" class="home-roomlist-status-other">
                  <Card>
                    <div>
                      <span class="small-text custom-font-999999">订单状态</span>
                      <span class="small-text custom-font-999999">入住</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">姓名</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">入住</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">离店</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                  </Card>
                  </Col>
                  <Col span="12" class="home-roomlist-status-other">
                  <Card>
                    <div>
                      <span class="small-text custom-font-999999">订单状态</span>
                      <span class="small-text custom-font-999999">入住</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">姓名</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">入住</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                    <div>
                      <span class="small-text custom-font-999999">离店</span>
                      <span class="small-text custom-font-999999">xxxxxx</span>
                    </div>
                  </Card>
                  </Col>
                </Row>
              </div>-->
            </div>
          </Poptip>
          <div style="clear: both"></div>
        </div>
      </div>
    </div>
    <div style="clear: both"></div>

    <!--停用和故障-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addModal"
      title=""
      @on-visible-change="chgModal"
      class="home-textarea">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleForm" ref="ruleForm" style="width: 100%;margin:0 auto;">
        <FormItem prop="enableDes" :rules="$filter_rules({required:true})" v-if="setType == 'stop'">
          <Input v-model="ruleForm.enableDes" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入不超过400个字符长度的信息" :maxlength="400"></Input>
        </FormItem>
        <FormItem prop="fixDes" :rules="$filter_rules({required:true})" v-if="setType == 'fault'">
          <Input v-model="ruleForm.fixDes" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="请输入不超过400个字符长度的信息" :maxlength="400"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button v-if="setType == 'stop'" type="success" :loading="modal_loading" @click="setDisabled('ruleForm')">
          <span v-if="!loading">保存</span>
          <span v-else>Loading...</span>
        </Button>
        <Button v-if="setType == 'fault'" type="success" :loading="modal_loading" @click="setFault('ruleForm')">
          <span v-if="!loading">保存</span>
          <span v-else>Loading...</span>
        </Button>
        <Button type="ghost" @click="handleReset('ruleForm')">取消</Button>
      </div>
    </Modal>

    <!--延长住店时间-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addLongModal"
      title=""
      @on-visible-change = "chgModal" class="home-textarea">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleLongForm" ref="ruleLongForm" :label-width="160" style="width: 100%;margin:0 auto;">
        <FormItem label="客人" class="margin-bottom0">
          <span>{{ruleLongForm.realName}}</span>
        </FormItem>
        <FormItem label="入住时间" class="margin-bottom0">
          <span>{{$moment.unix(ruleLongForm.inTime/1000).format("YYYY-MM-DD HH:mm")}}</span>
        </FormItem>
        <FormItem label="离店时间" class="margin-bottom0">
          <span>{{$moment.unix(ruleLongForm.outTime/1000).format("YYYY-MM-DD HH:mm")}}</span>
        </FormItem>
        <FormItem label="延长离店时间至" prop="checkOutTime" :rules="$filter_rules({required:true})" class="margin-bottom0">
          <DatePicker type="datetime" v-model="ruleLongForm.checkOutTime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" :options="optionsEnd" @on-change="selEndTime($event)" style="width: 150px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="loading" @click="saveLong('ruleLongForm')">
          <span v-if="!loading">保存</span>
          <span v-else>Loading...</span>
        </Button>
        <Button type="ghost" @click="handleReset('ruleLongForm')">取消</Button>
      </div>
    </Modal>

    <!--更换房间-->
    <Modal
      :styles="{top: '65px'}"
      v-model="addChgModal"
      title=""
      @on-visible-change = "chgModal" class="home-textarea">
      <div slot="header" class="modalTitle">
        <h3>{{modalTitle}}</h3>
      </div>
      <Form :model="ruleChgForm" ref="ruleChgForm" :label-width="160" style="width: 100%;margin:0 auto;">
        <FormItem label="房间号" class="margin-bottom0">
          <span>{{ruleChgForm.roomNoText}}</span>
        </FormItem>
        <FormItem label="客人" class="margin-bottom0">
          <span>{{ruleChgForm.realName}}</span>
        </FormItem>
        <FormItem label="入住时间" class="margin-bottom0">
          <span>{{ruleChgForm.inTime}}</span>
        </FormItem>
        <FormItem label="离店时间" class="margin-bottom0">
          <span>{{ruleChgForm.outTime}}</span>
        </FormItem>
        <FormItem label="房型选择" class="margin-bottom10">
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              {{roomTypeText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem data-name="全部" @click.native="selRoomType($event,'')">全部</DropdownItem>
              <DropdownItem v-for="(item,index) in typeList" :key="index" :data-name="item.name" @click.native="selRoomType($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房间特性" class="margin-bottom10">
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              {{roomTagText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem data-name="全部" @click.native="selRoomTag($event,'')">全部</DropdownItem>
              <DropdownItem v-for="(item,index) in tagList" :key="index" :data-name="item.tag" @click.native="selRoomTag($event,item.id)">{{item.tag}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <FormItem label="房态筛选" class="margin-bottom0">
          <RadioGroup v-model="ruleChgForm.statusRadio">
            <Radio label="空净"></Radio>
            <Radio label="空脏"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择房间" class="margin-bottom0" prop="groupLevel1Name" :rules="$filter_rules({required:true})">
          <Input v-model="ruleChgForm.groupLevel1Name" style="display: none"></Input>
          <Dropdown trigger="click" class="w200">
            <Button type="default" class="dropdown-align-100">
              {{roomRoomText}}
              <Icon type="arrow-down-b" class="dropdown-icon-align-2"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in roomSearchList" :key="index" :data-name="item.id" @click.native="selRoomList($event,item.id,item.group_level1_name)">{{item.room_no}}({{item.group_level1_name}})</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="loading" @click="saveChgRoom('ruleChgForm')">
          <span v-if="!loading">保存</span>
          <span v-else>Loading...</span>
        </Button>
        <Button type="ghost" @click="handleReset('ruleChgForm')">取消</Button>
      </div>
    </Modal>

    <!--创建订单-->
    <Modal
      :styles="{top: '65px'}"
      v-model="showmodel"
      :mask-closable="false"
      :closable="false"
      @on-visible-change = "chgOrderModal"  width="760" class="orderTab orderCard">

      <div slot="header" class="modalTitle">
        <Tabs @on-click="tabChange($event)" :value="tabType">
          <TabPane label="入住" name="in"></TabPane>
          <TabPane label="预定" name="checkin"></TabPane>
        </Tabs>
      </div>

      <Form ref="ruleOrderForm" inline v-for="(item,index) in ruleOrderForm" :key="index" class="margin-bottom10" style="position:relative">
        <i v-if="index != 0" class=" fa fa-remove" style="position: absolute;right:-13px;top:40px;" @click="mutiOrder(index)"></i>
        <div style="border:1px solid #dddddd;border-radius: 5px">
          <div class="editOrder">
            <FormItem label="姓名:" class="margin-bottom0" :label-width="50">
              <Input type="text" size="small" style="width:100px" v-model="item.realName" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="手机:" class="margin-bottom0" :label-width="50">
              <Input type="text" size="small" style="width:100px" v-model="item.phone" :maxlength="11"></Input>
            </FormItem>
            <FormItem :label-width="50" label="证件:" class="margin-bottom0">
              <Select size="small" v-model="item.cardType" style="width:100px" @on-change="chgCardType($event,index)">
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
              <Input placeholder="" size="small" style="width:187px"  v-model="item.cardId" :maxlength="18"></Input>
            </FormItem>
          </div>

          <div class="editOrder">
            <FormItem :label-width="50" label="房间:" class="margin-bottom0">
              <Select v-model="item.roomId" clearable size="small" style="width:100px" @on-open-change="filterRoom($event,item.roomId,item.inTime,item.outTime,item.tags,item.roomTypeId,item,index)">
                <Option v-for="(itemRoom,indexRoom) in roomOrderList" :key="indexRoom" :value="itemRoom.id" @click.native="chgRoom($event,index,itemRoom.id,itemRoom.room_no,itemRoom.group_level1_name,itemRoom.group_level1_id)">{{itemRoom.room_no}}({{itemRoom.group_level1_name}})</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="特性:" class="margin-bottom0">
              <Select v-model="item.tags" clearable size="small" style="width:100px" @on-change="chgMainTag($event,item,index)" @on-clear="clearTag(index)">
                <Option v-for="(itemTag,indexTag) in tagOrderList" :key="indexTag" :value="itemTag.id">{{itemTag.tag}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="50" label="入住:" class="margin-bottom0">
              <Input v-if="tabType == 'in'" size="small" v-model="item.inTime + ' ' + item.inTimeArr" style="width: 153px"></Input>
              <DatePicker v-if="tabType == 'checkin'" size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.inTime" @on-change="chgMainTime($event,'mainInTime',index)"></DatePicker>
              <TimePicker v-show="item.timeType == 1 && tabType == 'checkin'" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
              <TimePicker v-show="item.timeType == 2 && tabType == 'checkin'" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.inTimeArr" @on-change="selMainTime($event,'mainInTime',index)"></TimePicker>
            </FormItem>
            <FormItem :label-width="50" label="离店:" class="margin-bottom0">
              <DatePicker size="small" type="date" placeholder="Select date" style="width: 90px" :value="item.outTime" :options="optionsOrderEnd" @on-change="chgMainTime($event,'mainOutTime',index)" @on-open-change="openOutTime($event,index,'main')"></DatePicker>
              <TimePicker v-show="item.timeType == 1" format="HH:mm" :steps="[1, 100]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
              <TimePicker v-show="item.timeType == 2" format="HH:mm" :steps="[1, 5]" size="small" placeholder="Select time" style="width:60px" :value="item.outTimeArr" @on-change="selMainTime($event,'mainOutTime',index)"></TimePicker>
            </FormItem>
          </div>

          <div class="editOrder">
            <FormItem :label-width="50" label="房型:" class="margin-bottom0">
              <Select v-model="item.roomTypeId" clearable size="small" style="width:100px" @on-change="chgMainType($event,item,index)" @on-clear="clearRoomType(index)">
                <Option v-for="(itemType,indexType) in typeList" :key="indexType" :value="itemType.id">{{itemType.name}}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="70" label="订单类型:" class="margin-bottom0">
              <RadioGroup v-model="item.timeType" size="small" type="button" @on-change="selTimeType($event,index)">
                <Radio label="1">日租</Radio>
                <Radio label="2">时租</Radio>
              </RadioGroup>
            </FormItem>
          </div>
        </div>
      </Form>
      <div class="margin-top10">
        <label class="text-green" @click="addOrder()">
          <i class=" fa fa-plus-circle"></i>
          添加房间
        </label>
      </div>

      <div>
        <Form inline :label-width="70">
          <div class="editOrder">
            <FormItem label="支付类型:" class="margin-bottom0">
              <Select v-model="payType" clearable style="width:100px" size="small">
                <Option value="1">到店现付</Option>
                <Option value="2">已担保</Option>
                <Option value="3">全额预付</Option>
                <Option value="4">部分预付</Option>
              </Select>
            </FormItem>
            <FormItem label="渠道来源:" class="margin-bottom0">
              <Select v-model="channel" clearable style="width:100px" size="small">
                <Option value="1">线下</Option>
                <Option value="2">携程</Option>
                <Option value="3">艺龙</Option>
                <Option value="4">去哪儿</Option>
                <Option value="5">飞猪</Option>
                <Option value="99">其他</Option>
              </Select>
            </FormItem>
          </div>
          <div class="editOrder">
            <FormItem label="备注:" class="margin-bottom0">
              <Input v-model="remarks" type="textarea" style="width:654px" placeholder=""  :maxlength="400"></Input>
            </FormItem>
          </div>
        </Form>
      </div>

      <div slot="footer">
        <div>
          <span class="custom-font-error font-12">{{errorTips}}</span>
          <Button type="success" @click="save('ruleOrderForm')">确认</Button>
          <Button type="ghost" @click="cancel('ruleOrderForm')">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  const outTips_1 = "你确定要为房间";
  const outTips_2 = "的客人办理退房？";
  const MyComponent = {
    props: ['myData','myList'],
    data() {
      return {

      }
    },
    render: function (createElement) {
      var _self = this;
      var data = JSON.parse(this.myData);
      var list = this.myList;
      var html = "";
      for(var i=0;i<list.length;i++){
        for(var j=0;j<data.length;j++){
          if(data[j] == list[i].id && j < 2){
            html += list[i].tag+","
          }
        }
      }
      return createElement(
        'label',
        {
          class:{roomTagName:true}
        },
        (html.substring(html.length-1)==',')?html.substring(0,html.length-1):html
      )
    }
  };
  export default {
    name: 'home',
    components: {
      'tagsName': {
        props:['tags'],
        template: '<div>{{tags}}</div>'
      }
    },
    data () {
      return {
        defaultOutTIme:'',
        roomId:'',
        tagsClose:false,
        groupClose:false,
        typeClose:false,
        visible:false,
        currentView: MyComponent,
        searchRoomNo:'',
        showLoading:false,
        groupList:[],
        typeList:[],
        tagList:[],
        allTagList:[],
        statusList:[],
        roomList:[],
        roomSearchList:[],
        roomNo:"",
        roomArea:"",
        roomType:"",
        roomTags:"",
        lockStatus:"",
        username:"",
        inTime:"",
        outTime:"",
        liveUserId:"",
        orderBy:2,
        groupLevel1Id:"",
        roomTypeId:"",
        roomTagId:"",
        roomTagsName:"",
        orderByText:"按房态排序",
        searchRoomGroup:"分组",
        searchRoomType:"房型",
        searchRoomTags:"房态",
        roomTypeText:'请选择',
        roomTagText:'请选择',
        roomRoomText:'请选择',
        addModal: false,
        addLongModal:false,
        addChgModal:false,
        loading: false,
        modal_loading: false,
        modalTitle: '',
        formName:'',
        setType:'',
        ruleForm: {
          enableDes: '',
          fixDes:''
        },
        ruleLongForm: {
          liveOrderId:'',
          realName:"",
          inTime:"",
          outTime:"",
          orderId:'',
          checkOutTime:''
        },
        ruleChgForm: {
          liveOrderId:'',
          roomNo:'',
          roomNoText:'',
          realName:"",
          inTime:"",
          outTime:"",
          orderId:'',
          roomId:'',
          tagId:'',
          statusRadio:'空净',
          roomTypeId:'',
          roomTagIds:'',
          status:'',
          groupLevel1Name:''
        },
        styleMenuObject: {
          height: '',
          'overflow-y':'auto',
        },
        optionsEnd: {
          disabledDate (date) {
            return false;
          }
        },
        errorTips:'',
        roomOrderList:[],
        tagOrderList:[],
        typeOrderList:[],
        showmodel:false,
        tabType:'checkin',
        payType:'',
        channel:'',
        remarks:'',
        orderOprType: '',
        ruleOrderForm:[{
          timeType:'1',
          realName:'',
          roomId:'',
          phone:'',
          cardType:'idcard',
          cardId:'',
          roomNo:'',
          roomGroupName:'',
          roomGroupId:'',
          tags:[],
          inTime:this.$moment.unix(new Date().getTime()/1000).format('YYYY-MM-DD'),
          outTime:this.$moment.unix((new Date().getTime()+86400000)/1000).format('YYYY-MM-DD'),
          groupName:'',
          inTimeArr:'12:00',
          outTimeArr:'12:00',
          liveNowGl:false,
          selTagId:'',//用于修改订单时候存主订单的tagid
          selTypeId:'',//用于修改订单时候存主订单的typeid
          roomTypeId:''
        }],
        optionsOrderEnd: {
          disabledDate (date) {
            return false;
          }
        },
        optionsEndChild: {
          disabledDate(date) {
            return false;
          }
        }
      }
    },
    created(){
      //初始化高度
      this.hh();
      //获取分组、特性、房型
      this.getGroup();
      this.getRoomTag();
      this.getRoomType();
      this.getStatus();
      this.getRoomList();
      this.getSession();
    },
    methods:{
      hh(){
        this.styleMenuObject.height = window.innerHeight-65-35+'px';
      },
      getSession(){
        this.$api.get("/proxy/home/logininfo?loginInfo=defaultOutTime", {} ,res => {
          this.defaultOutTime = res.data.data.defaultOutTime ? res.data.data.defaultOutTime : '12:00';
        });
      },
      search(){
        this.getRoomList();
      },
      getGroup(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/group/page", params ,res => {
          var data = Object.assign({}, res.data.data);
          this.groupList = data;
        });
      },
      getRoomType(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/type/list", params ,res => {
          var data = Object.assign({}, res.data.data);
          this.typeList = data;
        });
      },
      getRoomTag(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          var data = Object.assign({}, res.data.data);
          this.allTagList = res.data.data;
          this.tagList = data;
        });
      },
      getStatus(){
        var params = {page:1,num:999};
        this.$api.post("/proxy/room/count", params ,res => {
          var data = Object.assign({}, res.data.data);
          this.statusList = data;
        });
      },
      selGroup(event,id){
        this.groupLevel1Id = id;
        this.searchRoomGroup = event.currentTarget.getAttribute("data-name");
        this.groupClose = true;
        this.getRoomList();
      },
      closeGroup(){
        this.groupClose = false;
        this.groupLevel1Id = '';
        this.searchRoomGroup = '分组';
        this.getRoomList();
      },
      selType(event,id){
        this.roomTypeId = id;
        this.searchRoomType = event.currentTarget.getAttribute("data-name");
        this.typeClose = true;
        this.getRoomList();
      },
      closeType(){
        this.typeClose = false;
        this.roomTypeId = '';
        this.searchRoomType = '房型';
        this.getRoomList();
      },
      selTag(event,id){
        this.roomTagId = id;
        this.searchRoomTags = event.currentTarget.getAttribute("data-name");
        this.tagsClose = true;
        this.getRoomList();
      },
      closeTag(){
        this.tagsClose = false;
        this.roomTagId = '';
        this.searchRoomTags = '房态';
        this.getRoomList();
      },
      getRoomList(){
        this.showLoading = true;
        var params = {
          page:1,
          num:999,
          orderBy:this.orderBy,
          roomNo:this.searchRoomNo,
          groupLevel1Id:this.groupLevel1Id,
          roomTypeId:this.roomTypeId,
          roomTagId:this.roomTagId
        };
        this.$api.postQs("/proxy/room/countList", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          console.log(data);
          this.roomList = data;
          this.showLoading = false;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      getRoomSearchList(){
        var params = {
          page:1,
          num:10000,
          roomTypeId:this.ruleChgForm.roomTypeId,
          startTime:this.ruleChgForm.inTime,
          endTime:this.ruleChgForm.outTime,
          roomNo:this.ruleChgForm.roomNo,
          roomTagIds:this.ruleChgForm.roomTagIds,
          status:this.ruleChgForm.status
        };
        this.$api.get("/proxy/room/remains", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomSearchList = data;
        });
      },
      getOrderList(id){
        this.liveUserId = null;
        var params = {id:id};
        this.$api.postQs("/proxy/room/info", params ,res => {
          var data = Object.assign({}, res.data.data);
          this.username = data.liveRealName;
          this.inTime = data.liveStartTime;
          this.outTime = data.liveEndTime;
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      sortRoomList(event){
        this.orderBy = event.currentTarget.getAttribute("data-name");
        this.orderByText = event.currentTarget.getAttribute("data-text");
        this.getRoomList();
      },
      scanTags: function (value) {
        var params = {page:1,num:999};
        var tagList = JSON.parse(value);
        this.$api.get("/proxy/room/tag/list", params ,res => {
          var data = res.data.data;
          for(var i=0;i<data.length;i++){
            for(var j=0;j<tagList.length;j++){
              if(data[i].id == tagList[j]){
              }
            }
          }
        });
      },
      chgModal(status) {
        if(!status){
          this.handleReset(""+this.formName);
        };
      },
      setZang(id){
        var params = {
          id:id,
          cleanStatus:1
        };
        this.$api.postQs("/proxy/room/updateCleanStatus", params ,res => {
          this.$Message.success(res.data.desc);
          this.visible = false;
          this.getRoomList();
          this.getStatus();
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      setJing(id){
        var params = {
          id:id,
          cleanStatus:0
        };
        this.$api.postQs("/proxy/room/updateCleanStatus", params ,res => {
          this.$Message.success(res.data.desc);
          this.visible = false;
          this.getRoomList();
          this.getStatus();
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      clearFault(id){
        var params = {
          id:id,
          fixStatus:0
        };
        this.$api.postQs("/proxy/room/updateFixStatus", params ,res => {
          this.$Message.success(res.data.desc);
          this.visible = false;
          this.getRoomList();
          this.getStatus();
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      setEnable(id){
        var params = {
          id:id,
          enable:0
        };
        this.$api.postQs("/proxy/room/enabled", params ,res => {
          this.$Message.success(res.data.desc);
          this.visible = false;
          this.getRoomList();
          this.getStatus();
        },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      show(type,id,roomNo,name){
        this.setType = type;
        if(type == "stop"){
          this.modalTitle = roomNo + "("+ name +")"+"-停用";
          this.formName = 'ruleForm';
        }
        if(type == "fault"){
          this.modalTitle = "("+ roomNo + "-" + name +")"+"-故障原因";
          this.formName = 'ruleForm';
        }
        this.roomId = id;
        this.addModal = true;
      },
      setFault(name){
        let _self = this;
        var params = {
          id:this.roomId,
          fixStatus:1,
          fixDes:this.ruleForm.fixDes
        };
        this.$refs[name].validate((valid) => {
          if (valid) {
            _self.loading = true;
            this.$api.postQs("/proxy/room/updateFixStatus", params ,res => {
              this.$Message.success(res.data.desc);
              _self.getRoomList();
              _self.getStatus();
              _self.loading = false;
              _self.addModal = false;
              _self.$refs[name].resetFields();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        })
      },
      setDisabled(name){
        let _self = this;
        var params = {
          id:this.roomId,
          enable:1,
          enableDes:this.ruleForm.enableDes
        };
        this.$refs[name].validate((valid) => {
          if (valid) {
            _self.loading = true;
            this.$api.postQs("/proxy/room/enabled", params ,res => {
              this.$Message.success(res.data.desc);
              _self.getRoomList();
              _self.getStatus();
              _self.loading = false;
              _self.addModal = false;
              _self.$refs[name].resetFields();
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        })
      },
      setLogut(id,roomNo,name){
        var _selft = this;
        this.$Modal.confirm({
          title: '退房信息',
          content: "<div class='font-15'>"+outTips_1+"<span class='text-green'>["+roomNo+"("+name+")"+"]</span>"+outTips_2 + "</div>",
          onOk: () => {
            var params = {id:id};
            var params = {
              id:id
            };
            _selft.$api.postQs("/proxy/order/liveOut", params ,res => {
              this.$Message.success(res.data.desc);
              _self.getRoomList();
              _self.getStatus();
              this.$layer.close(index);
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      setLong(liveOrderId,realName,inTime,outTime){
        this.modalTitle = "延长住店时间";
        this.formName = 'ruleLongForm';
        this.ruleLongForm.liveOrderId = liveOrderId;
        this.ruleLongForm.realName = realName;
        this.ruleLongForm.inTime = inTime;
        this.ruleLongForm.outTime = outTime;
        this.ruleLongForm.orderId = liveOrderId;
        this.optionsEnd = {
          disabledDate(date){
            return date && date.valueOf() < outTime;
          }
        };
        this.addLongModal = true;
      },
      setChgRoom(liveOrderId,roomNo,groupName,realName,inTime,outTime){
        this.modalTitle = "更换房间";
        this.formName = 'ruleChgForm';
        this.ruleChgForm.liveOrderId = liveOrderId;
        this.ruleChgForm.roomNoText = roomNo+"("+groupName+")";
        this.ruleChgForm.realName = realName;
        this.ruleChgForm.inTime = this.$moment.unix(inTime/1000).format("YYYY-MM-DD HH:mm");
        this.ruleChgForm.outTime = this.$moment.unix(outTime/1000).format("YYYY-MM-DD HH:mm");
        this.ruleChgForm.orderId = liveOrderId;
        this.getRoomSearchList();
        this.addChgModal = true;
      },
      selEndTime(event){
        this.ruleLongForm.checkOutTime = event;
      },
      saveLong(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var params = Object.assign({}, this.ruleLongForm);
            this.$api.postQs("/proxy/order/continue", this.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              this.getRoomList();
              this.handleReset(formName);
              this.loading = false;
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      saveChgRoom(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            var params = Object.assign({}, this.ruleChgForm);
            this.$api.postQs("/proxy/order/room/exchange", this.$utils.clearData(params) ,res => {
              this.$Message.success(res.data.desc);
              this.getRoomList();
              this.handleReset(formName);
              this.loading = false;
            },null,{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      selRoomType(event,id){
        this.ruleChgForm.roomId = id;
        this.roomTypeText = event.currentTarget.innerText;
        this.ruleChgForm.roomTypeId = id;
        this.getRoomSearchList();
      },
      selRoomTag(event,id){
        this.ruleChgForm.tagId = id;
        this.roomTagText = event.currentTarget.innerText;
        this.ruleChgForm.roomTagIds = id;
        this.getRoomSearchList();
      },
      selRoomList(event,id,groupLevel1Name){
        this.ruleChgForm.roomId = id;
        this.ruleChgForm.groupLevel1Name = groupLevel1Name;
        this.roomRoomText = event.currentTarget.innerText;
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addModal = false;
        this.addLongModal = false;
        this.addChgModal = false;
        this.ruleForm= {
          enableDes: '',
          fixDes:''
        };
        this.ruleLongForm= {
          liveOrderId:'',
          realName:"",
          inTime:"",
          outTime:"",
          orderId:'',
          checkOutTime:''
        };
        this.ruleChgForm= {
          liveOrderId:'',
          roomNo:'',
          roomNoText:'',
          realName:"",
          inTime:"",
          outTime:"",
          orderId:'',
          roomId:'',
          tagId:'',
          statusRadio:'空净',
          roomTypeId:'',
          roomTagIds:'',
          status:'',
          groupLevel1Name:''
        }
      },
      showOrder(roomNo,roomId,groupName,groupId){//以下为创建订单
        this.showmodel = true;
        this.ruleOrderForm[0].inTimeArr = this.defaultOutTime;
        this.ruleOrderForm[0].outTimeArr = this.defaultOutTime;
        this.getRoomOrderList();
        this.getTagOrderList();
        this.getTypeOrderList();
        var inData = [];
        if(this.tabType == 'in'){//如果为入住，传入相对应的值
          inData.push({
            roomId:roomId,
            roomNo:roomNo,
            groupName:groupName,
            roomGroupName:groupName,
            roomGroupId:groupId
          });
        }
        this.setRoomRemain(this.ruleOrderForm[0].inTime+' '+this.ruleOrderForm[0].inTimeArr,this.ruleOrderForm[0].outTime+' '+this.ruleOrderForm[0].outTimeArr,this.ruleOrderForm[0].selTagId,this.ruleOrderForm[0].selTypeId,this.ruleOrderForm[0],0,'init',inData);
      },
      getRoomOrderList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/page", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          this.roomOrderList = data.list;
        });
      },
      getTagOrderList(){
        var params = {page:1,num:9999};
        this.$api.get("/proxy/room/tag/list", params ,res => {
          this.tagOrderList = res.data.data;
        });
      },
      getTypeOrderList(){
        var params = {page:1,num:999};
        this.$api.get("/proxy/room/type/list", params ,res => {
          this.typeOrderList = res.data.data;
        });
      },
      selMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleOrderForm[index].inTimeArr = event;
          if(this.ruleOrderForm[index].timeType == 2){
            var time1 = this.ruleOrderForm[index].inTime + " " + event;
            var time = new Date(time1).getTime() + 3600000;
            this.ruleOrderForm[index].outTimeArr = this.$moment.unix(time/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleOrderForm[index].outTimeArr = event;
        }
      },
      chgMainTime(event,type,index){
        if(type == 'mainInTime'){
          this.ruleOrderForm[index].inTime = event;
          if(this.ruleOrderForm[index].timeType == 1){
            this.ruleOrderForm[index].outTime = this.$moment.unix((new Date(event).getTime() + 86400000)/1000).format('YYYY-MM-DD');
          }
          if(this.ruleOrderForm[index].timeType == 2){
            var time = event + " " + this.ruleOrderForm[index].inTimeArr;
            this.ruleOrderForm[index].outTime = event;
            this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime()+3600000)/1000).format('HH:mm');
          }
        }
        if(type == 'mainOutTime'){
          this.ruleOrderForm[index].outTime = event;
        }
      },
      openOutTime(event,index,type){//根据入住时间控制离店时间禁用时间段
        var _self = this;
        if(event){
          if(type=='main'){
            this.optionsOrderEnd = {
              disabledDate(date){
                let time = _self.ruleOrderForm[index].inTime;
                let dateStart = new Date(time);
                return date && date.valueOf() < (dateStart);
              }
            };
          }
        }
      },
      filterRoom(event,roomId,startTime,endTime,tagId,typeId,obj,index){//过滤已经选择的房间
        if(event){
          this.setRoomRemain(startTime,endTime,tagId,typeId,obj,index,'openRoom');
        }
      },
      setRoomRemain(startTime,endTime,tagId,typeId,obj,index,type,initData){
        this.roomArr = [];
        let startInTime = "";
        let endOutTime = "";
        let selfStartTime = startTime;
        let selfEndTime = endTime;
        let timeList = [];
        timeList.push(this.ruleOrderForm[index]);
        for(var i=0;i<this.ruleOrderForm.length;i++){
          if(obj != this.ruleOrderForm[i]){
            this.roomArr.push(this.ruleOrderForm[i].roomId);
          }
          startInTime = this.ruleOrderForm[i].inTime;
          endOutTime = this.ruleOrderForm[i].outTime;
          if(obj != this.ruleOrderForm[i]){
            if((selfStartTime <= startInTime && selfEndTime > startInTime) || (selfStartTime >= startInTime && selfStartTime < endOutTime)){
              this.roomArr = this.roomArr;
            }else{
              this.roomArr = [];
            }
          }
        }
        //console.log(this.roomArr);
        this.getRoomRemain(tagId,typeId,index,obj,type,initData);
      },
      isInArray(arr,value){//判断数组中存在某个原素
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      },
      getRoomRemain(tagId,typeId,index,obj,type,initData){
        let startTime = "";
        let endTime = "";
        if(index>=0){
          startTime = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          endTime = this.ruleOrderForm[index].outTime + " " + this.ruleOrderForm[index].outTimeArr;
        }else{
          startTime = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          endTime = this.ruleOrderForm[index].outTime + " " + this.ruleOrderForm[index].outTimeArr;
        }
        var params = {
          page:1,
          num:9999,
          startTime:startTime,
          endTime:endTime,
          roomTypeId:typeId,
          roomTagIds:tagId
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
          this.roomOrderList = arr;
          //console.log(this.roomOrderList);
          if(this.roomOrderList.length == 0){
            if(index>=0){
              this.ruleOrderForm[index].roomId = '';
            }else{
              this.ruleOrderForm[index].roomId = '';
            }
          }else{
            if(type == null){
              this.ruleOrderForm[index].roomId = arr[0].id;
              this.ruleOrderForm[index].roomNo = arr[0].room_no;
              this.ruleOrderForm[index].groupName = arr[0].group_level1_name;
              this.ruleOrderForm[index].roomGroupName = arr[0].group_level1_name;
              this.ruleOrderForm[index].roomGroupId = arr[0].group_level1_id;
            }else if(type == 'init' || type != 'openRoom'){//如果是初始或者不是展开房间下拉框，执行自动选择房间的操作
              if(this.tabType == 'in'){
                this.ruleOrderForm[index].roomId = initData[0].roomId;
                this.ruleOrderForm[index].roomNo = initData[0].roomNo;
                this.ruleOrderForm[index].groupName = initData[0].groupName;
                this.ruleOrderForm[index].roomGroupName = initData[0].roomGroupName;
                this.ruleOrderForm[index].roomGroupId = initData[0].roomGroupId;
              }else{
                this.ruleOrderForm[index].roomId = arr[0].id;
                this.ruleOrderForm[index].roomNo = arr[0].room_no;
                this.ruleOrderForm[index].groupName = arr[0].group_level1_name;
                this.ruleOrderForm[index].roomGroupName = arr[0].group_level1_name;
                this.ruleOrderForm[index].roomGroupId = arr[0].group_level1_id;
              }
            }
          }
        });
      },
      save(){
        //验证关联订单
        let phoneReg = /^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}|16[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
        this.errorTips = '';
        var _self = this;
        let orderArr = [];

        this.ruleOrderForm.forEach(function(item, index) {
          orderArr.push({
            realName:item.realName,
            phone:item.phone,
            roomId:item.roomId,
            roomNo:item.roomNo,
            roomGroupName:item.groupName,
            roomGroupId:item.roomGroupId,
            checkInType:item.timeType,
            checkInTime:item.inTime + "T" + item.inTimeArr,
            checkOutTime:item.outTime + "T" + item.outTimeArr,
            cardId:item.cardId,
            cardType:item.cardType,
            liveNow:_self.orderOprType == 'in' ? true : false,
            payType: _self.payType ? _self.payType : '',
            channel: _self.channel ? _self.channel : '',
            remarks: _self.remarks ? _self.remarks : '',
          });
        });


        for(var i=0;i<this.ruleOrderForm.length;i++){
          if(this.ruleOrderForm[i].realName == ''){
            this.errorTips = '订单中的姓名不能为空!';
            return;
          }
          if(this.ruleOrderForm[i].phone == ''){
            this.errorTips = '订单中的手机号不能为空!';
            return;
          }
          if(!phoneReg.test(this.ruleOrderForm[i].phone)){
            this.errorTips = '订单中的手机号填写有误!';
            return;
          }
          if(!this.ruleOrderForm[i].roomId){
            this.errorTips = '订单中的房间不能为空!!';
            return;
          }
        }
        //console.log(orderArr);return;
        var params = {
          orders:orderArr
        };
        var postHeader = {"Content-Type":'application/json; charset=UTF-8'};
        this.$api.post('/proxy/order/multi-set', JSON.stringify(params) ,res => {
          this.$Message.success(res.data.desc);
          this.cancel('ruleOrderForm');
        },res => {
          this.$Message.error(res.data.desc);
        },postHeader);
      },
      cancel(name){
        //this.$refs[name].resetFields();
        this.showmodel = false;
        this.closeModal();
      },
      closeModal(){
        this.errorTips = '',
          this.roomOrderList=[],
          this.tagOrderList=[],
          this.typeOrderList=[],
          this.showmodel=false,
          this.tabType='checkin',
          this.orderOprType= '',
          this.payType='',
          this.channel='',
          this.remarks='',
          this.ruleOrderForm = [{
            timeType:'1',
            realName:'',
            roomId:'',
            phone:'',
            cardType:'idcard',
            cardId:'',
            roomNo:'',
            roomGroupName:'',
            roomGroupId:'',
            tags:[],
            inTime:this.$moment.unix(new Date().getTime()/1000).format('YYYY-MM-DD'),
            outTime:this.$moment.unix((new Date().getTime()+86400000)/1000).format('YYYY-MM-DD'),
            groupName:'',
            inTimeArr:'12:00',
            outTimeArr:'12:00',
            liveNowGl:false,
            selTagId:'',//用于修改订单时候存主订单的tagid
            selTypeId:'',//用于修改订单时候存主订单的typeid
            roomTypeId:''
          }]
      },
      chgOrderModal(status) {
        if(!status){
          this.closeModal();
        };
      },
      selTimeType(event,index){
        if(event == 1){
          this.ruleOrderForm[index].timeType = "1";
          this.ruleOrderForm[index].inTime = this.ruleOrderForm[index].inTime;
          this.ruleOrderForm[index].outTime = this.$moment.unix((new Date(this.ruleOrderForm[index].inTime).getTime()+86400000)/1000).format('YYYY-MM-DD');
          let time = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          this.ruleOrderForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH') + ":00";
          this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH') + ":00";
        }else if(event == 2){
          this.ruleOrderForm[index].timeType = "2";
          this.ruleOrderForm[index].inTime = this.ruleOrderForm[index].inTime;
          this.ruleOrderForm[index].outTime = this.ruleOrderForm[index].inTime;
          let time = this.ruleOrderForm[index].inTime + " " + this.ruleOrderForm[index].inTimeArr;
          this.ruleOrderForm[index].inTimeArr = this.$moment.unix((new Date(time).getTime())/1000).format('HH:mm');
          this.ruleOrderForm[index].outTimeArr = this.$moment.unix((new Date(time).getTime() + 3600000)/1000).format('HH:mm');
        }
      },
      chgMainType(event,obj,index){
        this.ruleOrderForm[index].selTypeId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,obj.selTagId,event,obj,index);
      },
      chgMainTag(event,obj,index){
        this.ruleOrderForm[index].selTagId = event;
        this.setRoomRemain(obj.inTime+' '+obj.inTimeArr,obj.outTime+' '+obj.outTimeArr,event,obj.roomTypeId,obj,index);
      },
      chgRoom(event,index,roomId,roomNo,groupName,groupId){
        this.ruleOrderForm[index].roomId = roomId;
        this.ruleOrderForm[index].roomNo = roomNo;
        this.ruleOrderForm[index].groupName = groupName;
        this.ruleOrderForm[index].roomGroupName = groupName;
        this.ruleOrderForm[index].roomGroupId = groupId;
      },
      tabChange(type){
        this.tabType = type;
        for(var i = 0;i < this.ruleOrderForm.length;i++){
          if(type == 'in'){
            this.ruleOrderForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleOrderForm[i].inTimeArr = this.$moment().format('HH:mm');
            this.ruleOrderForm[i].timeType = "1";
          }
          if(type == 'checkin'){
            this.ruleOrderForm[i].inTime = this.$moment().format('YYYY-MM-DD');
            this.ruleOrderForm[i].outTimeArr = this.defaultOutTime;
            this.ruleOrderForm[i].inTimeArr = this.defaultOutTime;
            this.ruleOrderForm[i].timeType = "1";
          }
        }
      },
      chgCardType(event,index){
        this.ruleOrderForm[index].cardType = event;
      },
      addOrder(){
        //console.log(this.ruleOrderForm[0]);
        this.ruleOrderForm.push({
          timeType:this.ruleOrderForm[this.ruleOrderForm.length-1].timeType,
          realName:this.ruleOrderForm[this.ruleOrderForm.length-1].realName,
          roomId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomId,
          phone:this.ruleOrderForm[this.ruleOrderForm.length-1].phone,
          cardType:this.ruleOrderForm[this.ruleOrderForm.length-1].cardType,
          cardId:this.ruleOrderForm[this.ruleOrderForm.length-1].cardId,
          //roomNo:this.ruleOrderForm[this.ruleOrderForm.length-1].roomNo,
          //roomGroupName:this.ruleOrderForm[this.ruleOrderForm.length-1].roomGroupName,
          //roomGroupId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomGroupId,
          tags:this.ruleOrderForm[this.ruleOrderForm.length-1].tags,
          inTime:this.ruleOrderForm[this.ruleOrderForm.length-1].inTime,
          outTime:this.ruleOrderForm[this.ruleOrderForm.length-1].outTime,
          //groupName:this.ruleOrderForm[this.ruleOrderForm.length-1].groupName,
          inTimeArr:this.ruleOrderForm[this.ruleOrderForm.length-1].inTimeArr,
          outTimeArr:this.ruleOrderForm[this.ruleOrderForm.length-1].outTimeArr,
          liveNowGl:false,
          selTagId:this.ruleOrderForm[this.ruleOrderForm.length-1].selTagId,//用于修改订单时候存主订单的tagid
          selTypeId:this.ruleOrderForm[this.ruleOrderForm.length-1].selTypeId,//用于修改订单时候存主订单的typeid
          roomTypeId:this.ruleOrderForm[this.ruleOrderForm.length-1].roomTypeId
        });
        let startTime = this.ruleOrderForm[this.ruleOrderForm.length-1].inTime;
        let endTime = this.ruleOrderForm[this.ruleOrderForm.length-1].outTime;
        let tagId = this.ruleOrderForm[this.ruleOrderForm.length-1].selTagId;
        let typeId = this.ruleOrderForm[this.ruleOrderForm.length-1].selTypeId;
        let obj = this.ruleOrderForm[this.ruleOrderForm.length-1];
        this.setRoomRemain(startTime,endTime,tagId,typeId,obj,this.ruleOrderForm.length-1,null)
      },
      mutiOrder(index){
        this.ruleOrderForm.splice(index,1);
      },
      clearTag(index){
        this.ruleOrderForm[index].selTagId = '';
      },
      clearRoomType(index){
        this.ruleOrderForm[index].selTypeId = '';
      },
      goIn(roomNo,roomId,groupName,groupId){
        console.log(roomNo,roomId,groupName,groupId);
        this.tabType = 'in';
        this.orderOprType = 'in';
        this.showOrder(roomNo,roomId,groupName,groupId);
      }
    },
    mounted () {
      // 注：window.onresize只能在项目内触发1次
      var _self = this;
      window.onresize = function (){
        _self.hh();
      }
    }
  }
</script>
<style>

</style>
