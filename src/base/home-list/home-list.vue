<template>
  <div>
    <div class="home-list-wrapper">
      <!-- list -->
      <ul class="home-list-ul">
        <li @click="lookDetails(item)" v-for="item in data">
          <div class="home-list-item-pic">
            <img v-lazy="image(item.goodsPicture)" />
          </div>
          <div class="home-list-item-names">
            {{item.name}}
          </div>
          <div class="home-list-item-footer">
            <span class="price">¥{{item.price}}</span>
          </div>
        </li>
        <!-- <li>
          <div class="home-list-item-pic">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514465906363&di=1653d383d06b9301be4b9adebc82e9f1&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fzhidao%2Fwh%253D450%252C600%2Fsign%3Df7f3a9e012ce36d3a2518b340fc316b1%2F2f738bd4b31c87010dcde7dc207f9e2f0708ff95.jpg" />
          </div>
          <div class="home-list-item-names">
            Chanel香奈儿全新rougecoco小姐唇膏
          </div>
          <div class="home-list-item-footer">
            <span class="price">¥245.00</span>
            <span class="icon"></span>
          </div>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
import { bgImg } from 'common/js/tools'
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    lookDetails(item) {
      this.$emit('lookDetails', item)
    },
    image(item) {
      return bgImg(item)
    }
  }
}
</script>

<style lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.home-list-wrapper
  background: #fff
  .home-list-ul
    padding: 9 / $cale + rem
    display: flex
    flex-flow: wrap
    justify-content: space-between
    padding-top: 0
    li
      padding-bottom: 10 / $cale + rem
      margin-bottom: 10 / $cale + rem
      width: 49%
      border: 1px solid #ebebeb
      .home-list-item-pic
        // padding: 7 / $cale + rem 6 / $cale + rem
        background: #f7f7f7
        img
          +size(100%, 164/ $cale + rem)
      .home-list-item-names
        padding: 7 / $cale + rem 6 / $cale + rem
        font-size: 14 / $cale + rem
        color: $gray-dark
        margin-top: 10 / $cale + rem 0
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
        overflow: hidden
      .home-list-item-footer
        padding: 7 / $cale + rem 6 / $cale + rem
        position: relative
        display: flex
        .price
          font-size: 15 / $cale + rem
          color: #ddb47b
          font-weight: 600
        .icon
          +bg-image('./shop_cart')
          background-size: 100% 100%
          +size(22/ $cale + rem,20/ $cale + rem)
          bottom: 0.1rem
          right: 12 / $cale + rem
          +extend-click()
          position: absolute
</style>
