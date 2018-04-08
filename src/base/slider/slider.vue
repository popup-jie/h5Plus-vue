<template>
  <div class="slide-container" :class="className" :style="height">
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(str, index) in listImg" v-bind:key="index" :prevent="true">
        <img :src="image(str)" @click.prevent.stop="bannerClick(str)" />
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
let nim = 0
import mtSwipe from 'mint-ui/lib/Swipe'
import mtSwipeItem from 'mint-ui/lib/swipe-item'
import 'mint-ui/lib/swipe/style.css'
import 'mint-ui/lib/swipe-item/style.css'
import { bgImg } from 'common/js/tools'
export default {
  props: {
    listImg: {
      type: Array,
      default: []
    },
    className: {
      type: String,
      default: new Date().getTime()
    },
    height: {
      type: Object,
      default: {}
    }
  },
  computed: {
    paginationName() {
      return this.className + 'pagination'
    }
  },
  components: {
    mtSwipe,
    mtSwipeItem
  },
  mounted() {},
  methods: {
    bannerClick(item) {
      console.log(item)
      this.$emit('bannerclick', item, '', 'banner')
    },
    image(item) {
      let fid = item.picture || item.fid
      return bgImg(fid)
    }
  }
}
</script>

<style lang="sass">
.slide-container
  width: 100%
  height: 6.1rem
  .mint-swipe-item
    background-position: center
    background-size: cover
    width: 100%
    height: 100%
    background-image: #f7f7f7
    img 
      width: 100%
      height: 100%
  .mint-swipe-indicator
    background: #fff
    opacity: 0.8
    border-radius: 50%
    width: 8px
    height: 8px
    &.is-active
      background: #e9004c
</style>