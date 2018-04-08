<template>
  <div class="my-info">
    <m-header title="我的信息" :type="3" @back="back"></m-header>
    <div class="info-wrapper">
      <!-- 头像昵称 -->
      <ul class="userInfo-list">
        <li class="userInfo-item userInfo-img">
          <span class="label-title">头像</span>
          <template>
            <img v-lazy="photoAddress" class="info-avatar">
          </template>
          <span class="arrow"></span>
        </li>
        <li class="userInfo-item" @click="nameInfo">
          <span class="label-title">用户昵称</span>
          <template>
            <span class="label-txt">{{userInfo.nickName}}</span>
          </template>
          <!-- <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template> -->
          <span class="arrow"></span>
        </li>
        <li class="userInfo-item" @click="selectSex">
          <span class="label-title">性别</span>
          <template>
            <span class="label-txt">{{sexFormat}}</span>
          </template>
          <!-- <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template> -->
          <span class="arrow"></span>
        </li>
        <li class="userInfo-item">
          <span class="label-title">手机号</span>
          <template>
            <!-- .substr(0,3)+ "****" +phone.substr(7) -->
            <span class="label-txt phone-txt">{{phone}}</span>
          </template>
        </li>
      </ul>
      <!-- 公司园区 -->
      <!-- <ul class="userInfo-list">
        <li class="userInfo-item" @click="companyInfo">
          <span class="label-title">公司信息</span>
          <template>
            <span class="label-txt">未填写</span>
          </template>
          <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template>
          <span class="arrow"></span>
        </li>
        <li class="userInfo-item" @click="parkInfo">
          <span class="label-title">所在园区</span>
          <template>
            <span class="label-txt">未填写</span>
          </template>
          <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template>
          <span class="arrow"></span>
        </li>
        <li class="userInfo-item">
          <span class="label-title">手机号</span>
          <template>
            .substr(0,3)+ "****" +phone.substr(7)
            <span class="label-txt phone-txt">{{phone}}</span>
          </template>
        </li>
      </ul> -->

      <!-- 手机号。。。 -->
      <!--
      <ul class="userInfo-list">
         <li class="userInfo-item" @click="emailInfo">
          <span class="label-title">联系邮箱</span>
          <template>
            <span class="label-txt">未填写</span>
          </template>
          <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template>
          <span class="arrow"></span>
        </li> 
         <li class="userInfo-item">
          <span class="label-title">手机号</span>
          <template>
            <span class="label-txt">15397919032</span>
          </template> 
           <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template> 
          <span class="arrow"></span> 
        </li> 
       <li class="userInfo-item"  @click="payInfo">
          <span class="label-title">支付宝账户</span>
          <template>
            <span class="label-txt inputClass">绑定</span>
          </template>
          <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template> 
          <span class="arrow"></span>
        </li> 
        <li class="userInfo-item" @click="attestInfo">
          <span class="label-title">实名认证</span>
          <template>
            <span class="label-txt inputClass">未认证</span>
          </template>
          <template v-else>
            <span class="label-txt inputClass">请添加出生日期</span>
          </template>
          <span class="arrow"></span>
        </li> 
      </ul>
    -->
    </div>
    <picker ref="sexPicker" :data="[sexArray]" title="性别" @select="handleSelectSex(arguments)"></picker>

  </div>
</template>


<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { mapGetters, mapMutations } from 'vuex'
import { queryInfoByToken } from 'api/userCenter'
import Picker from 'base/picker/picker'
import {share} from 'common/js/mixin'
export default {
  mixins: [share],
  data() {
    return {
      showType: '',
      userInfo: {},
      photoAddress: '',
      sexArray: [
        {
          text: '男',
          value: 1
        },
        {
          text: '女',
          value: 2
        }
      ], //性别数组
    }
  },
  computed: {
    sexFormat() {
      var resultSex = ''
      switch (this.userInfo.sex) {
        case '1':
          resultSex = '男'
          break
        case '2':
          resultSex = '女'
          break
      }
      return resultSex
    },
    intSex() {
      return parseInt(this.userInfo.sex)
    },
    phone() {
      return (this.userInfo.mobile.substr(0, 3) + "****" + this.userInfo.mobile.substr(7))
      // return this.userInfo.mobile
    },
    ...mapGetters([
      'userToken'
    ])
  },
  created() {
    document.title = '我的信息'
    this._shareDetail()
    this._queryInfoByToken()
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    editInfo() {
      this.$router.push(`/editinfo`)
      this.setInfoFlag(this.showType)
    },
    nameInfo() {
      this.showType = 'nickname'
      this.editInfo()
    },
    companyInfo() {
      this.showType = 'company'
      this.editInfo()
    },

    parkInfo() {
      this.showType = 'park'
      this.editInfo()
    },
    _queryInfoByToken() {
      queryInfoByToken(this.userToken).then(res => {
        if (res.success) {
          this.userInfo = res.info
          this.photoAddress = res.photoAddress + res.info.avatar
          // this.setUserAvatar(res.avatar)
        }
      })
    },
    selectSex() {
      this.$refs.sexPicker.show()
      this.$nextTick(() => {
        this.$refs.sexPicker.scrollTo(0, this.intSex)
      })
    },
    handleSelectSex(args) {
      this.userInfo.sex = args[1].toString()
      this.updateUserInfo.sex = args[1].toString()
    },
    ...mapMutations({
      setInfoFlag: 'SET_INFO_FLAG'
    })
    /* 
      payInfo() {
        this.showType = 'pay'
        this.editInfo()
      },
      attestInfo(){
        this.showType = 'attest'
        this.editInfo()
      },
      emailInfo(){
        this.showType = 'email'
        this.editInfo()
      },
    */
  },
  components: {
    MHeader,
    Picker
  }
}
</script>

<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"

.my-info
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  .info-wrapper
    .userInfo-list
      overflow: hidden
      background: $white
      padding-left: 15/$cale+rem
      margin-top: 10/$cale+rem
      .userInfo-item
        position: relative
        display: flex
        padding: 12/$cale+rem 0
        font-size: 0
        line-height: 20/$cale+rem
        +border-1px($gray-lighter)
        .label-title
          color: $text_color
          font-size: 15/$cale+rem
        .info-avatar
          +size(40/$cale+rem)  
          position: absolute
          right: 35/$cale+rem
          top: 5/$cale+rem
          bottom: 5/$cale+rem
        .label-txt
          color: $text_lighter
          font-size: 12/$cale+rem
          padding-right: 10/$cale+rem
          display: inline-block
          max-width: 65%
          text-overflow: ellipsis
          white-space: nowrap
          overflow: hidden
          position: absolute
          right: 25/$cale+rem
          &.inputClass
            color: $mall-main
        .phone-txt
          padding-right: 0 
          margin-right: -10/$cale+rem
        .arrow
          +bg-image('./address-right-icon') 
          background-size: 100% 100%
          +extend-click() 
          width: 8/$cale+rem
          height: 13/$cale+rem
          position: absolute
          right: 15/$cale+rem
          top: 50%
          -webkit-transform: translate(0, -50%)
      .userInfo-img   
        height: 51/$cale+rem
        line-height: 28/$cale+rem 
</style>  