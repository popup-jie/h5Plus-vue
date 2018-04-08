<template>
  <transition name="slide">
    <div class="set-password" ref="setPassword">
      <!-- 设置密码 -->
      <template v-if="!haszfmm">
        <m-header title="设置密码" :type="3" @back="back"></m-header>
        <form action="" method="get" class="setPassword">
          <div class="form_group">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="请输入密码(仅为数字)" v-model="fristSetPassword">
          </div>
          <div class="form_group full">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="再次输入密码(仅为数字)" v-model="lastSetPassword">
          </div>
        </form>
        <div class="finish-btn set-finish" ref="finishBtn" @click="_setPassword">完成</div>
      </template>

      <!-- 修改密码 -->
      <template v-if="(haszfmm && !forgetPwd)&& !isShowForget">
        <m-header title="修改密码" :type="3" @back="back"></m-header>
        <form action="" method="get" class="setPassword">
          <div class="form_group">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="输入原密码(仅为数字)" v-model="oldPassword">
          </div>
          <div class="form_group full">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="输入新密码(仅为数字)" v-model="fristSetPassword">
          </div>
          <div class="form_group full">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="再次输入新密码(仅为数字)" v-model="lastSetPassword">
          </div>
        </form>
        <!-- @click="forgetPassword" -->
        <div class="forget-password" @click="forgetPassword">忘记密码?</div>
        <!-- 修改完成跳回到上一级-->
        <div class="finish-btn modify-finish" ref="finishBtn" @click="_setPassword">完成</div>
      </template>

      <!-- 忘记密码 -->
      <template v-if="(haszfmm && forgetPwd) || isShowForget">
        <m-header title="忘记密码" :type="3" @back="back"></m-header>
        <form action="" method="get" class="setPassword">
          <div class="form_group">
            <!-- <span class="moblie">手机号码:</span> -->
            <!-- readonly="readonly" -->
            <input type="tel" class="moblie" name="mobile" id="mobile" v-model="mobile" maxlength="11" placeholder="请输入手机号">
          </div>
          <div class="form_group full code-form">
            <input type="tel" class="code password" name="code" ID="code" maxlength="6" placeholder="输入验证码" v-model="code">
            <input type="button" class="code-button" id="getCode" v-model="codeText" v-show="!IsSendCode" @click="_sendCode">
            <div class="gray-code-button code-button" v-show="IsSendCode">已发送({{timeCount}}s)</div>
          </div>
          <div class="form_group full">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="输入6位新密码(仅为数字)" v-model="fristSetPassword">
          </div>
          <div class="form_group full">
            <input type="password" class="password" name="code" ID="code" maxlength="6" placeholder="再次输入新密码(仅为数字)" v-model="lastSetPassword">
          </div>
        </form>
        <!-- 修改完成跳回到上一级-->
        <div class="finish-btn code-finish" ref="finishBtn" @click="_backPassword">完成</div>
      </template>

      <div class="toast" v-show="toastTxtShow">{{toastTxt}}</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { setToastMsg } from 'common/js/mixin'
import { mapGetters, mapMutations } from 'vuex'
import { addClass, removeClass, hasClass } from 'common/js/dom.js'
import { paymentPassword, backPassword, getRegisterCode } from 'api/userCenter'
import { initPage } from 'common/js/mixin'

