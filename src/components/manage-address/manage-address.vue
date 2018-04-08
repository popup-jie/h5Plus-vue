<template>
  <div class="manage-address">
    <m-header title="管理收货地址" :type="3" @back="back"></m-header>
    <div class="addressList" ref='addressList'>
      <div>
        <ul class="address-list defaultList">
          <li class="address-content" @click="confirmOrder(item)" v-for="(item,index) in addressList" :key="index">
            <div class="name-mobile">
              <p class="name">{{item.receiver}}</p>
              <p class="mobile">{{item.phoneNo}}</p>
            </div>

            <div class="detail-address">{{item.provinceName+item.cityName+item.areaName+item.detailAddress}}</div>

            <div class="option">
              <div class="default-address" @click.prevent.stop="setDefault(item.id,item.isDefault,index)">
                <span class="noselected-icon" ref="defaultBtn" :class="[item.isDefault==0?'selected-icon':'noselected-icon']"></span>
                <span class="default-text">{{defaultText}}</span>
              </div>

              <div class="box">
                <span class="edit" @click.prevent.stop="editAddress(item)">编辑</span>
                <span class="del" @click.prevent.stop="deleteAddress(item.id,item.isDefault,index)">删除</span>
              </div>
            </div>
          </li>
        </ul>

        <!-- <div class="space"></div> -->
      </div>
    </div>
    <div class="no-address" v-if="addressList.length==0">暂无收货地址哦~</div>
    <div class="bottom-btn" @click="addAddress">新增收货地址</div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import { hasClass, addClass, removeClass, toggleClass } from 'common/js/dom'
