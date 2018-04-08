<template>
  <ul class="footer">
    <li>
      <router-link tag="div" class="tab-item" to="/home">
        <span class="iconfont icon-gongxiang"></span>
        <div class="icontext">生活馆</div>
      </router-link>
    </li>
    <li>
      <router-link tag="div" class="tab-item" to="/user">
        <span class="iconfont icon-geren"></span>
        <div class="icontext">个人</div>
      </router-link>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      list: [
        { text: '生活馆', iconName: 'icon-gongxiang', url: '/home' },
        { text: '个人', iconName: 'icon-geren', url: '/user' }
      ],
      now: 0
    }
  },
  methods: {
    changeNow: function(e) {
      this.now = e
    }
  }
}
</script>

<style lang="sass" type="text/sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.footer
  border-top: 1px solid #e9e9e9
  position: fixed
  width: 100%
  bottom: 0px
  left: 0px
  background: #fff
  display: flex
  height: 1.3rem
  padding: 0.1rem 0
  z-index: 11
  font-size: 0
  li
    flex: 1 0 25%
    text-align: center
  .iconfont
    color: #666
    font-size: 22 / $cale + rem
    width: 22 / $cale + rem
    height: 22 / $cale + rem
    display: inline-block
    background-size: 100% 100%
    &.icon-gongxiang
      +bg-image('./home_icon')
      width: 23 / $cale + rem
      height: 24 / $cale + rem
    &.icon-geren
      +bg-image('./me_icon')
  .icontext
    color: #666
    font-size: 13 / $cale + rem
    margin-top: 0.1rem
  .router-link-exact-active.router-link-active
    .icontext
      color: $new-main
    .icon-gongxiang
      +bg-image('./home_icon_active')
    .icon-geren
      +bg-image('./me_icon_active')
  a
    color: inherit
    text-decoration: none
    background: inherit
  a:active div
    color: inherit
    text-decoration: none
    background: rgba(0, 0, 0, 0)
</style>