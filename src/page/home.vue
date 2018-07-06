<template>
  <div class="main-content-bg">
    <div class="home-left-menu">
      <div class="home-left-menu-search">
        <Input icon="ios-search" v-model="searchRoomNo" @on-click="search" placeholder="请输入房间号" style="width: 200px"></Input>
      </div>
      <!--快捷搜索-->
      <div class="margin-top15-left20">
        <div>
          <span class="home-title">房间筛选</span>
        </div>
        <div style="margin-top:10px;">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomGroup}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in groupList.list" :key="index" :data-name="item.name" @click.native="selGroup($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="margin-top15">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomType}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in typeList" :key="index" :data-name="item.name" @click.native="selType($event,item.id)">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="margin-top15">
          <Dropdown trigger="click" class="w200">
            <a class="text-gray" href="javascript:void(0)">
              {{searchRoomTags}}
              <Icon type="arrow-down-b" style="float: right"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in tagList" :key="index" :data-name="item.tag" @click.native="selTag($event,item.id)">{{item.tag}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
                <span class="home-status-num"></span>
                </Col>
                <Col span="4" class="custom-font-999999 text-right">
                {{item.count}}
                </Col>
              </Row>
              <Row class="w200 margin-top10" v-if="item.status == 102">
                <Col span="20">
                <span>维修</span>
                <span class="home-status-num"></span>
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
                  </span>
                </div>
                <div class="margin-top10">
                  <!--<span class="home-room-statusIcon-bulid span-inline"></span>
                  <span class="home-room-statusIcon-clean span-inline"></span>-->
                  <i class="fa fa-check-circle text-green" aria-hidden="true" v-if="item.book_status == 1"></i>
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
                        <Button type="success" size="small">入住</Button>
                        <Button type="ghost" size="small" @click="setZang(item.id)">置脏</Button>
                        <Button type="ghost" size="small" v-if="item.fix_des" @click="clearFault(item.id)">清除故障</Button>
                      </div>
                    </div>
                    <div v-else>
                      <Button type="success" size="small">入住</Button>
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
                    <Button type="success" size="small">入住</Button>
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
          <Input v-model="ruleForm.enableDes" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem prop="fixDes" :rules="$filter_rules({required:true})" v-if="setType == 'fault'">
          <Input v-model="ruleForm.fixDes" type="textarea" :autosize="{minRows: 2,maxRows: 10}" placeholder="Enter something..."></Input>
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
        <Button type="success" @click="saveLong('ruleLongForm')">保存</Button>
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
              <DropdownItem :data-name="全部" @click.native="selRoomType($event,'')">全部</DropdownItem>
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
              <DropdownItem :data-name="全部" @click.native="selRoomTag($event,'')">全部</DropdownItem>
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
        <Button type="success" @click="saveChgRoom('ruleChgForm')">保存</Button>
        <Button type="ghost" @click="handleReset('ruleChgForm')">取消</Button>
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
      var data = JSON.parse(this.myData);
      var list = this.myList;
      console.log(this.myList.length);
      return createElement('span',list.map(function (list,indexList) {
        return createElement('span',data.map(function (data,index) {
          if(data == list.id && index < 2){
            return createElement(
              'label',
              {
                class:{roomTagName:true}
              },
              list.tag
            )
          }
        }))
      }))
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
        roomId:'',
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
    },
    methods:{
      hh(){
        this.styleMenuObject.height = window.innerHeight-65-35+'px';
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
        this.getRoomList();
      },
      selType(event,id){
        this.roomTypeId = id;
        this.searchRoomType = event.currentTarget.getAttribute("data-name");
        this.getRoomList();
      },
      selTag(event,id){
        this.roomTagId = id;
        this.searchRoomTags = event.currentTarget.getAttribute("data-name");
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
        console.log(params);
        this.$api.get("/proxy/room/remains", this.$utils.clearData(params) ,res => {
          var data = Object.assign({}, res.data.data);
          console.log(data);
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
                console.log(data[i].tag);
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
        }
        if(type == "fault"){
          this.modalTitle = "("+ roomNo + "-" + name +")"+"-故障原因";
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
