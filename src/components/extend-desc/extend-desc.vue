<template>
  <div class="extend-desc">
    <m-header title="推广说明" :type="3" @back="back"></m-header>
    <div class="extend-desc-wrapper" ref="extendDescWrapper" @load="minipragram">
      <div class="scroll-inner">
        <h1 class="title">分享赚佣金</h1>
        <p class="desc">分享分为两个级别，分别对应两个分享佣金比例。级别 的高低，依照其引发用户点击分享链接的亲疏关系而定。
        </p>
        <table class="grade-desc">
          <tr>
            <td>等级名称</td>
            <td>一级</td>
            <td>二级</td>
          </tr>
          <tr>
            <td>佣金比例</td>
            <td>15%</td>
            <td>10%</td>
          </tr>
        </table>
        <div class="mode-tips">（具体根据每个商品设置的佣金比例为准）</div>
        <h2 class="compute-mode">佣金计算方式</h2>
        <p class="compute-mode-desc">好友成功购买每个带有“
          <span class="icon-earn"></span>”图标的商品，则您会获得根据对应商品设定的佣金比例计算出的佣金。注：无该标 记的商品则不参与计算佣金
        </p>
        <h2 class="compute-mode">分享方式</h2>
        <p class="compute-mode-desc">点击至商品详情页，点击图标“
          <span class="icon-earn"></span>”或点击“我的”-“推广中心”，点击“邀请好友”，进入推广中心。将推广链接分享给他人。被邀请人产生业绩 后，邀请人即可获得相应的佣金。如图：</p>
        <ul class="attach-wrapper">
          <li>
            <span class="attach-pic"></span>
          </li>
          <li>
            <span class="attach-pic"></span>
          </li>
          <li>
            <span class="attach-pic"></span>
          </li>
          <li>
            <span class="attach-pic" @load="minipragram"></span>
          </li>
        </ul>
      </div>
      <!-- 分享 -->
      <share-type ref="shareType" class="shareType" :title="inviteTitle" :content="inviteContent" :thumbs="thumbs" :href="href"></share-type>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import { initPage, setToastMsg } from 'common/js/mixin'
import { getBase64UrlAttribute } from 'common/js/tools'
import { Base64 } from 'js-base64'
import { queryAndRegistUser, bindShareSaleUser } from 'api/extend'
import { mapGetters, mapMutations } from 'Vuex'
import { serverUrlPrefix, serverUrlSuffix } from 'api/config'
import ShareType from 'components/share-type/share-type'

