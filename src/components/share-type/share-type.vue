<template>
  <transition name="fade">
    <div class="share-style shareStyle" @click="closeAlert" v-show="showFlag">
      <!-- v-show="!showFlag" -->
      <!-- <h4 v-show="!showFlag">分享到</h4> -->
      <ul class="share-list">
        <li @click.prevent.stop="shareSort('weixin','WXSceneSession')">
          <span class="share-icon icon-weixin"></span>微信</li>
        <li @click.prevent.stop="shareSort('weixin','WXSceneTimeline')">
          <span class="share-icon icon-friend"></span>朋友圈</li>
        <li @click.prevent.stop="shareSort('qq','')">
          <span class="share-icon icon-qq"></span>QQ</li>
        <!-- <li data-share="5">
            <span class="share-icon icon-qzone" @click="shareSort ('qq','')"></span>QQ空间</li> -->
        <!-- <li @click.prevent.stop="shareSort('sinaweibo','')">
          <span class="share-icon icon-weibo"></span>微博</li> -->
      </ul>
    </div>
  </transition>
</template>



<script>
import { mapGetters } from 'vuex'
import { serverUrlApp } from 'api/config'
import { getSignData } from 'api/getSignData'

export default {
  props: {
    title: {
      type: String,
      default: '菁小咖'
    },
    content: {
      type: String,
      default: '知识白领的社交app,以礼相约，让你找到想要的......'
    },
    thumbs: {
      type: String,
      default: require('./icon_show_img.png')
    },
    href: {
      type: String,
      default: serverUrlApp + '/views/share/share.html'
    }
  },
  watch: {
    href(newVal) {
      if (newVal) {
        if (this.programType === 'microweb') {
          this.inviteFriend()
        }
      }
    }
  },
  mounted() {
    const self = this
    if (window.plus) {
      self.plusReady()
    } else {
      document.addEventListener('plusready', self.plusReady, false)
    }
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        // alert('DOMLoaded')
        self.domready = true
        self.plusReady()
      },
      false
    )
  },
  computed: {
    ...mapGetters(['userToken', 'userInfoId', 'programType', 'openid'])
  },
  data() {
    return {
      showFlag: false
    }
  },
  created() {
    if (this.programType === 'microweb') {
      this.inviteFriend()
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    closeAlert() {
      this.$emit('closeAlert')
    },
    shareSort(...arg) {
      // var href = '?token=' + this.userToken + '&userInfoId=' + this.userInfoId + '&from=singlemessage'
      // var thumbs = require(this.thumbs)
      // if (this.programType === 'H5App') {
      this.share(...arg, this.title, this.content, this.thumbs, this.href)
      // }
    },
    share(...arg) {
      console.log(arg)
      /*shareName:  weixin,qq ...
        shareType: weixin 分为 WXSceneSession(微信好友) WXSceneTimeline(微信朋友圈)
        title: 分享名称
        content：分享内容
        thumbs：分享缩略图
        href： 分享链接
      */
      var shares = null, shareCategory = null
      plus.share.getServices(function (s) {
        shares = s
        /*share:[
          {"id":"sinaweibo","description":"新浪微博","authenticated":false,"accessToken":"","nativeClient":true},
          {"id":"tencentweibo","description":"腾讯微博","authenticated":false,"accessToken":"","nativeClient":false},
          {"id":"qq","description":"QQ","authenticated":false,"accessToken":"","nativeClient":true},
          {"id":"weixin","description":"微信","authenticated":true,"accessToken":"","nativeClient":true}
        ]*/
        for (var i in s) {
          if (arg[0] == s[i].id) {
            shareCategory = s[i]
          }
        }
        shareCategory.send({//推荐页面分享
          title: arg[2],
          content: arg[3],
          thumbs: [arg[4]],
          href: arg[5],
          extra: { scene: arg[1] }
        }, function () {
          console.log('分享成功')
        }, function (e) {
          console.log('分享失败:' + e.message)
        })
      }, function (e) {
        console.log('获取分享服务列表失败：' + e.message)
      })
    },
    inviteFriend() {
      let _self = this
      let url = location.href.split('#')[0]
      console.log('_self.href=' + _self.href)
      getSignData(_self.openid, url).then(res => {
        let data = res.data
        //配置微信
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareQZone'
          ]
        })
        wx.ready(function () {
          wx.onMenuShareTimeline({
            //分享到朋友圈
            title: _self.title, // 分享标题
            link: _self.href, // 分享链接
            imgUrl: _self.thumbs,  // 分享图标
          });
          wx.onMenuShareAppMessage({
            //分享给朋友
            title: _self.title, // 分享标题
            desc: _self.content, // 分享描述
            link: _self.href, // 分享链接
            imgUrl: _self.thumbs, // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '',// 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              _self.setToastMsg('分享成功')
            },
            cancel: function () {
              _self.setToastMsg('分享取消')
            }
          });
          wx.onMenuShareQQ({//分享到QQ
            title: _self.title, // 分享标题
            desc: _self.content, // 分享描述
            link: _self.href, // 分享链接
            imgUrl: _self.thumbs // 分享图标
          });
          wx.onMenuShareQZone({//分享到QQ空间
            title: _self.title, // 分享标题
            desc: _self.content, // 分享描述
            link: _self.href, // 分享链接
            imgUrl: _self.thumbs // 分享图标
          })

          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        })

        wx.error(function (err) {
          _self.setToastMsg('验证失败~')
        })
      })
    }
  }
}
</script>

<style lang="sass" type="text/sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .share-style
    position: fixed
    width: 100%
    font-size: 12px
    color: $white
    text-align: center
    line-height: 17px
    bottom: 0
    z-index: 999
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
    // h4
    //   position: relative
    //   padding: 30px 15px 10px
    //   &:before
    //     content: ''
    //     +position(absolute, (right 15px bottom 0 left 15px))
    //     +b-solid(1px, rgba(255, 255, 255, 0.3), bottom)
    .share-list
      padding: 15px
      display: flex
      li
        position: relative
        padding-top: 56px
        flex: 1
      .share-icon
        +position(absolute, (top 0 left 50%))
        margin-left: -23px
    // 分享 - 图标
    .share-icon
      +size(46px)
      background: url('share.png') no-repeat
      background-size: auto 100%
      display: inline-block
      &.icon-weixin
        background-position: 0 0
      &.icon-friend
        background-position: -46px 0
      &.icon-qq
        background-position: -92px 0
      &.icon-qzone
        background-position: -138px 0
      &.icon-weibo
        background-position: -184px 0  
</style>        