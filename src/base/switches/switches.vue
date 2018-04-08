<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':ind === index}" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.ind = this.currentIndex
  },
  data() {
    return {
      ind: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
      this.ind = index
    }
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"

  .switches
    display: flex
    flex-direction: row
    background-color: #fff
    box-shadow: inset 0 -0.5px 0 0 $gray-lighter
    .switch-item
      position: relative
      flex: 1
      text-align: center
      padding: 16px 0 14px
      font-size: 15px
      line-height: 18px
      color: #999
      border-bottom: 2px solid transparent
      &.active
        color: $color-theme
        border-bottom: 2px solid $color-theme
</style>