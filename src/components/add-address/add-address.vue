<template>
  <div class="add-address">
    <m-header title="新增收货地址" :type="3" @back="back"></m-header>
    <div ref="addWrapper">
      <div class="add-content">
        <form class="add-list">
          <input type="text" placeholder="收货人姓名" minlength="2" maxlength="15" v-model="name">
          <input type="mobile" placeholder="手机号码" maxlength="11" v-model="mobile">
          <div class="address-picker" @click="selectCity">
            <span>{{selectedText}}</span>
            <i class="address-icon-right"></i>
          </div>
          <!-- <input type="text" placeholder="街道" v-model="streetText" class="input-picker"> -->
          <!-- <input type="text" placeholder="邮政编码" maxlength="6" v-model="postalCode"> -->
          <textarea placeholder="详细地址" class="detail-address" minlength="5" maxlength="60" v-model="detailAddress"></textarea>
        </form>
      </div>
      <div class="default-address" @click="setDefault">
        <span class="selected-icon" ref="defaultBtn"></span>
        <span class="default-text">设为默认地址</span>
      </div>
    </div>
    <div class="bottom-btn" v-show="btnShow" @click="saveAddress" ref='saveBtn'>保存</div>
    <city-picker @select="handleSelect(arguments)" :data="datas" :selected-index="selectedIndex" ref="picker"></city-picker>

    <alert ref="alert" :text="popupToast"></alert>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Alert from 'base/alert/alert'
