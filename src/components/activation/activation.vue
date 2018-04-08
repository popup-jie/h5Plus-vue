<template>
  <div class="activation">
    <div class="activation-wrapper" ref="wrapper">
      <div>
        <div class="activation-top" v-show="showPhone">
          <ul>
            <li class="flex">
              <div class="flex_item">
                <input type="tel" placeholder="请输入您的手机号" maxlength="11" v-model="mobile" />
              </div>
              <button class="" v-show="!IsSendCode" ref="codeBtn" @click="_sendCode">{{codeText}}</button>
              <button v-show="IsSendCode" class="already-send">已发送({{timeCount}}s)</button>
            </li>
            <li class="flex">
              <div class="flex_item">
                <input type="tel" placeholder="请输入短信验证码" maxlength="6" v-model="code" />
              </div>
            </li>
          </ul>
        </div>
        <div class="activation-content">
          <div class="logo"></div>
          <div class="guan"></div>
          <!-- <div class="sekuai">专属特权8/8</div> -->
          <ul class="flex">
            <li>
              <div class="pic five"></div>
              <div class="title">5折优惠</div>
              <div class="info">
                <p>终身享受5折</p>
                <p>（及以下）购豆优惠</p>
              </div>
            </li>
            <li class="border">
              <div class="pic jian"></div>
              <div class="title">单向减免</div>
              <div class="info">
                <p>售后（退货、换货）</p>
                <p>运费单向减免</p>
              </div>
            </li>
            <li>
              <div class="pic zhuanshu"></div>
              <div class="title">专属服务</div>
              <div class="info">
                <p>专属客户经理</p>
                <p>在线服务</p>
              </div>
            </li>

            <li>
              <div class="pic youxuan"></div>
              <div class="title">优选周边</div>
              <div class="info">
                <p>优选周边商品</p>
                <p>专属稀缺好物</p>
              </div>
            </li>
            <li class="border">
              <div class="pic gif"></div>
              <div class="title">花式福利</div>
              <div class="info">
                <p>畅想购物狂欢</p>
                <p>多种花式福利</p>
              </div>
            </li>
            <li>
              <div class="pic dingzhi"></div>
              <div class="title">私人定制</div>
              <div class="info">
                <p>特享私人订制</p>
                <p>专属精品礼盒</p>
              </div>
            </li>

            <li>
              <div class="pic cafei"></div>
              <div class="title">尊享咖啡</div>
              <div class="info">
                <p>尊享咖啡沙龙</p>
                <p>对话咖啡大师</p>
              </div>
            </li>
            <li class="border">
              <div class="pic kafeiyou"></div>
              <div class="title">咖啡游</div>
              <div class="info">
                <p>原生态咖啡</p>
                <p>庄园田园3日游</p>
              </div>
            </li>
            <li>
              <div class="pic more"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="fixedBtn flex">
      <span v-show="showPhone">开通菁亭会员，尊享8大特权</span>
      <div @click="activate" class="flex_item">{{btnText}}</div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { mapGetters, mapMutations } from 'vuex'
