<template>
  <div class="type-details">
    <m-header :title="title" :type="2" @back="back"></m-header>
    <shop-cart></shop-cart>

    <div class="type-details-wrapper" ref="detailsWrapper">
      <scroll :data="[]" ref="scroll" class="type-details-content" @scroll="scroll" :listenScroll="listenScroll" :scrollEnd="true">
        <div>
          <div>
            <slide :listImg="listImg" :className="'type-details-banner'" ref="slide" :height="{}" @bannerClick="navClick(item,'','banner')"></slide>
          </div>
          <div class="nav">
            <div class="swiper-container nav-container2" ref="navContainer">
              <div class="swiper-wrapper">
                <div class="swiper-slide nav_slide" v-for="(item, index) in contentText">
                  <div class="nav_text" :class="{active : index === currentIndex}" @click="changeNow(index)" ref="navGroup">{{item.name}}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-for="(item, index) in itemList" class="type-details-item" ref="listGroup">
            <home-title :bannerUrl="image(item.categoryPicture)" :titleNum="2" @bannerClick="navClick(item,item.categoryId,'itemBanner')" :title="item.categoryName"></home-title>
            <home-list :data="item.goods" @lookDetails="lookDetails"></home-list>
          </div>
        </div>
      </scroll>
    </div>

    <div class="nav nav-other" ref="navOther" :style="styleHeight">
      <div class="swiper-container nav-container2">
        <div class="swiper-wrapper">
          <div class="swiper-slide nav_slide" v-for="(item, index) in contentText">
            <div class="nav_text" :class="{active : index === currentIndex}" @click="changeNow(index)" ref="navGroup2">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import slide from 'base/slider/slider'
import homeList from 'base/home-list/home-list'
import homeTitle from 'base/home-title/home-title'
import mHeader from 'components/m-header/m-header'
import shopCart from 'base/shop-cart/shop-cart'
import scroll from 'base/scroll/scroll'
import { setToastMsg, initPage } from 'common/js/mixin'
import { addClass, removeClass } from 'common/js/dom'
import { getCategoryBannersAndChildren, getCategoryWithGoods } from 'api/goods'
import { mapGetters, mapMutations } from 'vuex'
import { bgImg ,avatar} from 'common/js/tools'