export default {
  mixins: [setToastMsg, initPage],
  computed: {
    // mobile() {
    //   return this.mobile
    // },
    haszfmm() {
      return this.haszfmm
    },
    // , 'mobile'
    ...mapGetters(['userToken', 'haszfmm', 'forgetPwd'])
  },
  data() {
    return {
      toastTxt: '密码不一致，请重新输入密码',
      toastTxtShow: false,
      // haszfmm:false,//是否设置支付密码
      // forgetPasswordShow: false,//忘记密码
      isShowForget: false,//是否点击忘记密码
      mobile: null,
      code: null,//验证码
      codeText: '发送验证码', //验证码文本描述 发送验证码 重发验证码
      IsSendCode: false,//文本描述显示什么
      timeCount: '',//验证码计时数
      timer: null,
      oldPassword: null,//输入的原密码
      fristSetPassword: null,//设置支付密码(第一次输入密码)
      lastSetPassword: null,//设置支付密码(再次输入密码)
      oldPwd: null,//旧的支付密码
      title: '设置密码'
    }
  },
  watch: {
    fristSetPassword: function (val, oldval) {
      console.log(this.fristSetPassword.length)
    },
    lastSetPassword: function (val, oldval) {
      if ((this.fristSetPassword.length === 6) && (this.lastSetPassword.length === 6)) {
        this.finishBtn()
      }
    },
  },
  created() {
    if (!this.haszfmm) {
      document.title = '设置密码'
    }
    if ((this.haszfmm && !this.forgetPwd) && !this.isShowForget) {
      document.title = '修改密码'
    }
    if ((this.haszfmm && this.forgetPwd) || this.isShowForget) {
      document.title = '忘记密码'
    }
    this.$nextTick(() => {
      this._initPage(this.$refs.setPassword)
    })
  },
  deactivated() {
    this.clearAll()
    this.isShowForget = false
    this.setForgetPwd(this.isShowForget)
  },
  methods: {
    clearAll() {
      this.oldPassword = ''
      this.fristSetPassword = ''
      this.lastSetPassword = ''
      this.code = ''
    },
    back() {
      this.$router.goBack()
    },
    forgetPassword() {
      this.isShowForget = true
      this.clearAll()
    },
    finishBtn() {
      const el = this.$refs.finishBtn
      if (hasClass(el, 'active')) {
        removeClass(el, 'active')
      } else {
        addClass(el, 'active')
      }
    },
    _setPassword() {//设置/修改支付密码
      
      if ((this.fristSetPassword === this.lastSetPassword) && (this.lastSetPassword.length != '')) {//设置密码等于确认密码
        let parseCount1 = parseInt(this.fristSetPassword)
        let parseCount2 = parseInt(this.lastSetPassword)
        if (
          !(/^\d{6}$/.test(parseCount1))
          || !(/^\d{6}$/.test(parseCount2))
        ) {
          this.setToastMsg('密码只能为数字')
        } else {
          paymentPassword(this.userToken, this.lastSetPassword, this.oldPassword).then(res => {
            if (res.success) {
              this.clearAll()
              this.setToastMsg('设置成功')
              // if (this.fromPay) {//从订单支付页面过来
              //   this.$router.push(`./terminal`)
              // } else {
              this.back()
              // }
            } else {
              this.setToastMsg(res.msg)
            }
          })
        }
      } else if ((this.lastSetPassword.length == '') || (this.fristSetPassword.length == '')) { //密码长度为空时
        this._noPassword()
      } else { //密码不一致
        this._diffPassword()
      }
    },
    _backPassword() {//找回密码
      if (
        !(/^\d{6}$/.test(this.fristSetPassword))
        || !(/^\d{6}$/.test(this.lastSetPassword))
      ) {
        this.setToastMsg('密码只能为数字')
      } else {
        if ((this.fristSetPassword === this.lastSetPassword) && (this.lastSetPassword.length != '')) {//设置密码等于确认密码
          backPassword(this.userToken, this.lastSetPassword, this.mobile, this.code).then(res => {
            if (res.success) {
              this.clearAll()
              this.setToastMsg('设置成功')
              this.isShowForget = false
              // if (this.fromPay) {//从订单支付页面过来
              //   this.$router.push(`./terminal`)
              // } else {
              this.back()
              // }
            } else {
              this.setToastMsg(res.msg)
            }
          })
        } else if ((this.lastSetPassword.length == '') || (this.fristSetPassword.length == '')) { //密码长度为空时
          this._noPassword()
        } else { //密码不一致
          this._diffPassword()
        }
      }
    },
    _sendCode() {//发送验证码
      getRegisterCode(this.mobile, 400).then(res => {
        if (res.success) {
          // this.setToastMsg('发送成功')
          this.IsSendCode = true
          this.endTime()
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    endTime() {//验证码倒计时
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
    _noPassword() {
      this.toastTxt = '密码不能为空'
      this.toastTxtShow = true
      setTimeout(() => {
        this.toastTxtShow = false
      }, 1500)
    },
    _diffPassword() {
      this.toastTxt = '密码不一致，请重新输入密码'
      this.toastTxtShow = true
      this.lastSetPassword = '' //清空确认密码
      this.finishBtn() //去除按钮颜色
      setTimeout(() => {
        this.toastTxtShow = false
      }, 1500)
    },
    ...mapMutations({
      setForgetPwd: 'SET_FORGET_PWD'
    })
  },
  components: {
    MHeader
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"
  .set-password
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $white
    .setPassword
      margin-top: 20px
    .form_group
      position: relative
      margin-left: 15px
      border-bottom: 1px solid $gray-lighter
      padding-bottom: 10px
      font-size: 14px
      .password::-webkit-input-placeholder
        font-size: 14px
        color: $gray-light
    .full
      margin-top: 20px
    .moblie
      color: $gray-dark
    .moblie::-webkit-input-placeholder
      font-size: 14px
      color: $gray-light
    .code-button
      color: $white
      background: $mall-main
      padding: 5px 15px
      border-radius: $border-radius-base
      box-shadow: 0px 0px  8px 3px $gray-lighter
      position: absolute
      bottom: 9px
      right: 15px
    .gray-code-button
      background: $gray-light
      color: $gray
    .forget-password
      color: $mall-main
      float: right
      margin: 10px 15px
      font-size: 14px
    .finish-btn
      margin: 50px 0 0 15px
      text-align: center
      width: 92%
      color: $white
      height: 44px
      line-height: 44px
      font-size: 17px
      background: $bottom-btn-background-light 
      border-radius: $border-radius-base
      box-shadow: 0px 0px  8px 3px $gray-lighter
      &.active      
        background: $bottom-btn-background-base
    .code-finish
      margin-top: 25px
    .toast
      @include center(null, null)
      padding: 10px 20px
      line-height: 20px
      background: rgba(0, 0, 0, 0.6)
      border-radius: $border-radius-large
      color: $white
      font-size: 14px
      text-align: center
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)


</style>