import { getUrlAttribute } from 'common/js/tools'
import {
  getRegisterCodejihuo,
  queryUserInfoByOpenId,
  registerInfo,
  queryUserInfoByWxUnionid,
  getUserInfo
} from 'api/userCenter'
let _registWay = ''
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      mobile: '',
      code: '', //验证码
      codeText: '发送验证码', //验证码文本描述 发送验证码 重发验证码
      IsSendCode: false, //文本描述显示什么
      timeCount: '', //验证码计时数
      showPhone: true,
      btnText: '激活'
    }
  },
  computed: {
    ...mapGetters(['openid', 'referralCode', 'wxunionid', 'userToken'])
  },
  created() {
    document.title = '菁亭超级会员'
    this._shareDetail()
    let _look = getUrlAttribute(window.location.href, 'look')
    _registWay = getUrlAttribute(window.location.href, 'registWay')
    if (_look) {
      _look = _look.split('#')[0]
    }
    if (_registWay) {
      _registWay = _registWay.split('#')[0]
    }
    if (this.wxunionid) {
      queryUserInfoByWxUnionid(this.wxunionid).then(res => {
        if (res.jingtingMemberGradeId) {
          this.successFn(res.token, res.id)
        } else {
          this.showPhone = true
        }
      })
    } else if (this.userToken) {
      getUserInfo(this.userToken).then(res => {
        if (res.jingtingGrade) {
          this.successFn(this.userToken, res.userInfoId)
        } else {
          this.showPhone = true
        }
      })
    }
    this._initScroll()
  },
  successFn(token, id) {
    this.showPhone = false
    this.setSuperVip(true)
    localStorage.setItem('JINGWEBUSERTOKEN', token)
    this.setUserToken(token)
    this.setUserId(id)
    if (_look == 'true') {
      this.btnText = '已激活'
    } else {
      if (window.__wxjs_environment === 'miniprogram') {
        if (_look == 'true') {
          // setTimeout(() => {
          //   //通过JSSDK的api使小程序跳转到指定的小程序页面
          //   wx.miniProgram.navigateBack()
          // }, 1000)
        } else {
          this.btnText = '已激活'
          var path = '/page/index/index'
          setTimeout(() => {
            //通过JSSDK的api使小程序跳转到指定的小程序页面
            wx.miniProgram.redirectTo({ url: path })
          }, 1000)
        }
      } else {
        setTimeout(() => {
          this.$router.replace('/home')
        }, 1000)
      }
    }
    // setTimeout(() => {
    //   this.$router.replace('/home')
    // }, 1000)
  },
  methods: {
    _initScroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.wrapper, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    activate() {
      if (this.btnText === '已激活') {
        //如果已经是会员
        if (window.__wxjs_environment === 'miniprogram') {
          wx.miniProgram.navigateBack()
        } else {
          this.$router.goBack()
        }
        return false
      }
      if (!this.mobile) {
        this.setToastMsg('手机号码不能为空')
        return false
      } else if (!this.code) {
        this.setToastMsg('验证码不能为空')
        return false
      }
      registerInfo(
        this.mobile,
        this.code,
        this.referralCode || '',
        this.openid,
        this.wxunionid,
        _registWay || 2
      ).then(res => {
        localStorage.setItem('JINGWEBUSERTOKEN', res.token)
        this.setToastMsg('激活成功')
        this.setUserToken(res.token)
        this.setUserId(res.userId)
        if (window.__wxjs_environment === 'miniprogram') {
          var path = '/page/index/index'
          setTimeout(() => {
            //通过JSSDK的api使小程序跳转到指定的小程序页面
            wx.miniProgram.navigateTo({ url: path })
          }, 1000)
        } else {
          setTimeout(() => {
            this.$router.replace('/home')
          }, 1000)
        }
      })
      //接口
    },

    _sendCode() {
      //发送验证码
      if (
        this.mobile.length != 11 ||
        !/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile)
      ) {
        //未输入手机号
        this.setToastMsg('请输入有效的手机号')
      } else {
        getRegisterCodejihuo(this.mobile).then(res => {
          if (res.success) {
            this.IsSendCode = true
            this.recommendTxtShow = true
            this.code = ''
            this.endTime()
          }
        })
      }
    },
    endTime() {
      //验证码倒计时
      const TIME_COUNT = 60
      if (!this.timer) {
        this.timeCount = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.timeCount > 0 && this.timeCount <= TIME_COUNT) {
            this.timeCount--
          } else {
            this.IsSendCode = false
            this.codeText = '重发验证码'
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    ...mapMutations({
      setUserToken: 'SET_USER_TOKEN',
      setUserId: 'SET_USER_INFO_ID',
      setSuperVip: 'SET_ISSUPERVIP'
    })
  },
  watch: {
    showPhone() {
      this.scroll.refresh()
    }
  }
}
</script>

