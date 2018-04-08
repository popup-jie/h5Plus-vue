<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { getUrlAttribute } from 'common/js/tools'
import { queryUserInfoByWxUnionid, queryInfoByToken } from 'api/userCenter'
export default {
  created() {
    //如果微网站进入本项目，需要传入openid
    let _programType =
      getUrlAttribute(window.location.href, 'programType') || 'microweb' //进入程序类型

    let _target = getUrlAttribute(window.location.href, 'target') || '' //跳转目标
    let _usertoken = getUrlAttribute(window.location.href, 'usertoken') || '' //用户token
    let _payfor = getUrlAttribute(window.location.href, 'payfor') || '' //支付方式
    let _openId = getUrlAttribute(window.location.href, 'openid') || '' //微信openid
    let _userInfoId = getUrlAttribute(window.location.href, 'userInfoId') || '' //用户id

    let _referralCode =
      getUrlAttribute(window.location.href, 'referralCode') || '' //邀请码

    let _wxunionid = getUrlAttribute(window.location.href, 'wxunionid') || '' // 微信unid
    let _goodsid = getUrlAttribute(window.location.href, 'goodsid') || '' // 物品id
    let _mobile = getUrlAttribute(window.location.href, 'mobile') || ''

    let _avatar = getUrlAttribute(window.location.href, 'avatar') || '' //头像
    let _nickName = getUrlAttribute(window.location.href, 'nickname') || '' //昵称

    _programType = _programType.split('#')[0]
    _target = _target.split('#')[0]
    _usertoken = _usertoken.split('#')[0]
    _payfor = _payfor.split('#')[0]
    _openId = _openId.split('#')[0]
    _userInfoId = _userInfoId.split('#')[0]
    _referralCode = _referralCode.split('#')[0]
    _wxunionid = _wxunionid.split('#')[0]
    _goodsid = _goodsid.split('#')[0]
    _mobile = _mobile.split('#')[0]
    _avatar = _avatar.split('#')[0]
    _nickName = _nickName.split('#')[0]
    _nickName = decodeURI(_nickName)

    // if ((!_wxunionid || _wxunionid == 'null') && _programType === 'microweb') {
    //   location.href =
    //     'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI2Njc0NzYyOA==&scene=124#wechat_redirect'
    //   return false
    // }

    if (_programType === 'microweb') {
      // 如果程序入口等于 微网站则 不显示页头 显示页脚
      this.setProgramType(_programType)
      this.setHiddenHTab(true)
      this.setHiddenFTab(false)
    } else if (_programType === 'wechat') {
      // 如果程序入口等于 小程序则 不显示页头 不显示页脚
      this.setProgramType(_programType)
      this.setHiddenHTab(true)
      this.setHiddenFTab(true)
    } else if (_programType === 'H5App') {
      // 如果程序入口等于 菁葶H5APP 则 显示页头 不显示页脚
      this.setProgramType(_programType)
      this.setHiddenHTab(false)
      this.setHiddenFTab(true)
    }

    if (_userInfoId) {
      this.setUserId(_userInfoId)
    }

    if (_wxunionid) {
      this.setWxunionid(_wxunionid)
    }

    if (_referralCode) {
      this.setReferralCode(_referralCode)
    }
    if (_usertoken) {
      localStorage.setItem('JINGWEBUSERTOKEN', _usertoken)
      // this.setUserToken(_usertoken)
    } else {
      // localStorage.removeItem('USERTOKEN')
    }
    if (_avatar) {
      this.setuseravatar(_avatar)
    }
    if (_nickName) {
      this.setusernickname(_nickName)
    }
    if (_usertoken && _programType != 'wechat') {
      //传进来的用户token 且同时不属于小程序
      queryInfoByToken(_usertoken).then(res => {
        // localStorage.setItem('JINGWEBUSERTOKEN', res.token)
        // this.setUserToken(res.info.token)
        this.setUserId(res.info.userId)

        this.setMobile(res.info.mobile)
        if (res.info.jingtingGrade) {
          this.setSuperVip(true)
        }
      })
    }

    if (_target != 'activation' && _wxunionid) {
      //当前路径不是 激活页面  且 存在wxunid
      queryUserInfoByWxUnionid(_wxunionid).then(res => {
        localStorage.setItem('JINGWEBUSERTOKEN', res.token)
        if (res.jingtingMemberGradeId) {
          this.setSuperVip(true)
        }
        this.setUserToken(res.token)
        this.setUserId(res.id)
        this.setMobile(res.mobile || '')
      })
    }

    if (_mobile != undefined && _mobile != '' && _mobile != 'undefined') {
      this.setMobile(_mobile)
    }
    if (localStorage.getItem('JINGWEBUSERTOKEN')) {
      let a = localStorage.getItem('JINGWEBUSERTOKEN')
      this.setUserToken(a)
    }
    if (_goodsid) {
      //物品id
      this.setgoodid(_goodsid)
    }
    if (_openId) {
      //传进来的openid
      this.setOpenid(_openId)
    }
    if (_payfor) {
      //小程序回调
      localStorage.setItem('payforsuc', _payfor)
      this.setpayfor(_payfor)
      this.$router.goBack()
      // this.$router.replace('/orderpaysuccess')
    } else if (_target == 'manageaddress') {
      //我的收货地址
      this.$router.replace('/manageaddress')
    } else if (_target == 'myorder') {
      //我的订单
      this.$router.replace('/myorder')
    } else if (_target == 'activation') {
      //激活页面
      this.$router.replace('/activation')
    } else if (_target == 'extend') {
      //推广中心
      this.$router.replace('/extend')
    } else if (_target == 'extenddesc') {
      //分享推广页面
      this.$router.replace('/extenddesc')
    } else if (_target == 'goodsdetails') {
      //物品详情
      this.$router.replace(`/goodsdetails/${_goodsid}`)
    } else {
      let _split = window.location.href.split('#/')
      if (_split[1].length != 0) {
        if (_split.indexOf('wechat_redirect') != -1) {
          this.$router.replace('/home')
        } else {
          this.$router.replace('/home')
        }
      } else {
        this.$router.replace('/home')
      }
    }
  },
  // else if (_target == 'extension') {
  //     //推广页面
  //     this.$router.replace('/extend')
  // }
  computed: {
    ...mapGetters(['hiddenFTab', 'userToken'])
  },
  methods: {
    ...mapMutations({
      setHiddenHTab: 'SET_HIDDENHTAB',
      setHiddenFTab: 'SET_HIDDENFTAB',
      setProgramType: 'SET_PROGRAMTYPE',
      setUserToken: 'SET_USER_TOKEN',
      setOpenid: 'SET_OPENID',
      setUserId: 'SET_USER_INFO_ID',
      setWxunionid: 'SET_WXUNIONID',
      setReferralCode: 'SET_REFERRALCODE',
      setSuperVip: 'SET_ISSUPERVIP',
      setMobile: 'SET_USER_MOBILE',
      setgoodid: 'SET_GOODSID',
      setuseravatar: 'SET_USERAVATAR',
      setusernickname: 'SET_USERNICKNAME',
      setpayfor: 'SET_CHANGEPAYFOR'
    })
  }
}
</script>

<style>

</style>
