<template>
  <div>
    <div class="invite-btn" @click="inviteFriend" open-type="share">邀请好友</div>

    <!-- 分享 -->
    <transition name="fade">
      <div class="showMask" v-show="showMask" @click="closeShareAlert">
        <share-type ref="shareType" class="shareType" :title="inviteTitle" :content="inviteContent" :thumbs="shareThumbs" :href="href"></share-type>
      </div>
    </transition>
    <transition name="fade">
      <div class="share-mask-pic" v-show="shareMaskPic" @click="showSharePic">
        <img src="./share-mask-pic.png" alt="" @load="minipragram">
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import ShareType from 'components/share-type/share-type'
import { serverUrlPrefix, serverUrlSuffix } from 'api/config'
import { Base64 } from 'js-base64'

export default {
  computed: {
    href() {
      return serverUrlPrefix + `programType=${this.programType}&token=${Base64.encode(this.userToken)}&target=extenddesc` + serverUrlSuffix
    },
    ...mapGetters(['programType', 'userToken','shareThumbs','inviteTitle','inviteContent'])
  },
  data() {
    return {
      showMask: false,
      shareMaskPic: false,//是否显示指向右上角分享图片
    }
  },
  created() {
    this.shareMaskPic = false
  },
  methods: {
    inviteFriend() {
      //分享
      if (this.programType === 'H5App') {
        this.$refs.shareType.show()
        this.showMask = true
      } else {
        this.shareMaskPic = true
      }
    },
    minipragram() {
      if (window.__wxjs_environment === 'miniprogram') {
        let init = `&token=${Base64.encode(this.userToken)}`
        wx.miniProgram.postMessage({ data: { 'webViewUrl': init, 'title': this.inviteTitle } })
      }
    },
    closeShareAlert() {
      this.$refs.shareType.hide()
      this.showMask = false
    },
    showSharePic() {
      this.shareMaskPic = false
    },
  },
  components: {
    MHeader,
    ShareType
  }
}
</script>
<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"
.shareType
  background: $white
  color: $gray-dark
.showMask
  position: fixed
  z-index: 1001
  left: 0
  right: 0
  bottom: 0
  top: 0
  background: rgba(0,0,0,0.6)  
  width: 100%
  height: 100%  
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
  &.fade-enter, &.fade-leave-to
    opacity: 0  
.share-mask-pic
  position: fixed
  z-index: 1003
  left: 0
  right: 0
  bottom: 0
  top: 0 
  >img
    width: 100%
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
  &.fade-enter, &.fade-leave-to
    opacity: 0    