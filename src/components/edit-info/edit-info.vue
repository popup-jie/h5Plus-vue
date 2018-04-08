<template>
  <div class="edit-info">
    <template v-if="infoFlag=='nickname'">
      <m-header title="用户昵称" :type="3" @back="back"></m-header>
      <div class="modify-info">
        <input type="text" placeholder="请输入昵称" class="input-box" v-model="nickName">
        <div class="save-btn" @click="save('nickname')" ref="nameSave">保存</div>
      </div>
    </template>

    <template v-if="infoFlag=='pay'">
      <m-header title="绑定支付宝" :type="3" @back="back"></m-header>
      <div class="modify-info">
        <input type="text" placeholder="请输入支付宝账户" class="input-box" v-model="alipay">
        <div class="save-btn">保存</div>
      </div>
    </template>

    <template v-if="infoFlag=='attest'">
      <m-header title="实名认证" :type="3" @back="back"></m-header>
      <div class="modify-info">
        <input type="text" placeholder="请输入您的姓名" class="input-box" v-model="name">
        <input type="text" placeholder="请输入您的身份证号" class="input-box" v-model="IDCode">
        <div class="save-btn">保存</div>
      </div>
    </template>

    <template v-if="infoFlag=='company'">
      <m-header title="公司信息" :type="3" @back="back"></m-header>
      <div class="modify-info">
        <input type="text" placeholder="请输入公司名称" class="input-box" v-model="companyName">
        <input type="text" placeholder="请输入职位名称" class="input-box" v-model="officeName">
        <div class="save-btn">保存</div>
      </div>
    </template>

    <template v-if="infoFlag=='email'">
      <m-header title="常用邮箱" :type="3" @back="back"></m-header>
      <div class="modify-info">
        <input type="text" placeholder="请输入您的常用邮箱" class="input-box" v-model="mailBox">
        <div class="save-btn">保存</div>
      </div>
    </template>

    <template v-if="infoFlag=='park'">
      <m-header title="所在园区" :type="3" @back="back"></m-header>
      <div class="city-park-info">
        <div class="city-park">
          <div class="city" @click="selectCity">
            <span>城市</span>
            <span class="address">{{address}}</span>
            <span class="city-right"></span>
          </div>
          <div class="park-box">
            <input class="park" type="text" placeholder="请输入具体园区名称" v-model="parkBox">
            <span class="star">*</span>
          </div>
        </div>
        <div class="save-btn city-save">保存</div>
      </div>

      <div class="mask" v-show="isShow">
        <address-picker @confirm="confirm" @close="close" @selectAddressFinish="selectAddressFinish" :addressPicker="addressPicker"></address-picker>
      </div>
    </template>

  </div>
</template>


<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import AddressPicker from 'components/address-picker/address-picker'
import { mapGetters } from 'vuex'
import { addClass, removeClass, hasClass} from 'common/js/dom.js'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      showType: ''
    }
  },
  computed: {
    showType() {
      return this.infoFlag
    },
    ...mapGetters([
      'infoFlag'
    ])
  },
  data() {
    return {
      nickName: '',//用户昵称
      alipay: '',//支付宝绑定
      name: '',//姓名
      IDCode: '',//身份证号
      companyName: '',//公司名称
      officeName: '',//职位名称
      mailBox: '',//邮箱
      address: '省市区',//园区选择省市区
      parkBox: '',//园区
      addressPicker: false,//省市区picker是否显示
      isShow: false,//picker背景弹窗是否显示
    }
  },
  watch: {
    nickName: function (val, oldval) {
      this.nameSave()
    },
  },  
  created () {
    this._shareDetail()
  },
  methods: {
    back() {
      this.$router.goBack()
      this.clearAll()
    },
    clearAll() {
      this.nickName = ''
      this.alipay = ''
      this.name = ''
      this.IDCode = ''
      this.companyName = ''
      this.officeName = ''
      this.mailBox = ''
      this.address = ''
      this.parkBox = ''
    },
    close() {
      this.isShow = false
    },
    confirm() {
      this.isShow = false
      this.selectAddressFinish()
    },
    selectAddressFinish(province, city, xian) {
      this.address = province + ' ' + city + ' ' + xian
    },
    selectCity() {
      this.addressPicker = true
      this.isShow = true
    },
    nameSave(){
      const el = this.$refs.nameSave
      if(this.nickName.length>0){
        addClass(el, 'active')
      }else{
        removeClass(el, 'active')
      }
    },
    save(type) {
      if (type == "nickname") {
        const el = this.$refs.nameSave
        if(hasClass(el,'active')){
          //调用接口
        }
      }
    }
  },
  components: {
    MHeader,
    AddressPicker
  }
}
</script>

<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"

.edit-info
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: #f1f1f1
  .modify-info
    margin: 15/$cale+rem
  .input-box
    width: 100%
    height: 40/$cale+rem
    border-radius: 5/$cale+rem
    padding-left: 15/$cale+rem
    font-size: 15/$cale+rem
  .input-box::-webkit-input-placeholder
    font-size: 14/$cale+rem 
    color: $gray-light
  .save-btn
    width: 100%
    color: $white
    font-size: 16/$cale+rem
    background: $bottom-btn-background-light 
    text-align: center
    height: 40/$cale+rem
    line-height: 40/$cale+rem
    border-radius: 5/$cale+rem
    margin-top: 20/$cale+rem
    &.active
      background: $bottom-btn-background-base
  .city-save
    margin: 20/$cale+rem 15/$cale+rem  
    width: 92%
  .city-park-info  
    .city-park  
      font-size: 15/$cale+rem
      width: 100%
      background: $white
    .city
      position: relative  
      color: $gray
      margin: 20/$cale+rem 0 0 15/$cale+rem
      height: 40/$cale+rem
      line-height: 40/$cale+rem
      border-bottom: 1px solid $mall-border-base
      .address
        color: $gray-dark
        margin-left: 10/$cale+rem
      .city-right
        +bg-image('./address-right-icon') 
        background-size: 100% 100%
        +extend-click() 
        width: 8/$cale+rem
        height: 13/$cale+rem
        position: absolute
        right: 15/$cale+rem
        top: 50%
        -webkit-transform: translate(0, -50%)
    .park-box
      position: relative     
      .park
        height: 40/$cale+rem
        line-height: 40/$cale+rem 
        padding-left: 15/$cale+rem
      .park::-webkit-input-placeholder
        color: $gray-light
      .star
        color: $mall-main
        position: absolute 
        right: 15/$cale+rem
        top: 50%
        -webkit-transform: translate(0, -50%) 
  .mask
    position: absolute
    width: 100%
    background: rgba(0, 0, 0, 0.5)
    height: 100%
    bottom: 0
    left: 0
    right: 0
    top: 0
    z-index: 105
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0 
</style>  