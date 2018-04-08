<template>
  <div class="home">
    <m-header :type="3" @back="back"></m-header>
    <div class="home-wrapper" ref="homeWrapper">
      <div>
        <slide :listImg="listImg" :className="'swiper-home'" ref="slide" :height="{}" @bannerclick="navClick"></slide>
        <div class="nav" v-show="navStatue && navStr.length > 1">
          <div class="swiper-container nav-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide nav_slide" v-for="(item,index) in navStr" @click="navClick(item,'','navStr')" :key='index'>
                <span class="icon" :style="{backgroundImage:'url(' + image(item.icon) + ')'}"></span>
                <div class="nav_text">{{item.name}}</div>
              </div>
            </div>
          </div>
          <div class="downIcon" @click="showMore" ref="iconDown" v-show="navStr.length>5"></div>
        </div>
        <div class="nav nav_more" v-show="!navStatue">
          <div class="nav_title">
            全部类别
            <div class="downIcon" @click="showMore" ref="iconUp"></div>
          </div>
          <div class="flex">
            <div class="swiper-slide nav_slide" v-for="(item,index) in navStr" @click="navClick(item,'','navStr')" :key='index'>
              <span class="icon" :style="{backgroundImage:'url(' + image(item.icon) + ')'}"></span>
              <div class="nav_text">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div class="wrapper-item" v-for="(item, index) in itemList">
          <home-title :bannerUrl="image(item.categoryPicture)" @moreClick="navClick(item,item.categoryId,'itemList')" @bannerClick="navClick(item,item.categoryId,'itemBanner')" :title="item.categoryName"></home-title>
          <home-list @lookDetails="lookDetails" :data="item.goods"></home-list>
        </div>
      </div>
    </div>
    <shop-cart></shop-cart>
    <register ref="register"></register>
  </div>
</template>

