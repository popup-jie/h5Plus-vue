<template>
  <div class="extend">
    <m-header title="推广中心" :type="3" @back="back"></m-header>
    <div class="extend-wrapper" ref="extendWrapper">
      <div class="scroll-inner">
        <div class="extend-content">
          <div class="extend-head">
            <span class="accu-text">累计收益：</span>
            <span class="extend-describ" @click="extendDesc">推广说明</span>
          </div>
          <div class="extend-amount">¥{{userData.totalIncomeMoney?userData.totalIncomeMoney.toFixed(2):zero}}</div>
          <div class="tips">
            <span class="tips-icon"></span>
            <span class="tips-content">收益已自动结算至线上钱包，可用于商城购买商品</span>
          </div>
        </div>

        <div class="extend-content extend-content-list">
          <ul class="extend-list">
            <li class="left">
              <p>{{userData.totalCustNum}}</p>
              <div>累积客户</div>
            </li>
            <li class="middle">
              <p>{{userData.totalUserNum}}</p>
              <div>累积邀请</div>
            </li>
            <li class="right">
              <p>{{userData.totalOrderNum}}</p>
              <div>推广订单</div>
            </li>
          </ul>

          <ul class="user" @click="userList" v-show="userData.custUserList && userData.custUserList.length != 0">
            <li class="user-list" v-for="(item,index) in userData.custUserList" :key="index">
              <img v-lazy="item.avatar" alt="用户头像" class="avatar" @load="minipragram">
            </li>
          </ul>
        </div>
      </div>

      <div class="invite-btn" @click="inviteFriend" open-type="share">邀请好友</div>

      <!-- 分享 -->
      <transition name="fade">
        <div class="showMask" v-show="showMask" @click="closeShareAlert">
          <share-type ref="shareType" class="shareType" :title="inviteTitle" :content="inviteContent" :thumbs="shareThumbs" :href="href"></share-type>
        </div>
      </transition>
      <transition name="fade">
        <div class="share-mask-pic" v-show="shareMaskPic" @click="showSharePic">
          <img src="./share-mask-pic.png" alt="" @load="minipragram">
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import { initPage, setToastMsg} from 'common/js/mixin'
// import { getSignData } from 'api/getSignData'
import { mapGetters } from 'vuex'
import ShareType from 'components/share-type/share-type'
import { serverUrlPrefix, serverUrlSuffix} from 'api/config'
import { findUserShareSaleInfo } from 'api/extend'
import {Base64} from 'js-base64'

export default {
  mixins: [initPage, setToastMsg],
  computed: {
    href() {
      return serverUrlPrefix + `programType=${this.programType}&token=${Base64.encode(this.wxunionid)}&target=extenddesc` + serverUrlSuffix
    },
    ...mapGetters(['programType', 'userToken','shareThumbs','wxunionid'])
  },
  created() {
    document.title = '推广中心'
    this._initscroll()
    this.$nextTick(() => {
      this._initPage(this.$refs.extendWrapper)
    })
    this.shareMaskPic = false
    this._findUserShareSaleInfo()
  },
  data() {
    return {
      showMask: false,
      shareMaskPic: false,//是否显示指向右上角分享图片
      userData: [],
      zero: 0.00,
      inviteTitle: '菁小咖邀你分享赚佣金', //分享标题
      inviteContent: '菁小咖 不寻常', //分享内容
    }
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.extendWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _findUserShareSaleInfo() {
      findUserShareSaleInfo(this.userToken).then(res => {
        if (res.success) {
          this.userData = res
        }
        this.minipragram()
      })
    },
    extendDesc() {
      this.$router.push(`./extenddesc`)
    },
    userList() {
      this.$router.push(`./extenduserlist`)
    },
    inviteFriend() {
      //分享
      if (this.programType === 'H5App') {
        this.$refs.shareType.show()
        this.showMask = true
      } else {
        this.shareMaskPic = true
      }
      this.minipragram()
    },
    minipragram() {
      if (window.__wxjs_environment === 'miniprogram') {
        let _token = `${Base64.encode(this.wxunionid)}`
        console.log('_token='+_token)
        wx.miniProgram.postMessage({ data: { 'token': _token, 'title': this.inviteTitle } })
      }
    },
    closeShareAlert() {
      this.$refs.shareType.hide()
      this.showMask = false
    },
    showSharePic() {
      this.shareMaskPic = false
    },
  },
  components: {
    MHeader,
    ShareType
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .extend
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    color: $text_color
    background-color: $background-base
  .extend-wrapper
    position: fixed
    top: 0
    bottom: 0/$cale+rem
    width: 100%
    overflow: hidden
    .scroll-inner
      padding-bottom: 30/$cale+rem
    .extend-content  
      background: $white
      padding: 15/$cale+rem
      margin-bottom: 10/$cale+rem
    .extend-head
      display: flex
      justify-content: space-between
      font-size: 14/$cale+rem
      .extend-describ
        color: $gray
        font-size: 12/$cale+rem
    .extend-content-list    
      padding-bottom: 0
    .extend-amount
      text-align: center
      font-size: 48/$cale+rem
      font-weight: 500
      color: #dd7b7b
      margin: 25/$cale+rem 0 15/$cale+rem
      padding-bottom: 25/$cale+rem
      border-bottom: 1px solid $mall-border-base
    .tips
      position: relative  
      .tips-icon
        display: inline-block
        +size(20/$cale+rem)
        +bg-image('./icon-income')
        background-size: 100% 100%
      .tips-content
        font-size: 12/$cale+rem
        color: $gray 
        position: absolute
        top: 5/$cale+rem 
        left: 30/$cale+rem 
    .extend-list
      display: flex
      justify-content: space-between
      text-align: center
      padding: 5/$cale+rem 0 20/$cale+rem
      li>p
        font-size: 24/$cale+rem
        color: $new-blue
        margin-bottom: 15/$cale+rem
      li>div
        font-size: 14/$cale+rem
        color: $gray-base
      .left
        position: relative
        left: 20/$cale+rem  
      .right 
        position: relative 
        right: 20/$cale+rem 
      .middle
        border-left:  1px solid $mall-border-base 
        border-right:  1px solid $mall-border-base 
        padding: 0 35/$cale+rem
    .user
      margin-top: 15/$cale+rem
      padding-top: 15/$cale+rem
      border-top:  1px solid $mall-border-base
      display: flex 
      flex-wrap: wrap
      // justify-content: space-between
      .user-list  
        margin-right: 10/$cale+rem
        margin-bottom: 15/$cale+rem
      .avatar
        +size(42/$cale+rem)
        border-radius: 50%
      .more-content
        width: 42/$cale+rem
        position: relative
        .more
          width: 25/$cale+rem
          height: 6/$cale+rem
          +bg-image('./more-icon')
          background-size: 100% 100%   
          position: absolute
          top: 50%
          left: 10/$cale+rem
    .invite-btn
      position: fixed
      bottom: 0
      width: 100% 
      height: 48/$cale+rem
      line-height: 48/$cale+rem
      text-align: center
      color: $white
      font-size: 14/$cale+rem 
      background: $new-bottom-btn-base
    .shareType
      background: $white
      color: $gray-dark
    .showMask
      position: fixed
      z-index: 1001
      left: 0
      right: 0
      bottom: 0
      top: 0
      background: rgba(0,0,0,0.6)  
      width: 100%
      height: 100%  
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
      &.fade-enter, &.fade-leave-to
        opacity: 0  
  .share-mask-pic
    position: fixed
    z-index: 1003
    left: 0
    right: 0
    bottom: 0
    top: 0 
    >img
      width: 100%
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0    
</style>