import {
  getUserAddressList,
  updateAddressDefault,
  deleteUserAddressById
} from 'api/address'
import { mapGetters } from 'vuex'
import { initPage, setToastMsg, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      addressList: [], //地址列表
      defaultText: '设为默认地址', //文本显示
      fromPage: '',//从哪个页面进入 confirmOrder:从确认订单进入
    }
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  created() {
    document.title = '管理收货地址'
    this._shareDetail()
    this._getUserAddressList()
    this._initscroll()
    this.fromPage = this.$route.params.fromPage
    this.$nextTick(() => {
      this._initPage(this.$refs.addressList, 'close')
    })
  },
  methods: {
    className(index, item) {
      if (item.isDefault === 0) {
        return 'position'
      } else {
        if (index === 0) {
          return 'marginTop'
        }
      }
      return ''
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.addressList, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back() {
      if (this.fromPage == 'confirmOrderBy') {
        this.$router.replace(`/confirmorder`)
      } else {
        this.$router.replace(`/user`)
        if (window.plus) {
          var ws = plus.webview.currentWebview()
          ws.hide('slide-out-left')
        }
      }
    },
    addAddress() {
      if (this.fromPage == 'confirmOrderBy') {
        this.$router.push({
          name: 'addaddress',
          params: {
            fromPage: 'confirmOrderBy',
          }
        })
      } else {
        this.$router.push(`/addaddress`)
      }

    },
    setDefault(id, isDefault, index) {
      const el = this.$refs.defaultBtn[index]
      for (var i = 0; i < this.$refs.defaultBtn.length; i++) {
        removeClass(this.$refs.defaultBtn[i], 'selected-icon')
        this.addressList[i].isDefault = 1
      }
      this.addressList[index].isDefault = 0
      addClass(el, 'selected-icon')
      // 调用设为默认地址接口
      if (hasClass('selected-icon')) {
        this._updateAddressDefault(id, 0)
      }
    },
    editAddress(item) {
      //传入编辑页面参数
      let manageParams = {
        id: item.id,
        receiver: item.receiver,
        phoneNo: item.phoneNo,
        provinceId: item.provinceId,
        provinceName: item.provinceName,
        cityId: item.cityId,
        cityName: item.cityName,
        areaId: item.areaId,
        areaName: item.areaName,
        detailAddress: item.detailAddress,
        isDefault: item.isDefault,
        fromPage: this.fromPage
      }
      localStorage.setItem('manageParamsNoOrder', JSON.stringify(manageParams))
      this.$router.push('/editaddress')
    },
    confirmOrder(item) {
      console.log('this.fromPage=' + this.fromPage)
      if (this.fromPage == 'confirmOrderBy') {
        let manageParams = {
          id: item.id,
          receiver: item.receiver,
          phoneNo: item.phoneNo,
          provinceId: item.provinceId,
          provinceName: item.provinceName,
          cityId: item.cityId,
          cityName: item.cityName,
          areaId: item.areaId,
          areaName: item.areaName,
          detailAddress: item.detailAddress
        }
        localStorage.setItem('manageAddressParams', JSON.stringify(manageParams))
        this.$router.push('/confirmorder')
      }
    },
    deleteAddress(id, isDefault, index) {
      deleteUserAddressById(id).then(res => {
        if (res.success) {
          this.setToastMsg('删除成功')


          let manageAddressParams = JSON.parse(
            localStorage.getItem('manageAddressParams')
          )
          if (manageAddressParams != null) {
            if (manageAddressParams.id == id) {
              localStorage.removeItem('manageAddressParams')
            }
          }

          this.addressList.splice(index, 1)
          console.log(index)
          if (hasClass(this.$refs.defaultBtn[index], 'selected-icon')) {
            removeClass(this.$refs.defaultBtn[index], 'selected-icon')
            this._updateAddressDefault(this.addressList[0].id, 0)
            this.$nextTick(() => {
              addClass(this.$refs.defaultBtn[0], 'selected-icon')
            })
          }
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _getUserAddressList() {
      //获取列表数据
      getUserAddressList(this.userToken).then(res => {
        this.addressList = this._formatDatalist(res.data)
        if (res.data.length <= 1) {//只有一条数据时，强制设为默认地址
          if (res.data[0].isDefault === 1) {//不是默认地址时
            this._updateAddressDefault(this.addressList[0].id, 0)
            this.$nextTick(() => {
              addClass(this.$refs.defaultBtn[0], 'selected-icon')
            })
          }
        }
      })
    },
    //重组
    _formatDatalist(list) {
      let _arr = list.slice()
      let _newArr = []
      for (let i = 0; i < _arr.length; i++) {
        if (_arr[i].isDefault === 0) {
          // if (_newArr.length === 0) {
          //   _newArr.push(_arr[i])
          // } else {
          _newArr.splice(0, 0, _arr[i])
          // }
        } else {
          _newArr.push(_arr[i])
        }
      }
      return _newArr
    },
    _updateAddressDefault(id, isDefault) {
      //设为默认地址
      updateAddressDefault(id, isDefault).then(res => {
        if (res.success) {
          this.setToastMsg('设置成功')
          // this._getUserAddressList()
        } else {
          this.setToastMsg(res.msg)
        }
      })
    }
  },
  components: {
    MHeader
  }
}
</script>


<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.manage-address
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $background-base
  color: $gray-dark
  .addressList
    overflow: hidden
    position: fixed
    top: 44/$cale+rem
    bottom: 44/$cale+rem
    width: 100%
    padding-bottom: 44/$cale+rem
  .defaultList
    // position: fixed
    // top: 44px
  .address-list
    position: relative
    .address-content
      background: $white
      padding: 12/$cale+rem 15/$cale+rem 0
      font-size: 12/$cale+rem
      margin-bottom: 10/$cale+rem
    .address-content:last-child
      margin-bottom: 0   
    .name-mobile,.option
      display: flex
      flex-direction: row
      justify-content: space-between
    .name-mobile
      font-size: 14/$cale+rem
    .detail-address
      margin-top: 9/$cale+rem
      padding-bottom: 12/$cale+rem
      border-bottom: 1px solid $mall-border-base
      line-height: 17/$cale+rem 
    .option
      margin-top: 12/$cale+rem 
      .default-address
        position: relative  
        .noselected-icon  
          +bg-image('./noselected-icon')
          display: inline-block
          +size(18/$cale+rem)
          background-size: 100% 100%
          position: absolute
          top: -3/$cale+rem 
          &.selected-icon
            +bg-image('./selected-icon') 
        .selected-icon
          display: inline-block
          +size(18/$cale+rem)
          background-size: 100% 100%
          position: absolute
          top: -3/$cale+rem 
          +bg-image('./selected-icon')      
        .default-text
          padding-left: 28/$cale+rem
    .box
      margin-top: 2/$cale+rem
      padding-bottom: 13/$cale+rem
      .edit,.del
        border: 1px solid $mall-border-base
        padding: 2/$cale+rem 11/$cale+rem
      .del 
        margin-left: 8/$cale+rem 
  .space
    height: 10/$cale+rem 
    background: $background-base      
  .bottom-btn
    position: fixed
    bottom: 0
    width: 100%
    height: 44/$cale+rem
    line-height: 44/$cale+rem    
    background: $bottom-btn-background-base
    color: $white
    text-align: center
    font-size: 14/$cale+rem
.position
  position: absolute
  top: 0
  width: 100%
.no-address
  font-size: 16/$cale+rem
  color: $gray-light
  position: fixed
  top: 50%
  left: 50%
  -webkit-transform: translate(-50% , -50%)
</style>    
