<template>
  <transition name="fade">
    <div class="bottomWrapper" @click="closeAlert" v-show="showFlag">
      <div class="dialog" v-show="!showPassinput">
        <div class="order-title">
          <span class="title">支付方式</span>
        </div>
        <ul class="payment-list">
          <li data-payment="4" class="payment-item isMemeber" v-show="showVip" @click.prevent.stop="gopayfor('vipcard')">
            <span class="payment-icon icon-cardPay"></span>会员卡支付（余额：
            <span class="cardAmount">{{showVipmoney}}</span>元）
            <span class="icon-arrow-right"></span>
          </li>
          <li data-payment="3" class="payment-item active unclick wallet" v-show="showWallet" @click.prevent.stop="gopayfor('wallet')">
            <span class="payment-icon icon-wallet"></span>线上钱包（余额：
            <span class="walletAmount">{{userWalletMoney}}</span>元）
            <span class="icon-arrow-right"></span>
          </li>
          <li data-payment="2" class="payment-item" data-id="wxpay" @click.prevent.stop="payMoney('wxpay',1)">
            <span class="payment-icon icon-wechat"></span>微信支付
            <span class="icon-arrow-right"></span>
          </li>
          <li data-payment="1" class="payment-item" data-id="alipay" @click.prevent.stop="payMoney('alipay',0)" v-show="programType === 'H5App'">
            <span class="payment-icon icon-zfb"></span>支付宝支付
            <span class="icon-arrow-right"></span>
          </li>
        </ul>
      </div>

      <!-- 显示钱包支付密码弹窗 -->
      <div class="pwd_dialog" v-show="showPassinput">
        <div class="dialog">
          <h4 class="dialog_title">
            <span class="close_dialog" @click.prevent.stop="payforsuccess('close')">
              <i class="sx_icon icon-cancel"></i>
            </span>支付
            <span class="forget-password" id="jq-forget" @click.prevent.stop="forget">忘记密码</span>
          </h4>
          <p class="payment_style" v-if="paytype == 'vipcard' ">会员卡支付</p>
          <p class="payment_style" v-else>线上钱包</p>
          <p class="price">¥
            <span class="jq-payAmount">{{payforallMoney}}</span>
          </p>
          <div class="pwdInput">
            <form>
              <ul class="mm_box">
                <!-- 输入支付密码的六个框 -->
                <li v-for="(pass,index) in passwordlist" :key="index">
                  <span>{{pass.show ? '●' : ' '}}</span>
                  <input type="hidden" :value="pass.value">
                </li>
              </ul>
              <!-- 合并支付密码框的数字，即获得六个支付密码 -->
            </form>
          </div>
        </div>
      </div>

      <div class="numb_box" v-show="showPassinput">
        <div class="xiaq_tb" @click.prevent.stop="payforsuccess('close')">
          <img src="./jftc_14.png" height="10">
        </div>
        <ul class="nub_ggg">
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(1)">1</a>
          </li>
          <li>
            <a href="javascript:void(0);" class="zj_x" @click.prevent.stop="password(2)">2</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(3)">3</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(4)">4</a>
          </li>
          <li>
            <a href="javascript:void(0);" class="zj_x" @click.prevent.stop="password(5)">5</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(6)">6</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(7)">7</a>
          </li>
          <li>
            <a href="javascript:void(0);" class="zj_x" @click.prevent.stop="password(8)">8</a>
          </li>
          <li>
            <a href="javascript:void(0);" @click.prevent.stop="password(9)">9</a>
          </li>
          <li>
            <span></span>
          </li>
          <li>
            <a href="javascript:void(0);" class="zj_x" @click.prevent.stop="password(0)">0</a>
          </li>
          <li>
            <span class="del" @click.prevent.stop="delepass()">
              <img src="./jftc_18.png">
            </span>
          </li>
        </ul>
      </div>
      <!-- <div class="wrapper-content flex">
        <div class="alipay flex_item" data-id="alipay" @click.prevent.stop="payMoney('alipay',0)">
          <img src="./alipay.png" width="40px" height="40px" />
          <span>支付宝</span>
        </div>
        <div class="wxpay flex_item" data-id="wxpay" @click.prevent.stop="payMoney('wxpay',1)">
          <img src="./wxpay.png" width="40px" height="40px" />
          <span>微信</span>
        </div>
      </div> -->
      <!-- <confirm :isShowconfirm="false" :isShowcancel="false" :text="'支付中...'" v-show="showToast" @closeAlert="close"></confirm> -->
      <!-- v-show="showToast" -->
      <mt-popup position="middle" v-model="showToast" class="payingPopup">
        <span class="paying">支付中...</span>
      </mt-popup>
    </div>
  </transition>
