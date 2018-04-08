<template>
  <transition>
    <!-- @click="closeAlert" -->
    <div class="register" v-show="showFlag">
      <div class="register-popup">
        <ul>
          <li class="flex">
            <div class="flex_item">
              <input type="tel" placeholder="请输入您的手机号" maxlength="11" v-model="mobile" />
            </div>

          </li>
          <li class="flex">
            <div class="flex_item">
              <input type="tel" placeholder="请输入短信验证码" maxlength="6" v-model="code" />
            </div>
            <button class="" v-show="!IsSendCode" ref="codeBtn" @click="_sendCode">{{codeText}}</button>
            <button v-show="IsSendCode" class="already-send">已发送({{timeCount}}s)</button>
          </li>
          <li class="flex">
            <div class="register-btn" ref="registerBtn" @click="register">
              注册
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { getRegisterCode, wxLogin } from 'api/register'
import { addClass, removeClass, hasClass } from 'common/js/dom.js'
import { setToastMsg } from 'common/js/mixin'
import { mapMutations, mapGetters } from 'Vuex'

export default {
  mixins: [setToastMsg],
  computed: {
    ...mapGetters([
      'openid',
      'wxunionid',
      'programType',
      'userAvatar',
      'userNickName'
    ])
  },
  data() {
    return {
      showFlag: false,
      mobile: '',
      code: '', //验证码
      codeText: '发送验证码', //验证码文本描述 发送验证码 重发验证码
      IsSendCode: false, //文本描述显示什么
      timeCount: '', //验证码计时数
      openWay: null
    }
  },
  created() {
    if (this.programType == 'microweb') {
      this.openWay = 1
    } else if (this.programType == 'H5App') {
      this.openWay = 3
    } else if (this.programType == 'wechat') {
      this.openWay = 4
    }
  },
  watch: {
    mobile: function(val, oldval) {
      this.codeBtn()
    },
    code: function() {
      this.registerBtn()
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
      this.hide()
    },
    codeBtn() {
      //验证码颜色显示
      const el = this.$refs.codeBtn
      if (this.mobile.length == 11) {
        // if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile)) {
        //正确的手机号
        addClass(el, 'active')
        // } else {
        // this.setToastMsg('手机号码有误')
        // }
        // this.sendCode()
      } else {
        removeClass(el, 'active')
      }
    },
    registerBtn() {
      const el = this.$refs.registerBtn
      if (this.mobile.length == 11) {
        // if (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile)) {
        if (this.code.length == 6) {
          addClass(el, 'active')
        } else {
          removeClass(el, 'active')
        }
        // }
      } else {
        removeClass(el, 'active')
      }
    },
    _sendCode() {
      //发送验证码
      if (this.mobile.length != 11) {
        //未输入手机号
        this.setToastMsg('请输入手机号')
      } else {
        getRegisterCode(this.mobile, 400).then(res => {
          if (res.success) {
            this.IsSendCode = true
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
    register() {
      let _userAvatar = ''
      _userAvatar = this.userAvatar || ''
      if (this.mobile.length != 11) {
        //未输入手机号
        this.setToastMsg('请输入手机号')
      } else if (this.code.length != 6) {
        this.setToastMsg('请输入验证码')
      } else {
        wxLogin(
          this.openid,
          _userAvatar,
          0,
          this.userNickName,
          this.mobile,
          this.code,
          this.wxunionid,
          this.openWay
        ).then(res => {
          //注册成功
          if (res.success) {
            this.setToastMsg('注册成功')
            this.setUserToken(res.token)
            this.setUserInfoId(res.userId)
            this.setUserMobile(this.mobile)
            this.hide()
          } else {
            this.setToastMsg(res.msg)
          }
        })
      }
    },
    ...mapMutations({
      setUserToken: 'SET_USER_TOKEN',
      setUserInfoId: 'SET_USER_INFO_ID',
      setUserMobile: 'SET_USER_MOBILE'
    })
  }
}
</script>
<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .register
    position: fixed
    bottom: 0
    top: 0
    left: 0
    right: 0
    z-index: 110
    background: rgba(0,0,0,0.6)
    .register-popup
      background: $white
      position: absolute
      top: 40%
      left: 10%
      width: 80%
      border-radius: 5/$cale + rem
      padding: 30/$cale + rem 20/$cale + rem
      animation: register-zoom 1s
    input 
      font-size: 14 / $cale + rem
      width: 100%
      +line-height(32 / $cale + rem)
      border-bottom: 1px solid #ececec
    input::-webkit-input-placeholder
      color: $gray
    button
      font-size: 14 / $cale + rem
      padding: 0 0.3rem
      +line-height(32 / $cale + rem)
      color: $white
      background: $bottom-btn-background-light
      border: 0
      outline: 0
      margin-top: 12/ $cale + rem
      border-radius: 3/ $cale + rem
      &.active
        background: $bottom-btn-background-base
    .register-btn
      font-size: 16 / $cale + rem 
      text-align: center
      color: $white
      padding: 12/ $cale + rem  30/ $cale + rem 
      background: $bottom-btn-background-light 
      border-radius: 5/ $cale + rem 
      margin-top: 20/ $cale + rem 
      margin-left: 30%
      &.active
        background: $bottom-btn-background-base
  @keyframes register-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)      
</style>