<template>
  <div class="account-safe">
    <m-header title="账户安全" :type="3" @back="back"></m-header>

    <div class="operate" ref="operate">
      <ul>
        <li class="operate_item" @click="setPassword(1)">
          <i class="icon-left icon-left-modify"></i>
          <div class="content">
            <span class="text">修改支付密码</span>
            <span class="icon-right"></span>
          </div>
        </li>
        <li class="operate_item" @click="setPassword(2)">
          <i class="icon-left icon-left-getback"></i>
          <div class="content">
            <span class="text">找回支付密码</span>
            <span class="icon-right"></span>
          </div>
        </li>

      </ul>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { mapGetters, mapMutations } from 'vuex'
import { hasPaymentPassword } from 'api/userCenter'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      forgetPwd: true,//是否点击找回密码
    }
  },
  computed: {
    haszfmm() {
      return this.haszfmm
    },
    ...mapGetters(['userToken', 'haszfmm'])
  },
  created() {
    document.title = '账户安全'
    this._shareDetail()
    this.$nextTick(() => {
      this._initPage(this.$refs.operate)
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    setPassword(type) {
      if (type == 1) {//修改密码
        this._hasPaymentPassword()
        this.$router.push(`/setpassword`)

      } else {//找回密码
        this._hasPaymentPassword()
        this.setForgetPwd(this.forgetPwd)
        this.$router.push(`/setpassword`)
      }
    },
    _hasPaymentPassword() {
      //用户是否设置密码
      hasPaymentPassword(this.userToken).then(res => {
        if (res.success) {
          this.setHasZFMM(res.haszfmm)
        }
      })
    },

    ...mapMutations({
      setHasZFMM: 'SET_HAS_ZFMM',
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

.account-safe
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  .operate
    margin-top: 10/$cale+rem
    i,span
      display: inline-block
    .operate_item
      display: flex
      font-size: 16/$cale+rem
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
      .icon-left-modify
        +bg-image('./icon_modify')   
      .icon-left-getback
        +bg-image('./icon_getback') 
      .content
        flex: 1
        border-bottom: 1px solid $gray-lighter
        padding: 10/$cale+rem 15/$cale+rem 10/$cale+rem 0
        margin-left: 30/$cale+rem
        .text
          line-height: 25/$cale+rem
          color: $text_color
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