</template>

<script>
var pays = {}

import {
  unifiedPay,
  hasPaymentPassword,
  Newcloud8Pay,
  cloud8Pay
} from 'api/pay'
import { mapGetters, mapMutations } from 'vuex'
import { setToastMsg, wxPay } from 'common/js/mixin'
import MtPopup from 'mint-ui/lib/popup'
import 'mint-ui/lib/popup/style.css'
import { offlinepayforUrl, serverUrlWechat, payforUrl } from 'api/config'
import { startGroupBuy } from 'api/groupbuy'

export default {
  mixins: [setToastMsg, wxPay],
  components: {
    MtPopup
  },
  props: {
    groupBuyTypeId: {
      type: String,
      default: ''
    },
    //支付类型
    payfor: {
      type: Number,
      default: 2
    },
    //充值金额
    rechMoney: {
      type: Number,
      default: 0
    },
    //红包id
    // userWalletId: {
    //   type: Number,
    //   default: 0
    // },
    showWallet: {
      type: Boolean,
      default: false
    },
    //线上钱包余额
    // showWalletmoney: {
    //   type: Number,
    //   default: 0
    // },
    showVip: {
      type: Boolean,
      default: false
    },
    //会员余额
    showVipmoney: {
      type: Number,
      default: 0
    },
    //支付总金额
    payforallMoney: {
      type: Number,
      default: 0.01
    },
    //进入类型（线上、线下(默认)）
    comeType: {
      type: String,
      default: 'offline'
    },
    //充值 或者 下单接口
    // 线上商城下单接口：
    payforUrl: {
      type: String,
      default: offlinepayforUrl //默认是充值接口
    }
  },
  computed: {
    ...mapGetters([
      'userToken',
      'haszfmm',
      'programType',
      'openid',
      'orderNo',
      'visitBookRetempId',
      'userWalletId',
      'userWalletMoney',
      'goodsid'
    ])
  },
  data() {
    return {
      showFlag: true,
      passwordlist: [
        {
          show: false,
          value: ''
        },
        {
          show: false,
          value: ''
        },
        {
          show: false,
          value: ''
        },
        {
          show: false,
          value: ''
        },
        {
          show: false,
          value: ''
        },
        {
          show: false,
          value: ''
        }
      ],
      showPassinput: false,
      paytype: '', // wallet 线上钱包 vipcard 会员卡
      fromPay: true, //从支付页面跳到设置密码
      showToast: false
    }
  },
  created() {
    clearInterval(this.PAYFORTIME)
    this.PAYFORTIME = null
    if (window.__wxjs_environment === 'miniprogram') {
      var u = navigator.userAgent,
        app = navigator.appVersion
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      if (isIOS) {
        this.PAYFORTIME = setInterval(() => {
          let _num = localStorage.getItem('payforsuc')
          if (_num) {
            console.log('计时器启动1')
            // alert('支付成功')
            // 微信小程序才会存在设置这个值
            localStorage.removeItem('payforsuc')
            // this.setToastMsg('支付成功')
            this.$emit('payforSuccess', 2)
            this.showToast = false
            return false
          }
        }, 1500)
      }
    }
    let _num = localStorage.getItem('payforsuc')
    if (_num) {
      localStorage.removeItem('payforsuc')
      // this.setToastMsg('支付成功')
      this.$emit('payforSuccess', 2)
      this.showToast = false
      return false
    }
    let self = this
    if (window.plus) {
      self.plusReady()
    } else {
      document.addEventListener('plusready', self.plusReady, false)
    }
    document.addEventListener(
      'DOMContentLoaded',
      function() {
        self.domready = true
        self.plusReady()
      },
      false
    )
  },
  activated() {
    clearInterval(this.PAYFORTIME)
    this.PAYFORTIME = null
    if (window.__wxjs_environment === 'miniprogram') {
      var u = navigator.userAgent,
        app = navigator.appVersion
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
      if (isIOS) {
        console.log('计时器启动2')
        this.PAYFORTIME = setInterval(() => {
          let _num = localStorage.getItem('payforsuc')
          if (_num) {
            // alert('支付成功')
            // 微信小程序才会存在设置这个值
            localStorage.removeItem('payforsuc')
            // this.setToastMsg('支付成功')
            this.$emit('payforSuccess', 2)
            this.showToast = false
            return false
          }
        }, 1500)
      }
    }
  },
  deactivated() {
    clearInterval(this.PAYFORTIME)
    this.PAYFORTIME = null
  },
  destroyed() {
    clearInterval(this.PAYFORTIME)
    this.PAYFORTIME = null
  },
  methods: {
    countime() {
      clearInterval(this.PAYFORTIME)
      this.PAYFORTIME = null
      if (window.__wxjs_environment === 'miniprogram') {
        var u = navigator.userAgent,
          app = navigator.appVersion
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
        console.log('计时器启动3')
        if (isIOS) {
          this.PAYFORTIME = setInterval(() => {
            let _num = localStorage.getItem('payforsuc')
            if (_num) {
              // alert('支付成功')
              // 微信小程序才会存在设置这个值
              localStorage.removeItem('payforsuc')
              // this.setToastMsg('支付成功')
              this.$emit('payforSuccess', 2)
              this.showToast = false
              return false
            }
          }, 1500)
        }
      }
    },
    delepass() {
      for (var i = this.passwordlist.length - 1; i > -1; i--) {
        if (this.passwordlist[i].show) {
          this.passwordlist[i].show = false
          this.passwordlist[i].value = ''
          break
        }
      }
    },
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    close() {
      this.showToast = false
    },
    closeAlert() {
      this.$emit('closeAlert')
    },
    gopayfor(type) {
      this.paytype = type
      let _enoughMoney = true
      //支付
      // this.showPassinput = true
      if (this.paytype === 'wallet') {
        //线上钱包
        if (this.payforallMoney > this.userWalletMoney) {
          _enoughMoney = false
          this.showPassinput = false
          //钱包余额不足 跳转充值页面
          this.$router.push(`/myaccountrecharge`)
        }
      } else {
        if (this.payforallMoney > this.showVipmoney) {
          _enoughMoney = false
          this.showPassinput = false
          //会员卡余额不足 跳槽充值页面
        }
      }
      //如果有足够余额
      if (_enoughMoney) {
        hasPaymentPassword(this.userToken).then(res => {
          this.setHasZFMM(res.haszfmm)
          if (res.haszfmm == true || res.haszfmm == 'true') {
            this.showPassinput = true
          } else {
            // 页面跳转 - 设置支付密码
            this.$router.push(`/setpassword`)
          }
        })
      }
    },
    //输入的密码有误回调这里
    passwordError() {
      this.showToast = false
      for (var i = this.passwordlist.length - 1; i > -1; i--) {
        this.passwordlist[i].show = false
        this.passwordlist[i].value = ''
      }
      // this.setToastMsg('密码有误')
    },
    //支付成功回调这里
    payforsuccess(str) {
      this.showPassinput = false
      this.showToast = false
      this.passwordError()
      if (!str) {
        this.$emit('closeAlert')
      }
    },
    forget() {
      // this.setFromPay(this.fromPay)
      this.$router.push(`/setpassword`)
      this.setForgetPwd(this.fromPay)
      // this.$emit('forgetPassword')
      // console.log('忘记密码')
    },
    plusReady() {
      // let self = this.channels
      //获取支付渠道
      plus.payment.getChannels(
        function(s) {
          for (var l in s) {
            let i = s[l]
            pays[i.id] = i
          }
        },
        function(e) {
          console.log('获取支付通道列表失败：' + e.message)
        }
      )
    },
    //会员卡， 线上钱包输入密码
    password(el) {
      let _has = true
      for (var i in this.passwordlist) {
        if (!this.passwordlist[i].show) {
          this.passwordlist[i].show = true
          this.passwordlist[i].value = el
          if (i == this.passwordlist.length - 1) {
            _has = false
          }
          break
        }
      }
      if (!_has) {
        let _pass = ''
        for (var i in this.passwordlist) {
          _pass += this.passwordlist[i].value
        }
        //线上钱包
        if (this.paytype === 'wallet') {
          //this.$emit('payforOther', 'wallet', _pass)
          if (this.comeType == 'offline') {
            //从线下商城进入pay组件
            this._cloud8Pay(_pass) //调用钱包接口
          } else {
            //从线上商城进入pay组件
            this._newCloud8Pay(_pass)
          }
        } else {
          //会员卡支付
          this.showToast = true
          //this.$emit('payforOther', 'vipcard', _pass)
        }
      }
    },
    _cloud8Pay(password) {
      // const self = this
      // this.showPassinput = false
      this.showToast = true
      //钱包支付
      cloud8Pay(
        this.userToken,
        this.orderNo,
        password,
        this.visitBookRetempId,
        this.userWalletId
      ).then(res => {
        if (res.success) {
          this.showPassinput = false
          this.showToast = false
          this.showFlag = false
          this.passwordError()
          this.$emit('payforSuccess')
        } else {
          this.showToast = false
          // this.setToastMsg('密码有误')
          this.setToastMsg(res.msg)
        }
      })
    },
    _newCloud8Pay(password) {
      // const self = this
      //线上商城进入
      // this.showPassinput = false
      this.showToast = true
      //钱包支付

      Newcloud8Pay(this.orderNo, password, this.userToken).then(res => {
        if (res.success) {
          this.showPassinput = false
          this.showFlag = false
          this.showToast = false
          this.passwordError()
          this.$emit('payforSuccess')
        } else {
          this.showToast = false
          // this.passwordError()
          this.setToastMsg(res.msg)
          // this.setToastMsg('密码有误')

          if (res.code == 1000 && !res.success) {
            // this.setToastMsg('拼团已满')
            this._startGroupBuy(() => {
              let _pass = ''
              for (var i in this.passwordlist) {
                _pass += this.passwordlist[i].value
              }
              if (this.comeType == 'offline') {
                this._cloud8Pay(_pass)
              } else {
                this._newCloud8Pay(_pass)
              }
            })
          }
        }
      })
    },
    payMoney(pid, Ptype) {
      if (this.programType !== 'H5App') {
        //如果当前环境不是H5
        if (window.__wxjs_environment === 'miniprogram') {
          setTimeout(() => {
            this.showToast = false
          }, 1200)
          //小程序支付
          var path =
            '/page/payforing/payforing?orderNo=' +
            this.orderNo +
            '&payfor=' +
            this.payfor +
            '&rechmoney=' +
            this.rechMoney +
            '&url=' +
            this.payforUrl +
            '&groupBuyTypeId=' +
            this.groupBuyTypeId
          //通过JSSDK的api使小程序跳转到指定的小程序页面
          wx.miniProgram.navigateTo({ url: path })
        } else {
          const self = this
          // 公共号支付
          this.wechatGetData(data => {
            if (data.success) {
              this.wechatGPay(data)
            } else {
              this._startGroupBuy(() => {
                this.wechatGetData(data => {
                  if (data.success) {
                    this.wechatGPay(data)
                  }
                })
              })
            }
          })
        }
      } else {
        let self = this
        let num = Ptype + 1
        this._unifiedPay((res, pay) => {
          if (res.success) {
            this.Apppayfor(pid, pay, num)
          } else {
            this._startGroupBuy(() => {
              this._unifiedPay((res, pay) => {
                this.Apppayfor(pid, pay, num)
              })
            })
          }
        })
      }
    },
    _startGroupBuy(cb) {
      startGroupBuy(this.groupBuyTypeId, this.userToken, this.orderNo).then(
        res => {
          if (res.success) {
            cb && cb()
          }
        }
      )
    },
    _unifiedPay(cb) {
      unifiedPay(
        this.payforUrl,
        this.userToken,
        this.orderNo,
        num,
        this.payfor,
        this.rechMoney,
        this.userWalletId,
        this.openid
      ).then(res => {
        let pay = res.pay
        cb && cb(res, pay)
      })
    },
    Apppayfor(pid, pay, num) {
      let self = this
      if (pid === 'wxpay') {
        pay = {
          appid: '' + pay.appId + '',
          noncestr: '' + pay.nonceStr + '',
          package: '' + pay.package + '',
          partnerid: '' + pay.partnerId + '',
          prepayid: '' + pay.prepayId + '',
          timestamp: Math.abs(pay.timeStamp),
          sign: '' + pay.sign + ''
        }
      }
      plus.payment.request(
        pays[pid],
        pay,
        function(result) {
          self.showPassinput = false
          self.showToast = false
          self.passwordError()
          // self.setToastMsg('支付成功')
          self.$emit('payforSuccess', num)
        },
        function(e) {
          switch (e.code) {
            case -1:
              plus.nativeUI.alert('支付失败，请重新安装微信')
              break
            case -2:
              plus.nativeUI.alert('支付失败，用户取消支付')
              break
            case -3:
              plus.nativeUI.alert('网络错误')
          }
          self.$emit('closeAlert')
        }
      )
    },
    wechatGetData(cb) {
      $.ajax({
        url: `${payforUrl}`,
        data: {
          orderNo: this.orderNo,
          payType: 4,
          openid: this.openid,
          payView: 3,
          token: this.userToken
        },
        dataType: 'json',
        type: 'post',
        success: function(data) {
          if (data.success) {
            cb && cb(data)
          }
        },
        error: function() {
          console.log('用户取消支付')
        }
      })
    },
    wechatGPay(data) {
      let self = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: data.pay.appId, //公众号名称，由商户传入
          timeStamp: data.pay.timeStamp + '', //时间戳，自 1970 年以来的秒数
          nonceStr: data.pay.nonceStr, //随机串
          package: data.pay.package, //商品包信息
          signType: data.pay.signType, //微信签名方式:
          paySign: data.pay.sign //微信签名
        },
        function(res) {
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            self.payforsuccess()
            // self.setToastMsg('支付成功')
            self.$emit('payforSuccess', 2)
            self.showToast = false
          } else {
            console.log(res)
            console.log(res.err_msg)
            self.setToastMsg('支付失败')
          }
        }
      )
    },
    ...mapMutations({
      setHasZFMM: 'SET_HAS_ZFMM',
      // setFromPay: 'SET_FROM_PAY',
      setForgetPwd: 'SET_FORGET_PWD'
    })
  }
}
</script>