<script>
import Swiper from 'swiper'
import BScroll from 'better-scroll'
import slide from 'base/slider/slider'
import homeList from 'base/home-list/home-list'
import homeTitle from 'base/home-title/home-title'
import { addClass, removeClass } from 'common/js/dom'
import mHeader from 'components/m-header/m-header'
import shopCart from 'base/shop-cart/shop-cart'
import {
  getIndexBanners,
  getIndexSimpleCategorys,
  getIndexCategorysAndGoods
} from 'api/goods'
import { bgImg, avatar } from 'common/js/tools'
import { mapMutations, mapGetters } from 'vuex'
import Register from 'components/register/register'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  components: {
    slide,
    homeList,
    homeTitle,
    mHeader,
    shopCart,
    Register
  },
  computed: {
    ...mapGetters(['userToken'])
  },
  mounted() { },
  created() {
    document.title = '菁亭生活馆'
    this._shareDetail()
    this._initscroll()
    this._initInfo()
    this.$nextTick(() => {
      this._initPage(this.$refs.homeWrapper)
      /*if (this.userToken == '') {
        this.$refs.register.show()
      }*/
    })
  },
  data() {
    return {
      listImg: [],
      navStatue: true,
      navStr: [],
      itemList: [],
      pictureAdress: ''
    }
  },
  methods: {
    back() {
      if (window.plus) {
        var ws = plus.webview.currentWebview()
        ws.hide('slide-out-left')
      }
    },
    navClick(item, id, type) {
      if (type == 'banner') {
        if (item.linkUrl != '') {
          if (window.plus) {
            let webview = plus.webview.create(item.linkUrl, 'bannerlist', {
              titleNView: {
                backgroundcolor: '#FFFFFF',
                titletext: item.name,
                titlecolor: '#333',
                autoBackButton: true
              }
            })
            webview.addEventListener('close', function () {
              webview = null
            })
            webview.addEventListener('titleUpdate', function () {
              webview.show('fade-in', 600)
            })
          } else {
            this.setgoodid(item.linkUrl)
            if (window.__wxjs_environment === 'miniprogram') {
              var path = `/page/orderdetails/orderdetails?goodsid=${item.linkUrl}&sharegoodspingtuan=0`
              //通过JSSDK的api使小程序跳转到指定的小程序页面
              wx.miniProgram.navigateTo({ url: path })
            } else {
              //查看详情
              this.$router.push(`/goodsdetails/${item.linkUrl}`)
              // window.location.href = item.linkUrl
            }
          }
        }
        return false
      }
      //分类详情
      if (type == 'navStr') {
        //导航栏点击
        if (item.iconUrl != null && item.iconUrl != '') {
          if (window.plus) {
            let webview = plus.webview.create(item.iconUrl, 'types', {
              titleNView: {
                backgroundcolor: '#FFFFFF',
                titletext: item.name,
                titlecolor: '#333',
                autoBackButton: true
              }
            })
            webview.addEventListener('close', function () {
              webview = null
            })
            webview.addEventListener('titleUpdate', function () {
              webview.show('fade-in', 600)
            })
          } else {
            window.location.href = item.linkUrl
          }
        } else {
          this.setcategoryId(item.id)
          this.$router.push(`/typedetails/${item.id}`)
        }
      } else if (type == 'itemBanner') {
        //楼层banner点击
        if (item.categoryPictureUrl != null && item.categoryPictureUrl != '') {
          if (window.plus) {
            let webview = plus.webview.create(
              item.categoryPictureUrl,
              'types',
              {
                titleNView: {
                  backgroundcolor: '#FFFFFF',
                  titletext: item.categoryName,
                  titlecolor: '#333',
                  autoBackButton: true
                }
              }
            )
            webview.addEventListener('close', function () {
              webview = null
            })
            webview.addEventListener('titleUpdate', function () {
              webview.show('fade-in', 600)
            })
          } else {
            window.location.href = item.categoryPictureUrl
          }
        } else {
          this.setcategoryId(id)
          this.$router.push(`/typedetails/${id}`)
        }
      } else {
        //更多点击
        this.setcategoryId(id)
        this.$router.push(`/typedetails/${id}`)
      }
    },
    addCart() { },
    lookDetails(item) {
      this.setgoodid(item.id)
      if (window.__wxjs_environment === 'miniprogram') {
        let formatBgimg = avatar(item.goodsPicture)
        let title = `${item.name}，售价${item.price}元，新锐礼助力新年好福气`
        var path = `/page/orderdetails/orderdetails?goodsid=${item.id}&formatBgimg=${formatBgimg}&title=${title}&sharegoodspingtuan=0`
        console.log(path)
        //通过JSSDK的api使小程序跳转到指定的小程序页面
        wx.miniProgram.navigateTo({ url: path })
      } else {
        //查看详情
        this.$router.push(`/goodsdetails/${item.id}`)
      }

    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.homeWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _initInfo() {
      getIndexBanners().then(res => {
        if (res.success) {
          this.listImg = res.data
          this.$nextTick(() => {
            this._initscroll()
          })
        } else {
          this.setToastMsg(res.msg)
        }
      })
      getIndexSimpleCategorys().then(res => {
        if (res.success) {
          this.navStr = res.data
          this.$nextTick(() => {
            var swiper = new Swiper('.nav-container', {
              slidesPerView: 5
            })
          })
        } else {
          this.setToastMsg(res.msg)
        }
      })
      getIndexCategorysAndGoods('', '', 4).then(res => {
        if (res.success) {
          this.itemList = res.data
          this.pictureAdress = res.pictureAdress
          this.$nextTick(() => {
            this._initscroll()
          })
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    showMore() {
      this.navStatue = !this.navStatue
      this.$nextTick(() => {
        if (!this.navStatue) {
          addClass(this.$refs.iconUp, 'IconUp')
          removeClass(this.$refs.iconDown, 'iconDown')
        } else {
          removeClass(this.$refs.iconUp, 'IconUp')
          addClass(this.$refs.iconDown, 'iconDown')
        }
        this.scroll.refresh()
      })
    },
    image(item) {
      if (!item) {
        return
      }
      return bgImg(item)
    },
    _keyback() {
      let self = this
      plus.key.removeEventListener('backbutton', handler, false)
      plus.key.addEventListener('backbutton', function () {
        self.$router.goBack()
      })
    },
    ...mapMutations({
      setcategoryId: 'SET_CATEGORY_ID',
      setgoodid: 'SET_GOODSID'
    })
  },
  activated() {
    document.title = '菁亭生活馆'
    // if (this.$refs.slide) {
    //   this.$refs.slide.update()
    // }
    if (window.plus) {
      this._keyback()
    }
    this._initscroll()
  },
  deactivated() {
    // if (this.$refs.slide) {
    //   this.$refs.slide.stopPlay()
    // }

    removeClass(this.$refs.iconDown, 'iconDown')
    removeClass(this.$refs.iconUp, 'iconDown')
    removeClass(this.$refs.iconDown, 'IconUp')
    removeClass(this.$refs.iconUp, 'IconUp')
  }
}
function handler() { }
</script>

<style lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"

.home-wrapper
  position: absolute
  width: 100%
  top: 44 / $cale + rem
  left: 0px
  bottom: 1.3rem
  right: 0px
  overflow: hidden
  .nav
    padding: 0.2rem 0
    background: #fff
    position: relative
    .nav_slide
      float: left
      padding: 0 0.15rem
      width: auto
      text-align: center
    .icon
      +size(46/$cale+rem)
      display: inline-block
      background-size: 100% 100%
      text-align: center
      &.jingting
        +bg-image('./jingting-icon')
      &.beauty
        +bg-image('./beauty')
      &.delicious
        +bg-image('./delicious')
      &.drinks
        +bg-image('./drinks')
      &.liver
        +bg-image('./liver')
      &.wellplay
        +bg-image('./wellplay')
    .nav_text
      font-size: 12 / $cale + rem
      color: #666
  .nav-container
    width: 90%
    margin: 0
  .downIcon
    +bg-image('./right_icon')
    width: 10/$cale + rem
    height: 18/$cale + rem
    background-size: 100% 100%
    transform: rotate(90deg)
    right: 0.6rem
    top: 50%
    margin-top: -9/$cale + rem
    +extend-click()
    position: absolute
    &.iconDown
      animation: iconDown 0.3s forwards
  .nav_more
    .flex
      flex-flow: wrap
      padding-bottom: 0.2rem
    .nav_slide
      width: 20%
      padding: 0rem
      float: none
      margin-top: 0.4rem
    .nav_title
      font-size: 16 /$cale + rem
      color: $black
      text-align: center
      padding: 0.2rem 0
      padding-bottom: 0rem
      position: relative
      .downIcon
        margin-top: -4 /$cale + rem
        top: 50%
        &.IconUp
          animation: IconUp 0.3s forwards
  .wrapper-item
    margin-top: 10 /$cale + rem
@keyframes IconUp
  0%
    transform: rotate(90deg)
    margin-top: 40/$cale + rem
  100%
    transform: rotate(270deg)
    margin-top: -4/$cale + rem
    
@keyframes iconDown
  0%
    transform: rotate(270deg)
    margin-top: -40/$cale + rem
  100%
    transform: rotate(90deg)
    margin-top: -9/$cale + rem
</style>