import { hasClass, addClass, removeClass, toggleClass } from 'common/js/dom'
import CityPicker from 'components/city-picker/city-picker'
import { initFunc } from 'common/js/addressData'
import { addOrUpdateUserAddress } from 'api/address'
import { mapGetters } from 'vuex'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  computed: {
    ...mapGetters([
      'userToken'
    ])
  },
  data() {
    return {
      name: '',//收货人姓名
      mobile: '',//手机号码
      // postalCode: '',//邮政编码
      detailAddress: '',//详细地址
      btnShow: true,//底部按钮是否显示
      popupToast: '',//弹窗提示
      datas: [], //传给city-picker的地区数据
      isShow: false, //picker背景弹窗是否显示
      selectedIndex: [0, 0, 0],
      selectedText: '省、市、区',
      // streetText: '', //街道地址 文本显示
      provinceId: null,//省的id
      cityId: null,//市的id
      areaId: null,//区的id
      provinceName: '',//省的名字
      cityName: '',//市的名字
      areaName: '',//区的名字
      isDefault: 0, //是否是默认地址(0,是;1,不是)
      addressId: '',//该条地址的id
      fromPage: '',//从哪个页面进入 confirmOrder:从确认订单进入
    }
  },
  mounted() {
    // const oldHeight = document.body.clientHeight
    var oldHeight = window.innerHeight
    window.addEventListener('resize', () => {
      // console.log('键盘出现')
      var newHeight = window.innerHeight
      this.btnShow = newHeight < oldHeight ? false : true
    })
  },
  activated() {
    document.title = '新增收货地址'
    this._shareDetail()
    this.fromPage = this.$route.params.fromPage
    this.$nextTick(() => {
      this._initPage(this.$refs.addWrapper)
    })
  },
  created() {
    initFunc().then(res => {
      this.datas = res
    })
  },
  methods: {
    back() {
      this.clearAll()
      if (this.fromPage == 'confirmOrder') {//从订单页面进入
        this.$router.push(`/confirmorder`)
        console.log('返回订单页')
      } else if (this.fromPage == 'confirmOrderBy') {//订单页面-管理地址-添加地址
        this.$router.push({
          name: 'manageaddress',
          params: {
            fromPage: 'confirmOrderBy',
          }
        })
      } else {
        this.$router.goBack()
      }
    },
    backPage() {
      if (this.fromPage == 'confirmOrder') {//从订单页面进入
        let manageParams = {
          id: this.addressId,
          receiver: this.name,
          phoneNo: this.mobile,
          provinceId: this.provinceId,
          provinceName: this.provinceName,
          cityId: this.cityId,
          cityName: this.cityName,
          areaId: this.areaId,
          areaName: this.areaName,
          detailAddress: this.detailAddress
        }
        //localStorage.setItem('manageAddressParams', JSON.stringify(manageParams))
        this.$router.push(`/confirmorder`)
      } else if (this.fromPage == 'confirmOrderBy') {//订单页面-管理地址-添加地址
        this.$router.push({
          name: 'manageaddress',
          params: {
            fromPage: 'confirmOrderBy',
          }
        })
      } else {
        this.$router.goBack()
      }
    },
    clearAll() {
      this.name = ''
      this.mobile = ''
      this.selectedText = ''
      // this.streetText = ''
      // this.postalCode = ''
      this.detailAddress = ''
      const el = this.$refs.defaultBtn
      if (hasClass(el, 'selected-icon')) {
        removeClass(el, 'selected-icon')
      }
    },
    setDefault() {
      const el = this.$refs.defaultBtn
      toggleClass(el, 'noselected-icon')
      //看是否选中
      if (hasClass(el, 'noselected-icon')) {
        this.isDefault = 1
      } else {
        this.isDefault = 0
      }
      console.log(this.isDefault)
    },
    saveBtnColor() {//按钮颜色显示
      const el = this.$refs.saveBtn
      if (this.name.length < 2 || this.name.length > 15) {
        removeClass(el, 'active')
      } else if (this.mobile.length == 0) {
        removeClass(el, 'active')
        //  || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile))
      } else if (this.mobile.length != 11) {
        removeClass(el, 'active')
      } else if (this.selectedText == '') {
        removeClass(el, 'active')
      }
      // else if (this.streetText == '') {
      //   removeClass(el, 'active')
      // } 
      else if (this.detailAddress.length < 5 || this.detailAddress.length > 60) {
        removeClass(el, 'active')
      } else {
        addClass(el, 'active')
      }
      // if (
      //   (2 <= this.name.length <= 15)
      //   && ((this.mobile.length === 11)
      //   && (/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile)))
      //   && (this.selectedText.length > 0)
      //   && (this.streetText.length > 0)
      //   && (5 <= this.detailAddress.length <= 60)
      // ) {
      //   addClass(el, 'active')
      // } else {
      //   removeClass(el, 'active')
      // }
    },
    saveAddress() {//保存按钮
      if (this.name.length < 2 || this.name.length > 15) {
        this.popupToast = '收货人姓名: 2-15个字符限制'
        this.$refs.alert.show()
      } else if (this.mobile.length == 0) {
        this.popupToast = '请输入手机号码'
        this.$refs.alert.show()
        //  || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobile))
      } else if (this.mobile.length != 11) {
        this.popupToast = '请输入正确的手机号码'
        this.$refs.alert.show()
      } else if (this.selectedText == '') {
        this.popupToast = '请选择省市区'
        this.$refs.alert.show()
      }
      // else if (this.streetText == '') {
      //   this.popupToast = '请填写街道'
      //   this.$refs.alert.show()
      // } 
      else if (this.detailAddress.length < 5 || this.detailAddress.length > 60) {
        this.popupToast = '收货人地址最少5个字，最多不能超过60个字'
        this.$refs.alert.show()
      } else {//调用接口
        const el = this.$refs.saveBtn
        if (hasClass(el, 'active')) {
          // for (var i = 0; i < 10; i++) {
          this._addOrUpdateUserAddress()
          // }
        }
      }
    },
    _addOrUpdateUserAddress() {
      addOrUpdateUserAddress(
        this.userToken,
        this.addressId,
        this.name,
        this.mobile,
        this.provinceId,
        this.provinceName,
        this.cityId,
        this.cityName,
        this.areaId,
        this.areaName,
        this.detailAddress,
        this.isDefault
      ).then(res => {
        if (res.success) {
          this.backPage()
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    selectCity() {
      this.$refs.picker.show()
    },
    handleSelect(args) {
      let idArr = args[3].map((value, index, arr) => {
        return value
      })
      this.provinceId = idArr[0]
      this.cityId = idArr[1]
      this.areaId = idArr[2]

      let nameArr = args[2].map((value, index, arr) => {
        return value
      })
      this.provinceName = nameArr[0]
      this.cityName = nameArr[1]
      this.areaName = nameArr[2]
      this.selectedText = nameArr.join(' ')
    }
  },
  watch: {
    name: function () {
      this.saveBtnColor()
    },
    mobile: function () {
      this.saveBtnColor()
    },
    selectedText: function () {
      this.saveBtnColor()
    },
    detailAddress: function () {
      this.saveBtnColor()
    },

  },
  components: {
    MHeader,
    CityPicker,
    Alert
  }
}
</script>


<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.add-address
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  font-size: 14/$cale+rem
  .add-content
    background-color: $white
    padding: 0 15/$cale+rem
    color: $gray-dark
    margin-top: 2/$cale+rem
    input
      width: 100%
      border-bottom: 1px solid $background-base
      text-align: left
      height: 44/$cale+rem
    input::-webkit-input-placeholder,.detail-address::-webkit-input-placeholder
      color: $gray-light
    .detail-address
      width: 100%
      border-color: transparent  
      height: 77/$cale+rem
      margin-top: 12/$cale+rem
      font-size: 14/$cale+rem
    .address-picker
      position: relative 
      width: 100%
      border-bottom: 1px solid $background-base
      text-align: left
      height: 44/$cale+rem
      line-height: 44/$cale+rem
      .input-picker
        letter-spacing: 1/$cale+rem 
      .input-picker::-webkit-input-placeholder
        color: $gray-dark    
    .address-icon-right
      display: inline-block
      +bg-image('./address-right-icon')  
      width: 5/$cale+rem
      height: 9/$cale+rem
      background-size: 100% 100%
      top: 0
      right: 0
      +extend-click() 
      position: absolute
      margin-top: 18/$cale+rem
      margin-right: 5/$cale+rem
  .default-address
    position: relative
    background: $white
    margin-top: 10/$cale+rem    
    padding-left: 15/$cale+rem
    color: $gray-dark
    height: 44/$cale+rem
    line-height: 44/$cale+rem
  .selected-icon  
    +bg-image('./selected-icon')
    display: inline-block
    +size(18/$cale+rem)
    background-size: 100% 100%
    position: absolute
    top: 12/$cale+rem 
    &.noselected-icon
      +bg-image('./noselected-icon') 
  .default-text
    padding-left: 22/$cale+rem  
  .bottom-btn
    position: fixed
    bottom: 0
    width: 100%
    height: 44/$cale+rem
    line-height: 44/$cale+rem  
    background: $bottom-btn-background-light  
    color: $white
    text-align: center
    font-size: 14 /$cale+rem   
    &.active
      background: $bottom-btn-background-base
  .finish-picker
    background: $white
    height: 38/$cale+rem
    line-height: 38/$cale+rem
    color: $gray-dark
    font-size: 14/$cale+rem 
    padding-left: 87%
    border-top: 1/$cale+rem solid rgba(235, 235, 235, 0.5)

</style>    
