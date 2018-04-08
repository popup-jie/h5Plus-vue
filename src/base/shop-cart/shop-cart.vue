<template>
  <div>
    <div class="shopCart" @click="goToShopcart" :style="bottomStyle">
      <div class="shopCart_icon">

      </div>
    </div>
    <register ref="register"></register>
  </div>
</template>

<script>
import Register from 'components/register/register'
import { mapGetters } from 'vuex'
export default {
  computed: {
    bottomStyle() {
      if (this.hiddenFTab == true) {
        return 'bottom:0.5rem;right:0.5rem'
      } else {
        return ''
      }
    },
    ...mapGetters(['hiddenFTab', 'mobile'])
  },
  methods: {
    goToShopcart() {
      if (this.mobile == '') {
        this.$refs.register.show()
      } else {
        this.$router.push('/shopcart')
      }
    }
  },
  components: {
    Register
  }
}
</script>

<style lang="sass">
@import "~common/sass/variable"
@import "~common/sass/mixin"
.shopCart
  position: fixed
  bottom: 1.6rem
  right: 0.8rem
  z-index: 105
  .shopCart_icon
    +size(60/$cale+rem)
    +bg-image('./cart_icon_active')
    background-size: 100% 100%      
</style>
