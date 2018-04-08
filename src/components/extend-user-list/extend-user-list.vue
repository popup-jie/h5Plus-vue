<template>
  <div class="extend-user-list">
    <m-header title="累计用户" :type="3" @back="back"></m-header>
    <div class="extend-user-list-wrapper" ref="extenduserListWrapper">
      <div class="scroll-inner">
        <!-- <p>13:00:13</p> -->
        <ul class="invite">
          <li class="invite-list" v-for="(item,index) in custUserList" :key="index">
            <div>
              <img v-lazy="item.avatar" alt="" class="avatar">
            </div>
            <div class="nickname">
              {{item.nickName}}
            </div>
            <div class="time">
              <p>{{item.relationTime.split(" ")[0]}}</p>
              <p>{{item.relationTime.split(" ")[1]}}</p>
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
import { initPage, setToastMsg,share } from 'common/js/mixin'
import { findUserShareSaleInfo } from 'api/extend'
import { mapGetters } from 'vuex'

export default {
  mixins: [initPage, setToastMsg,share],
  computed: {
    // time(){
    //   return this.timeArr=str.split(" ")
    // },
    ...mapGetters(['userToken'])
  },
  data() {
    return {
      custUserList: [],
      timeArr:[]
    }
  },
  created() {
    document.title = '累计用户'
    this._shareDetail()
    this._initscroll()
    this.$nextTick(() => {
      this._initPage(this.$refs.extenduserListWrapper)
    })
    this._findUserShareSaleInfo()
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.extenduserListWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _findUserShareSaleInfo() {
      findUserShareSaleInfo(this.userToken).then(res => {
        if (res.success) {
          this.custUserList = res.custUserList
        }
      })
    },
  },
  components: {
    MHeader
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .extend-user-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    font-size: 14/$cale+rem
    color: $text_color
    background-color: $background-base

  .extend-user-list-wrapper
    position: fixed
    top: 44/$cale+rem
    bottom: 0/$cale+rem
    width: 100%
    overflow: hidden
    .scroll-inner
      padding-bottom: 30/$cale+rem
    .invite
      background: $white
      padding: 0 15/$cale+rem
      li
        padding: 15/$cale+rem 0
        border-bottom: 1px solid $mall-border-base
        display: flex
        position: relative
      li:last-child
        border-bottom: none
      .avatar
        +size(40/$cale+rem)
        border-radius: 50%
      .nickname
        font-size: 14/$cale+rem
        color: $gray-dark  
        line-height: 40/$cale+rem
        margin-left: 10/$cale+rem
      .time
        position: absolute
        right: 0
        top: 15/$cale+rem
        line-height: 20/$cale+rem
        color: $gray
        text-align: right
</style>