<style type="text/sass" lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
@import "~common/sass/sprite"
.payingPopup
  padding: 18/$cale+rem 60/$cale+rem
  border-radius: 5/$cale+rem
  .paying
    font-size: 17/$cale+rem
.sx_icon
  transform: scale(0.5)
.bottomWrapper
  box-sizing: border-box
  position: absolute
  width: 100%
  background: rgba(0, 0, 0, 0.5)
  height: 100%
  bottom: 0px
  left: 0px
  right: 0px
  top: 0px
  z-index: 105
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
  &.fade-enter, &.fade-leave-to
    opacity: 0
  .dialog
    position: absolute
    right: 0
    bottom: 0
    left: 0
    // padding-bottom: 1rem
    background-color: #fff
    z-index: 21
    .order-title
      padding: 11/$cale+rem 15/$cale+rem
      background-color: $background-base
      .title
        line-height: 18/$cale+rem
        font-size: 13/$cale+rem
        color: $text_light
        padding-left: 8/$cale+rem
        border-left: 4/$cale+rem solid $mall-main
    .payment-list
      padding-left: 15/$cale+rem
      li
        position: relative
        padding: 16/$cale+rem 15/$cale+rem 16/$cale+rem 45/$cale+rem
        font-size: 15/$cale+rem
        line-height: 20/$cale+rem
        border-bottom: 1px solid $mall-border-base
        .payment-icon
          position: absolute
          top: 8.5/$cale+rem
          left: 0
        .icon-cardPay
          right: 10/$cale+rem
          width: 35/$cale+rem
          height: 35/$cale+rem
          background: url(./cardPay.png) no-repeat
          background-size: 100% 100%
        .icon-wallet
          right: 10/$cale+rem
          width: 35/$cale+rem
          height: 35/$cale+rem
          background: url(./icon-wallet.png) no-repeat
          background-size: 100% 100%
        .icon-wechat
          right: 10/$cale+rem
          width: 35/$cale+rem
          height: 35/$cale+rem
          background: url(./wxpay.png) no-repeat
          background-size: 100% 100%
        .icon-zfb
          right: 10/$cale+rem
          width: 35/$cale+rem
          height: 35/$cale+rem
          background: url(./alipay.png) no-repeat
          background-size: 100% 100%
        .icon-arrow-right
          display: inline-block
          float: right
          +bg-image('./arrow-right')
          background-size: 100% 100%
          +size(8/ $cale + rem,14/ $cale + rem)
          margin-top: 3/$cale+rem
          vertical-align: middle
  .numb_box
    position: fixed
    z-index: 20
    background: #f5f5f5
    width: 100%
    bottom: 0px
    left: 0px
    *
      box-sizing: border-box
    .xiaq_tb
      padding: 5/$cale+rem 0
      text-align: center
      border-top: 1/$cale+rem solid #ccc
    .nub_ggg
      border: 1/$cale+rem solid #dadada
      overflow: hidden
      border-bottom: none
      li
        width: 33.3333%
        border-bottom: 1/$cale+rem solid #ccc
        float: left
        text-align: center
        font-size: 22/$cale+rem
        a
          display: block
          color: #000
          height: 45/$cale+rem
          line-height: 45/$cale+rem
          overflow: hidden
          &.zj_x
            border-left: 1/$cale+rem solid #ccc
            border-right: 1/$cale+rem solid #ccc
        span
          display: block
          color: #e0e0e0
          background: #e0e0e0
          height: 45/$cale+rem
          overflow: hidden
          &.del
            // padding: 0.55rem 0
            img
              height: 23/$cale+rem
              margin-top: 11/$cale+rem
  .pwd_dialog
    background-color: rgba(0,0,0,.6)
    .dialog
      position: absolute
      bottom: 230/$cale+rem
      left: 10%
      width: 80%
      text-align: center
      background-color: #fff
      border-radius: 8/$cale+rem
      padding-bottom: 0
      .dialog_title
        border-bottom: 1/$cale+rem solid #ff8216
        line-height: 50/$cale+rem
        margin-bottom: 10/$cale+rem
        font-size: 18/$cale+rem
        color: $gray-dark
        font-weight: 500
        position: relative
        .close_dialog
          width: 40/$cale+rem
          height: 40/$cale+rem
          position: absolute
          top: 7/$cale+rem
          left: 0
        .forget-password
          position: absolute
          top: 50%
          right: 15/$cale+rem
          margin-top: -10/$cale+rem
          font-size: 14/$cale+rem
          color: #5bc2ef
          line-height: 20/$cale+rem
      .payment_style
        font-size: 18/$cale+rem
        line-height: 34/$cale+rem
        color: #333
      .price
        font-size: 44/$cale+rem
        display: block
        line-height: 1.5rem
      .pwdInput
        border-top: 1/$cale+rem solid #ececec
        padding: 10/$cale+rem 0
        margin: 0 15/$cale+rem
        .mm_box
          width: 100%
          height: 42/$cale+rem
          margin: 10/$cale+rem auto
          overflow: hidden
          border: 1px solid #ccc
          background-color: #fff
          display: flex
          li
            border-right: 1/$cale+rem solid #ececec
            height: 42/$cale+rem
            line-height: 42/$cale+rem
            flex: 1
            text-align: center
            float: left
            background: #fff
</style>