export default {
  mixins: [setToastMsg, initPage],
  data() {
    return {
      listImg: [],
      navStatue: true,
      contentText: [],
      currentIndex: 0,
      listenScroll: true,
      scrollY: -1,
      itemList: [],
      parentName: '',
      pictureAdress:'',

    }
  },
  computed: {
    title() {
      document.title = this.parentName
      return this.parentName
    },
    styleHeight() {
      if (this.hiddenHTab) {
        return 'top:0px'
      } else {
        return 'top:1.17333rem'
      }
    },
    ...mapGetters(['categoryId'])
  },
  created() {
    this._categoryId = this.categoryId || this.$route.params.id
    this._initInfo()
    this.$nextTick(() => {
      this._initPage(this.$refs.detailsWrapper)
    })
  },
  mounted() { },
  methods: {
    back() {
      this.$router.goBack()
    },
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
            window.location.href = item.linkUrl
          }
        }
        return false
      }
      if (type == 'itemBanner') {
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
        }
      }
    },
    changeNow(index) {
      // this.currentIndex = index
      // if (index > this.listHeight.length - 2) {

      // }
      this.scrollY = -this.listHeight[index + 1]
      this.$nextTick(() => {
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 100)
      })
    },
    _getCategoryWithGoods(item, Pmax) {
      if (Pmax > item.length - 1) {
        return false
      }
      getCategoryWithGoods(item[Pmax].id, '', '').then(res => {
        if (res.success) {
          this.itemList.push(res)
          this._getCategoryWithGoods(item, ++Pmax)
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _initInfo() {
      this.currentIndex = 0
      getCategoryBannersAndChildren(this._categoryId).then(res => {
        if (res.success) {
          this.parentName = res.parentName
          this.listImg = res.banners
          this.contentText = res.children
          this.$nextTick(() => {
            this.swiper = new Swiper('.nav-container2', {
              slidesPerView: 5,
              freeMode: true,
              freeModeMomentumRatio: 3,
              slidesPerView: 'auto'
            })
            for (let j = 0; j < this.$refs.navGroup.length; j++) {
              removeClass(this.$refs.navGroup2[j], 'active')
              removeClass(this.$refs.navGroup[j], 'active')
            }
            addClass(this.$refs.navGroup2[0], 'active')
            addClass(this.$refs.navGroup[0], 'active')
          })

          this._getCategoryWithGoods(this.contentText, 0)
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    _calcaulateHeight() {
      this.bannerHeight = this.$refs.slide.$el.clientHeight
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    scrollToEnd() { },
    image(item) {
      return bgImg(item)
    },
    ...mapMutations({
      setgoodid: 'SET_GOODSID'
    })
  },
  activated() {
    removeClass(this.$refs.navOther, 'navactive')
    this.$nextTick(() => {
      if (this.swiper) {
        this.swiper[0].slideTo(0, 0, false)
        this.swiper[1].slideTo(0, 0, false)
      }
    })
  },
  watch: {
    scrollY(newY) {
      if (newY < -this.bannerHeight) {
        addClass(this.$refs.navOther, 'navactive')
      } else {
        removeClass(this.$refs.navOther, 'navactive')
      }
      for (let j = 0; j < this.$refs.navGroup.length; j++) {
        removeClass(this.$refs.navGroup2[j], 'active')
        removeClass(this.$refs.navGroup[j], 'active')
      }
      newY = newY + this.bannerHeight
      if (newY > 0 || newY > -this.bannerHeight) {
        this.currentIndex = 0
        this.swiper[0].slideTo(0, 300, false)
        this.swiper[1].slideTo(0, 300, false)
        addClass(this.$refs.navGroup2[0], 'active')
        addClass(this.$refs.navGroup[0], 'active')
        return
      }
      // 中间滚动
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          // this.currentIndex = i
          this.swiper[0].slideTo(i, 300, false)
          this.swiper[1].slideTo(i, 300, false)
          addClass(this.$refs.navGroup2[i], 'active')
          addClass(this.$refs.navGroup[i], 'active')
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.swiper[0].slideTo(listHeight.length - 2, 300, false)
      this.swiper[1].slideTo(listHeight.length - 2, 300, false)
    },
    itemList() {
      this.$nextTick(() => {
        this._calcaulateHeight()
      })
    },
    categoryId(newVal) {
      this.currentIndex = 0
      this.listImg = []
      this.itemList = []
      this._categoryId = newVal
      this._initInfo()
    }
  },
  components: {
    slide,
    homeList,
    scroll,
    homeTitle,
    mHeader,
    shopCart
  }
}
</script>

<style lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"

.type-details
  position: fixed
  z-index: 100
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: #f7f7f7
  .type-details-item
    padding-top: 10 / $cale + rem
  // .shopCart
  //   bottom: 0.5rem
  //   right: 0.5rem
  .type-details-wrapper
    position: fixed
    bottom: 0
    top: 44 / $cale + rem
    width: 100%
    .type-details-content
      height: 100%
      overflow: hidden
  .nav
    padding: 10 / $cale + rem 0
    background: #fff
    position: relative
    .nav_slide
      float: left
      padding: 0 0.2rem
      width: auto
      text-align: center
    .nav_text
      font-size: 14 / $cale + rem
      color: #666
      height: 0.6rem
      line-height: 0.6rem
      border-bottom: 1px solid #fff
      &.active
        color: $bottom-btn-background-base
        border-bottom: 1px solid $bottom-btn-background-base
    &.nav-other
      position: fixed
      width: 100%
      top: 44 / $cale + rem
      z-index: -1
      opacity: 0
    &.navactive
      z-index: 120
      opacity: 1
</style>
