<template>
  <div class="evaluate-detail">
    <m-header title="查看评价" :type="3" @back="back"></m-header>
    <div class="evaluate-detail-wrapper" ref="evaluateDetailWrapper">
      <div class="scroll-inner">
        <ul class="goods-list">
          <li class="goods-item" v-for="(item,Pindex) in goods">
            <!--商品信息及评分-->
            <div class="item-info">
              <img :src="item.imgSrc" alt="" class="pic">
              <div class="desc">
                <p class="name">{{item.name}}</p>
                <p class="ratings">评分：
                  <star :size="20" :score="item.score"></star>
                </p>
              </div>
            </div>
            <!--输入评价信息-->
            <div class="rating-box">
              {{item.rating}}
            </div>
            <!--添加图片-->
            <ul class="addpic-list">
              <li class="addpic-item" v-for="(Citem,Cindex) in item.uploadPics">
                <img :src="Citem" alt="">
                <span class="icon-delete"></span>
              </li>
            </ul>
            <!--是否匿名发表评价-->
            <div class="unknown">
              <div class="left">
                <span class="date">{{item.Cdate}}</span>
                <span class="norms">{{item.norms}}</span>
              </div>
              <div class="right">
                {{item.unknown?'匿名评价':'实名评价'}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import Star from 'components/star/star'
import { setToastMsg, initPage, share } from 'common/js/mixin'
export default {
  mixins: [initPage, setToastMsg, share],
  data() {
    return {
      goods: [
        {
          name: '益达口香糖益达口香糖益达口香糖益达口香糖益达口香糖益达口香糖益达口香糖',
          uploadPics: ['http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc'],
          score: 2,
          rating: '用了感觉没有想象中的好！',
          unknown: true,
          norms: '规格一',
          Cdate: '2018-01-01',
          imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515475393255&di=e56d6e701c6c80800ce10545381d62e6&imgtype=0&src=http%3A%2F%2Fimages.51bi.com%2Fopt%2Fsiteimg%2Fp%2F20151109%2F4f74cbac58b4dcf5f41a95bdcd44a82b.jpeg'
        },
        {
          name: '星巴克咖啡',
          uploadPics: ['http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc'],
          score: 4,
          rating: '还不错！',
          unknown: false,
          norms: '规格三',
          Cdate: '2017-12-11',
          imgSrc: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=955589142,1642526609&fm=27&gp=0.jpg'
        },
        {
          name: '益达',
          uploadPics: ['http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc', 'http://120.76.155.216/file/file/preview/cmxGb2xkZXIlMkYyMDE4MDEwNSUyRjI0MjYxMzAxNDM1NzQwNTc5ZDAzZjgyZDc2MDI2MmJlX21hZ2F6aW5lLXVubG9jay0wNS0yLjMuODM5LV8zYTZkZjA0Y2U2ODU0MzY5YmVjNDM3ZTRlNTQ4OTc4Yy5qcGc'],
          score: 1,
          rating: '一般般！',
          unknown: true,
          norms: '规格五',
          Cdate: '2017-10-21',
          imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515475393255&di=e56d6e701c6c80800ce10545381d62e6&imgtype=0&src=http%3A%2F%2Fimages.51bi.com%2Fopt%2Fsiteimg%2Fp%2F20151109%2F4f74cbac58b4dcf5f41a95bdcd44a82b.jpeg'
        }
      ],
    }
  },
  created() {
    document.title = '晒单详情'
    this._shareDetail()
    this._initscroll()
    this.$nextTick(() => {
      this._initPage(this.$refs.evaluateDetailWrapper)
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.evaluateDetailWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
  },
  components: {
    MHeader,
    Star,
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .evaluate-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: $background-base
    color: $text_color
    font-size: 14/$cale+rem
    line-height: 20/$cale+rem
    .evaluate-detail-wrapper
      position: fixed
      top: 44/$cale+rem
      bottom: 0
      overflow: hidden
      width: 100%
      .scroll-inner
        padding-bottom: 10/$cale+rem
      .goods-item
        background-color: $white
        margin-bottom: 10/$cale+rem
        &:last-child
          margin-bottom: 0
      .item-info
        display: flex
        padding: 10/$cale+rem
        border-bottom: 1px solid $mall-border-base
        .pic
          +size(80/$cale+rem)
        .desc
          flex: 1
          padding-left: 10/$cale+rem
          .name
            width: 100%
            margin-bottom: 12/$cale+rem
            line-height: 24/$cale+rem
            font-size: 17/$cale+rem
            color: $text_light
            word-break: break-all
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
            overflow: hidden
          .ratings
            display: flex
      .rating-box
        display: flex
        width: 100%
        box-sizing: border-box
        padding: 8/$cale+rem 10/$cale+rem
        background-color: $white
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        color: $text_color
      .addpic-list
        width: 100%
        overflow: hidden
        padding: 5/$cale+rem 0 15/$cale+rem
        margin: 0 12.5/$cale+rem
        background-color: $white
        .addpic-item
          float: left
          +size(80/$cale+rem)
          margin-right: 10/$cale+rem
          margin-top: 10/$cale+rem
          text-align: center
          position: relative
          &:nth-child(4n)
            margin-right: 0
          img
            +size(80/$cale+rem)
      .unknown
        display: flex
        justify-content: space-between
        padding: 10/$cale+rem 0
        margin: 0 10/$cale+rem
        background-color: $white
        color: $text_lighter
        border-top: 1px solid $mall-border-base
        .left
          font-size: 0
          vertical-align: top
          line-height: 20/$cale+rem
          .date,.norms
            font-size: 14/$cale+rem
          .date
            margin-right: 10/$cale+rem
</style>