<style lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.activation
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  font-size: 14 / $cale + rem
  .activation-wrapper
    position: absolute
    overflow: hidden
    width: 100%
    bottom: 44 / $cale + rem
    top: 0
    .activation-top
      background: #fff
      padding: 20 / $cale + rem 15 / $cale + rem
      padding-bottom: 20 / $cale + rem 
      ul li
        border-bottom: 1px solid $mall-border-base
        padding: 5 / $cale + rem  0
        input 
          font-size: 14 / $cale + rem
          width: 100%
          +line-height(32 / $cale + rem)
        button
          font-size: 14 / $cale + rem
          padding: 0 0.3rem
          +line-height(32 / $cale + rem)
          color: #fff
          background: $bottom-btn-background-light
          border: 0
          outline: 0
    .activation-content
      margin-top: 10 / $cale + rem
      background: #fff
      padding: 0.4rem 0
      .logo
        +bg-image('./logo')
        +size(180 / $cale + rem)
        margin: 0 auto
        background-size: 100%
        margin-bottom: 0.6rem
      .guan
        +bg-image('./special')  
        width: 120 / $cale + rem
        height: 37 / $cale + rem
        background-size: 100%
        margin: 0 auto
        position: relative
        z-index: 10
      // .guan
      //   background-image: url('./guan.png')
      //   +size(20 / $cale + rem)
      //   margin: 0 auto
      //   background-size: 100%
      // .sekuai
      //   margin: 0 auto
      //   background-size: 100%
      //   margin-top: -0.1rem
      //   background: $gray-base
      //   width: 110 / $cale + rem
      //   height: 20 / $cale + rem
      //   font-size: 12 / $cale + rem
      //   text-align: center
      //   line-height: 20 / $cale + rem
      //   color: #fff
      //   position: relative
      ul
        margin-top: -10 / $cale + rem
        border-top: 1px solid $mall-border-base
        flex-flow: wrap
        display: flex
        li
          padding: 18 / $cale + rem 0
          width: 33.3%
          text-align: center
          border-bottom: 1px solid $mall-border-base
          .pic
           
            margin: 0 auto
            background-size: 100%
            &.five
              +size(26 / $cale + rem)
              +bg-image('./five')
            &.jian
              +size(26 / $cale + rem)
              +bg-image('./jian')
            &.zhuanshu
              +size(26 / $cale + rem)
              +bg-image('./zhuanshu')
            &.youxuan
              +size(36 / $cale + rem, 26 / $cale + rem)
              +bg-image('./youxuan')
            &.gif
              +size(26 / $cale + rem)
              +bg-image('./gif')
            &.dingzhi
              +size(26 / $cale + rem)
              +bg-image('./dingzhi')
            &.cafei
              +size(29 / $cale + rem,26 / $cale + rem)
              +bg-image('./cafei')
            &.kafeiyou
              +size(27 / $cale + rem,28 / $cale + rem)
              +bg-image('./kafeiyou')
            &.more
              +size(40 / $cale + rem,10 / $cale + rem)
              +bg-image('./more')
              vertical-align: middle
              margin-top: 0.8rem
          .title
            font-weight: bold
            font-size: 14 / $cale + rem
            margin: 0.1rem 0
          .info
            font-size: 12 / $cale + rem
            color: $gray-base
          &.border
            border-left: 1px solid $mall-border-base
            border-right: 1px solid $mall-border-base
  .fixedBtn
    background: #fff
    font-size: 12 / $cale + rem
    border-top: 1px solid $mall-border-base
    position: fixed
    bottom: 0
    width: 100%
    color: #666
    +line-height(44 / $cale + rem)
    text-indent: 12px
    span
      width: 70%
    .flex_item
      background: $bottom-btn-background-light
      color: #fff
      text-align: center
      border: 0
      outline: 0
      font-size: 16 / $cale + rem
      text-indent: 0
.activation .activation-wrapper .activation-top ul li button.already-send 
  background-color: $gray
</style>
