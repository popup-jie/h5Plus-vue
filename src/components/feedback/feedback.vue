<template>
  <div class="feedback">
    <m-header title="意见反馈" :type="3" @back="back"></m-header>
    <div class="feedback-content">
      <div class="feedback-box">
        <textarea class="box" rows="8" maxlength="400" placeholder="请简要描述下您需要反馈的内容，您的意见对我们至关重要" v-model="problemTxt" ref="problemTxt"></textarea>
        <p class="total">
          <span class="inputNum">{{inputNum}}</span>/400</p>
      </div>

      <div class="img-box">
        <div class="add-explain">
          <p class="add-title">上传图片</p>
          <p class="add-total">
            <span class="inputNum">{{fids.length}}</span>/3</p>
        </div>
        <ul class="addpic-list">
          <li class="addpic-item" v-for="(item,index) in avatars" ref="avatarsItem" :key="index">
            <img :src="item" alt="">
            <i class="close" @click="deletePic(index)">×</i>
          </li>
          <template v-if="avatars.length<3">
            <!-- @click="uploadPic" -->
            <li class="addpic-item addpic-bg-add" @click="uploadPic">
              <span class="add-pic"></span>
            </li>
          </template>
        </ul>
      </div>

      <div class="contact-box">
        <input class="email-text" type="text" placeholder="请输入您的联系邮箱" v-model="emailTxt" ref="emailTxt">
      </div>
      <div class="submitBtn" ref="submitBtn" v-show="btnShow" @click="_saveOpinion">提交</div>

    </div>
  </div>
</template>


<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import { setToastMsg, uploadMixins,share } from 'common/js/mixin'
import { mapGetters } from 'vuex'
import { saveOpinionFeedBack } from 'api/userCenter'
import { addClass, removeClass, hasClass } from 'common/js/dom.js'
import { avatar } from 'common/js/tools'
import { uploadFile } from 'api/file.js'

export default {
  mixins: [setToastMsg, uploadMixins,share],
  data() {
    return {
      problemTxt: '',//遇到的问题和意见
      emailTxt: '',//邮箱
      btn: '',
      avatars: [],//图片数组
      fids: [],//图片id
      num: 0,//图片数量
      btnShow: true, //按钮是否显示，在键盘开启时
      needCropper: false //上传图片不需要裁剪
    }
  },

  mounted() {
    const oldHeight = window.innerHeight
    window.addEventListener('resize', () => {
      let newHeight = window.innerHeight
      this.btnShow = newHeight < oldHeight ? false : true
    })
  },
  computed: {
    inputNum() {
      return this.problemTxt.length
    },
    ...mapGetters(['userToken'])
  },
  watch: {
    problemTxt: function (val, oldval) {
      this.submitBtn()
    },
  },
  deactivated() {
    this.clearAll()
  },
  created () {
    this._shareDetail()
  },
  methods: {
    clearAll() {
      this.problemTxt = ''
      this.fids = []
      this.avatars = ''
      this.emailTxt = ''
      this.num = 0
    },
    back() {
      this.$router.goBack()
    },
    imgHeight() {
      var screenWidth = document.documentElement.clientWidth
      var imgWidth = screenWidth * 0.33
      return imgWidth + 'px'
    },
    submitBtn() {
      console.log('submitBtn')
      const el = this.$refs.submitBtn
      //  || this.emailTxt.length > 0
      if (this.problemTxt.length > 0) {
        addClass(el, 'active')
      } else {
        removeClass(el, 'active')
      }
    },
    _saveOpinion() {
      console.log('提交')
      const el = this.$refs.submitBtn
      console.log('this.userToken:' + this.userToken + 'this.fids=' + this.fids)
      if (hasClass(el, 'active')) {
        saveOpinionFeedBack(this.userToken, this.fids, this.problemTxt, this.emailTxt).then(res => {
          console.log('成功进入')
          if (res.success) {
            this.clearAll()
            this.$router.push('/feedbacksuccess')

          } else {
            this.setToastMsg(res.msg)
          }
        })
      } else {
        this.setToastMsg('请添加描述')
      }
    },
    uploadPic() {
      this.type = 'upload'
      this.openAlbum()
    },
    deletePic(index) {
      //删除图片
      console.log('删除图片')
      const self = this
      this.avatars.splice(index, 1)
      this.fids = this.fids.splice(index, 1).join(',')
    },
    pageUploadHandle(res) {
      var newAvatar = avatar(res.data.fid)
      this.avatars.push(newAvatar)
      this.fids.push(res.data.fid)
      this.fids = this.fids.join(',')
    }
  },
  components: {
    MHeader
  }
}
</script>

<style type="text/sass" lang="sass">
@import "../../common/sass/variable"
@import "../../common/sass/mixin"

.feedback
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $background-base
  .feedback-content
    .feedback-box
      display: flex
      position: relative
      width: 100%
      box-sizing: border-box
      padding: 12/$cale+rem 0 
      background-color: $white
      border-bottom: 1/$cale+rem solid #e5e5e5
      .box
        flex: 1
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        color: $text_color
        border: 0
        resize: none
        padding: 0 15/$cale+rem
      .total
        position: absolute
        bottom: 10/$cale+rem
        right: 15/$cale+rem
        line-height: 20/$cale+rem
        font-size: 14/$cale+rem
        color: $gray
    .img-box
      margin: 8/$cale+rem 0 3/$cale+rem
      background: $white
      position: relative
      .add-explain
        margin-bottom: 10/$cale+rem
        color: $gray
        display: flex
        position: relative
        font-size: 12/$cale+rem
        padding: 10/$cale+rem 15/$cale+rem
        .add-total
          position: absolute
          right: 15/$cale+rem
      .addpic-list
        width: 100%
        overflow: hidden
        .addpic-item,.addpic-bg-add
          float: left
          width: 22%
          margin: 0 5/$cale+rem 0 0
          padding: 5/$cale+rem 0
          .add-pic
            +bg-image('./add-pic') 
            background-size: 100% 100%
            +extend-click() 
            +size(72/$cale+rem)
            position: absolute
            left: 15/$cale+rem
            top: 0
          img
            +size(72/$cale+rem)              
          .close
            +size(18/$cale+rem)
            background: red
            font-size: 20/$cale+rem
            position: absolute
            top: 0 
            right: 0
            border-radius: 50%
            line-height: 18/$cale+rem
            color: $white
            text-align: center
    .addpic-bg-add        
      height: 90/$cale+rem
      position: relative
    .email-text
      width: 100%  
      height: 44/$cale+rem   
      line-height: 44/$cale+rem 
      font-size: 15/$cale+rem
      padding-left: 15/$cale+rem
    .box::-webkit-input-placeholder,.email-text::-webkit-input-placeholder
      font-size: 14/$cale+rem
      color: $gray-light
    .email-text::-webkit-input-placeholder    
      paddding-top: 0
  .submitBtn
    text-align: center
    width: 92%
    position: fixed
    bottom: 30/$cale+rem
    color: $white
    height: 44/$cale+rem
    line-height: 44/$cale+rem
    font-size: 17/$cale+rem
    background: $bottom-btn-background-light
    border-radius: $border-radius-base
    box-shadow: 0 0 8/$cale+rem 3/$cale+rem $gray-lighter
    margin-left: 15/$cale+rem
    &.active      
      background: $bottom-btn-background-base
</style>  