export default {
  mixins: [initPage, setToastMsg],
  data() {
    return {
      token: '', //邀请用户token
      urlParams: {}, //分享带过来的参数
      inviteTitle: '菁小咖邀你分享赚佣金',//邀请好友标题
      inviteContent: '菁小咖 不寻常',//邀请好友内容
    }
  },
  computed: {
    thumbs() {
      return 'http://120.76.155.216/file/file/preview/bWFsbENhdGVJbWclMkYyMDE4MDExNiUyRjQ5MTEwNjFmZjFlZDRhN2JhZTY4Y2Y3NDYwODk0MjdkX2xBTFBCYkNjMVZRY3Back5BVlROQVdnXzM2MF8zNDAucG5n'
    },
    href() {
      return serverUrlPrefix + `programType=${this.programType}&token=${Base64.encode(this.token)}&target=extenddesc` + serverUrlSuffix
    },
    ...mapGetters(['userToken', 'hiddenHTab', 'hiddenFTab', 'programType', 'openid', 'wxunionid'])
  },
  created() {
    document.title = '推广说明'
    this._initscroll()
    this.$nextTick(() => {
      this._initPage(this.$refs.extendDescWrapper)
    })
    if (this.programType === 'wechat') {
      this.setHiddenHTab(true)
      this.setHiddenFTab(true)
    }
    this._initData()
  },
  activated() {
    this._initData()
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.extendDescWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    //初始化参数
    _initData() {
      let url = window.location.href
      let urlToken = getBase64UrlAttribute(url, 'token')
      this.token = urlToken

      console.log('进入了推广说明')
      console.log('url: ' + url)
      console.log('token: ' + this.token)
      console.log('openid: ' + this.openid)
      console.log('wxUnionid: ' + this.wxunionid)

      if (this.programType === 'wechat') { //小程序
        this.queryAndRegistUser(this.openid, this.wxunionid, 4)
      } else if (this.programType === 'microweb') { //微网站
        this.queryAndRegistUser(this.openid, this.wxunionid, 1)
      } else { //H5App
        this.queryAndRegistUser(this.openid, this.wxunionid, 3)
      }
    },
    //查询并注册用户
    queryAndRegistUser(openid, wxUnionid, openWay) {
      queryAndRegistUser(openid, wxUnionid, '', '', '', openWay).then(res => {
        console.log(res)
        if (res.success) {
          let custToken = res.token
          this.bindShareSaleUser(custToken)
        } else {
          //this.setToastMsg(res.msg)
        }
        this.minipragram()
      })
    },
    //绑定分销用户
    bindShareSaleUser(custToken) {
      bindShareSaleUser(this.token, custToken).then(res => {
        console.log(res)
        if (res.success) {
          //this.setToastMsg('绑定分销用户成功')
        } else {
          //this.setToastMsg(res.msg)
        }
      })
      this.minipragram()
    },
    minipragram() {
      console.log('进入分享佣金页面')
      if (window.__wxjs_environment === 'miniprogram') {
        let _token = `${this.token}`
        console.log('_token=' + _token)
        wx.miniProgram.postMessage({ data: { 'token': _token, 'title': this.inviteTitle } })
      }
    },
    ...mapMutations({
      setHiddenHTab: 'SET_HIDDENHTAB',
      setHiddenFTab: 'SET_HIDDENFTAB'
    })
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

  .extend-desc
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    line-height: 20/$cale+rem
    color: $text_light
    text-align: left
    background-color: $white
  .extend-desc-wrapper
    position: fixed
    top: 44/$cale+rem
    bottom: 0/$cale+rem
    width: 100%
    overflow: hidden
    .scroll-inner
      padding: 20/$cale+rem 15/$cale+rem
      .title
        padding-bottom: 10/$cale+rem
        line-height: 24/$cale+rem
        font-weight: 600
        font-size: 17/$cale+rem
        color: $mall-main
        text-align: center
      .desc
        padding-bottom: 20/$cale+rem
      .grade-desc
        width: 100%
        tr
          display: flex
          &:first-child td
            border-bottom: 0
        td
          flex: 1
          line-height: 24/$cale+rem
          font-size: 17/$cale+rem
          color: $text_color
          padding: 8/$cale+rem 0
          border: 1/$cale+rem solid $mall-border-base
          text-align: center
          &:nth-child(2)
            border-left: 0
            border-right: 0
      .mode-tips
        font-size: 14/$cale +rem 
        color: #dd7b7b   
        position: relative
        left: 83/$cale +rem 
        top: 5/$cale +rem  
      .compute-mode
        padding-top: 20/$cale+rem
        padding-bottom: 10/$cale+rem
        line-height: 24/$cale+rem
        font-size: 17/$cale+rem
        color: $text_color
      .compute-mode-desc
        .icon-earn
          display: inline-block
          +size(14/$cale+rem)
          +bg-image('./icon-earn')
          background-size: 100% 100%
          vertical-align: middle
      .attach-wrapper
        padding-top: 15/$cale+rem
        display: flex
        flex-wrap: wrap
        li
          margin-right: 15/$cale+rem
          margin-bottom: 15/$cale+rem
          .attach-pic
            display: inline-block
            +size(165/$cale+rem,293/$cale+rem)
            +bg-image('./attach_pic1')
            background-size: 100% 100%
          &:nth-child(2) .attach-pic
            +bg-image('./attach_pic2')
          &:nth-child(3) .attach-pic
            +bg-image('./attach_pic3')
          &:nth-child(4) .attach-pic
            +bg-image('./attach_pic4')
          &:nth-child(2n)
            margin-right: 0
  .shareType
    background: $white
    color: $gray-dark          
</style>