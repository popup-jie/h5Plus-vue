<template>
  <div class="logistics">
    <m-header title="查看物流" :type="3" @back="back"></m-header>
    <div class="logistics-wrapper" ref="logisticsWrapper">
      <div class="scroll-inner">
        <!--商品信息-->
        <div class="good-info">
          <div class="leftArea">
            <img v-lazy="toAvatar" alt="" class="good-pic">
            <p class="txt">{{totalCount}}件商品</p>
          </div>
          <div class="good-desc">
            <p class="status">{{statusTxt(LogisticInfor.state)}}</p>
            <p class="express">{{orderInfo.expressCompany}}：{{orderInfo.expressNo}}</p>
            <!--<p class="tel">官方电话：<span class="num">88898</span></p>-->
          </div>
        </div>
        <!--物流信息-->
        <div class="logistics-progress">
          <div class="address">
            <span class="icon-address"></span>
            <div class="txt">收货地址：{{orderInfo.addressDetail}}</div>
          </div>
        </div>
        <div class="progress">
          <el-steps direction="vertical" :active="parseInt(LogisticInfor.state)">
            <el-step :title="item.status" :icon="['icon-circle',{'active':index===parseInt(LogisticInfor.state)}]"  v-for="(item,index) in LogisticInfor.data" :key='index'>
              <div class="desc" slot="description">
                <span class="txt">{{item.context}}</span>
                <span class="date">{{formatFtime(item.ftime).date}}<br><span class="mini">{{formatFtime(item.ftime).time}}</span></span>
              </div>
            </el-step>
          </el-steps>
        </div>
        <p class="noInfo" v-show="Object.keys(LogisticInfor).length === 0">暂无物流信息</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import BScroll from 'better-scroll'
  import {Steps,Step} from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  import { initPage, setToastMsg,share } from 'common/js/mixin'
  import { avatar } from 'common/js/tools'
  import { orderDetail, getLogisticInformation } from 'api/order'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [initPage,setToastMsg,share],
    data(){
      return {
        orderInfo: '',  //订单信息
        LogisticInfor: {}, //物流信息
      }
    },
    computed: {
      //订单状态
      orderStatus(){
        let statusTxt;
        switch(this.orderInfo.status){
          case 0:
            statusTxt = '待付款'
            break
          case 1:
            statusTxt = '待收货'
            break
          case 2:
            statusTxt = '待发货'
            break
          case 3:
            statusTxt = '待评论'
            break
          case 4:
            statusTxt = '交易完成'
            break
          case 5:
            statusTxt = '交易关闭'
            break
          default:
            statusTxt = ''
        }
        return statusTxt
      },
      //图片地址
      toAvatar(){
        return this.orderInfo?(this.orderInfo.pictureAddress + this.orderInfo.goods[0].picture):''
      },
      //商品总件数
      totalCount(){
        return this.orderInfo?this.orderInfo.goods[0].num:0
      },
      ...mapGetters(['userToken','orderNo'])
    },
    created() {
      document.title = '查看物流'
      this._orderNo = this.orderNo || this.$route.params.orderNo
      this._initData()
      this._shareDetail()
    },
    mounted(){
      this._initscroll()
      this.$nextTick(() => {
        this._initPage(this.$refs.logisticsWrapper)
      })
    },
    methods: {
      back() {
        this.$router.goBack()
      },
      _initscroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.logisticsWrapper, {
              click: true,
              probeType: 3
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      _initData(){
        //查询订单信息
        orderDetail(this._orderNo, this.userToken).then(res => {
          if(res.success){
            this.orderInfo = res
          } else {
            this.setToastMsg(res.msg)
          }
        })
        //查询物流信息
        getLogisticInformation(this._orderNo).then(res => {
          console.log(res)
          if(res.success){
            this.LogisticInfor = res
          } else {
            this.setToastMsg(res.msg)
          }
        })
      },
      //物流状态对应的文字
      statusTxt(status){
        let statusTxt;
        switch(status){
          case 0:
            statusTxt = '在途中'
            break
          case 1:
            statusTxt = '已揽收'
            break
          case 2:
            statusTxt = '疑难'
            break
          case 3:
            statusTxt = '已签收'
            break
          case 4:
            statusTxt = '退签'
            break
          case 5:
            statusTxt = '同城派送中'
            break
          case 6:
            statusTxt = '退回'
            break
          default:
            statusTxt = ''
        }
        return statusTxt
      },
      //格式化物流时间
      formatFtime(ftime){
        let result = {
          date: '',
          time: ''
        }
        let arrSplits = ftime.split(' ')
        result.date = arrSplits[0].substr(5)
        result.time = arrSplits[1].substr(-4)
        return result
      },
    },
    components: {
      MHeader,
      ElSteps: Steps,
      ElStep: Step
    }
  }
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .logistics
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $background-base
    color: $text_color
    font-size: 14/$cale+rem
    line-height: 20/$cale+rem
    .logistics-wrapper
      position: fixed
      top: 44/$cale+rem
      bottom: 0
      overflow: hidden
      width: 100%
      .scroll-inner
        padding-bottom: 10/$cale+rem
      .good-info
        padding: 10/$cale+rem
        margin-bottom: 10/$cale+rem
        display: flex
        background-color: $white
        .leftArea
          position: relative
          +size(88/$cale+rem)
          .good-pic
            +size(100%)
          .txt
            position: absolute
            bottom: 0
            left: 0
            line-height: 20/$cale+rem
            font-size: 14/$cale+rem
            text-align: center
            background-color: rgba(0,0,0,0.5)
            color: $white
            width: 100%
        .good-desc
          flex: 1
          padding-left: 10/$cale+rem
          .status
            line-height: 20/$cale+rem
            font-size: 14/$cale+rem
            color: $mall-green
          .express
            padding: 10/$cale+rem 0
            line-height: 17/$cale+rem
            font-size: 12/$cale+rem
            color: $text_light
          .tel
            line-height: 17/$cale+rem
            font-size: 12/$cale+rem
            color: $text_light
            .num
              color: #007aff
      .logistics-progress
        padding: 10/$cale+rem 15/$cale+rem
        background-color: $white
      .address
        display: flex
        padding-bottom: 18/$cale+rem
        .icon-address
          display: inline-block
          +bg-image('./icon-address')
          background-size: 100% 100%
          +size(20/ $cale + rem,25/ $cale + rem)
          margin-top: 5/$cale+rem
        .txt
          flex: 1
          padding-left: 13/$cale+rem
          line-height: 17/$cale+rem
          font-size: 12/$cale+rem
      .progress
        background-color: $white
        padding-left: 70/$cale+rem
        position: relative
        .is-process
          color: $mall-green
        .progress-date
          position: absolute
          left: 15/$cale+rem
          top: 0
          .item-date
            padding-bottom: 40/$cale+rem
            line-height: 20/$cale+rem
            font-size: 14/$cale+rem
            text-align: right
            .time
              line-height: 14/$cale+rem
              font-size: 10/$cale+rem
              padding-top: 2/$cale+rem
      .desc
        position: relative
        .date
          position: absolute
          left: -80/$cale+rem
          top: -18/$cale+rem
          text-align: right
          .mini
            font-size: 10/$cale+rem
      .el-step__title
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        padding-bottom: 2/$cale+rem
      .el-step__description
        line-height: 17/$cale+rem
        font-size: 12/$cale+rem
        .trans-item
          padding-top: 20/$cale+rem
          position: relative
          .date
            position: absolute
            left: -83/$cale+rem
            top: 20/$cale+rem
            line-height: 14/$cale+rem
            font-size: 10/$cale+rem
          .circle
            position: absolute
            left: -25/$cale+rem
            top: 25/$cale+rem
            display: inline-block
            +size(7/$cale+rem)
            border-radius: 50%
            background-color: $text_lighter
          &:first-child
            padding-top: 0
            &>.date
              position: absolute
              left: -80/$cale+rem
              top: -20/$cale+rem
      .el-step__title.is-finish,.el-step__description.is-finish
        color: $mall-green
      .el-step__main
        padding-bottom: 40/$cale+rem
      .el-step__icon
        +size(19/$cale+rem)
      .icon-circle
        display: inline-block
        +bg-image('./icon-circle')
        background-size: 100% 100%
        +size(19/ $cale + rem)
        &.active
          +bg-image('./icon-circle-active')
    .noInfo
      font-size: 16/$cale+rem
      padding-top: 20/$cale+rem
      text-align: center
</style>