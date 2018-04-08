<template>
  <div class="user-center">
    <m-header></m-header>
    <div class="user-center-content" ref="userCenter">
      <div class="scroll">
        <div class="header">
          <div class="info-wrapper" @click="myInfo">
            <div class="info">
              <img v-lazy="photoAddress" class="info-avatar">
              <div class="nick-name">{{userData.nickName}}</div>
            </div>
            <div class="icon-right-white"></div>
          </div>
        </div>
        <div class="operate">
          <ul>
            <router-link class="operate_item" tag="li" to='/extend'>
              <i class="icon-left icon-left-extend"></i>
              <div class="content">
                <span class="text">推广中心</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <router-link class="operate_item" tag="li" to='/myaccount'>
              <i class="icon-left icon-left-account"></i>
              <div class="content">
                <span class="text">我的账户</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <router-link class="operate_item" tag="li" to='/myorder'>
              <i class="icon-left icon-left-order"></i>
              <div class="content">
                <span class="text">我的订单</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <router-link class="operate_item" tag="li" to='/accountsafe'>
              <i class="icon-left icon-left-safe"></i>
              <div class="content">
                <span class="text">账户安全</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <router-link class="operate_item" tag="li" to='/feedback'>
              <i class="icon-left icon-left-feedback"></i>
              <div class="content">
                <span class="text">意见反馈</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <router-link class="operate_item" tag="li" to='/manageaddress'>
              <i class="icon-left icon-left-address"></i>
              <div class="content">
                <span class="text">地址管理</span>
                <span class="icon-right"></span>
              </div>
            </router-link>
            <li class="operate_item" @click='servicehotline'>
              <i class="icon-left icon-left-phone"></i>
              <div class="content">
                <span class="text">服务热线</span>
                <span class="icon-right"></span>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import MHeader from 'components/m-header/m-header'
import { mapGetters, mapMutations } from 'vuex'
import { queryInfoByToken } from 'api/userCenter'
import { initPage,setToastMsg,share } from 'common/js/mixin'
import {avatar} from 'common/js/tools'

export default {
  mixins: [initPage,setToastMsg,share],
  data() {
    return {
      userData: {},
      telephone: 15602463804,
      photoAddress: ''
    }
  },
  created() {
    this._queryInfoByToken()
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.userCenter)
    })
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  mounted() {
    this._initScroll()
  },
  methods: {
    _queryInfoByToken() {
      queryInfoByToken(this.userToken).then(res => {
        if (res.success) {
          this.userData = res.info
          // res.photoAddress +
          this.photoAddress = avatar(res.info.avatar)
          this.setUserMobile(res.info.mobile)
        }else{
          this.setToastMsg(res.msg)
        }
      })
    },

    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.userCenter, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    myInfo() {
      this.$router.push(`/myinfo`)
    },
    servicehotline() {
      window.location.href = `tel:${this.telephone}`
    },
    ...mapMutations({
      setUserMobile: 'SET_USER_MOBILE'
    })
  },
  components: {
    MHeader
  },

}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .user-center
    position: fixed
    bottom: 49/$cale+rem
    width: 100%
    top: 0
    background: $background-base
    .user-center-content
      height: 100%
      overflow: hidden
    .scroll
      padding-bottom: 30/$cale+rem
    .header  
      height: 180/$cale+rem
      +bg-image('./userInfo_bg')
      background-size: 100% 100%
      text-align: center
      padding-top: 40/$cale+rem
      position: relative
      .info
        font-size: 17/$cale+rem
        color: $white
        .info-avatar
          +size(70/$cale+rem)
          border-radius: 50%
          margin-bottom: 20/$cale+rem
      .icon-right-white
          +bg-image('./address-right-icon') 
          background-size: 100% 100%
          +extend-click() 
          width: 8/$cale+rem
          height: 13/$cale+rem
          position: absolute
          top: 50%  
          right: 15/$cale+rem
    .operate
      i,span
        display: inline-block
      .operate_item
        display: flex
        font-size: 17/$cale+rem
        background-color: $white
        &:last-child .content
          +border-none()
        .icon-left
          +size(20/$cale+rem)
          background-size: 100% 100%
          top: 13/$cale+rem
          left: 15/$cale+rem
          right: 0
          +extend-click() 
        .icon-left-extend
          +bg-image('./icon_extend')   
        .icon-left-account
          +bg-image('./icon_account')   
        .icon-left-order
          +bg-image('./icon_order') 
        .icon-left-safe
          +bg-image('./icon_safe')
        .icon-left-feedback
          +bg-image('./icon_feedback')
        .icon-left-address
          +bg-image('./icon_address')
        .icon-left-phone  
          +bg-image('./icon_phone')
        .content
          flex: 1
          border-bottom: 1px solid $gray-lighter
          padding: 10/$cale+rem 15/$cale+rem 10/$cale+rem 0
          margin-left: 30/$cale+rem
          .text
            font-size: 17/$cale+rem
            line-height: 25/$cale+rem
            color: $text_color
            // padding-left: 18/$cale+rem
          .icon-right
            +bg-image('./address-right-icon') 
            background-size: 100% 100%
            top: 5/$cale+rem
            right: 0
            +extend-click() 
            width: 8/$cale+rem
            height: 13/$cale+rem
            float: right
</style>