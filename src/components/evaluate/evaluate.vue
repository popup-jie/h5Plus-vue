<template>
  <div class="evaluate">
    <m-header title="评价晒单" :type="3" @back="back"></m-header>
    <div class="evaluate-wrapper" ref="evaluateWrapper">
      <div class="scroll-inner">
        <ul class="goods-list">
          <li class="goods-item" v-for="(item,Pindex) in orderInfo.goods">
            <!--商品信息及评分-->
            <div class="item-info">
              <img :src="orderInfo.pictureAddress+item.picture" alt="" class="pic">
              <div class="desc">
                <p class="name">{{item.goodsName}}</p>
                <p class="ratings">评分：
                  <star :size="20" :score="item.score" @changeScore="changeScore($event, Pindex)"></star>
                </p>
              </div>
            </div>
            <!--输入评价信息-->
            <div class="rating-box">
              <textarea class="box" rows="4" maxlength="400" placeholder="请输入你的评价" v-model="item.rating" ref="ratingTxt"></textarea>
            </div>
            <!--添加图片-->
            <ul class="addpic-list">
              <li class="addpic-item" v-for="(Citem,Cindex) in item.picLocalId" ref="avatarsItem">
                <img :src="Citem" alt="">
                <span class="icon-delete" @click.stop.prevent="deletePic(Pindex,Cindex)"></span>
              </li>
              <template v-if="(item.picLocalId?item.picLocalId.length:0)<5">
                <li class="addpic-item addpic-bg-add" @click="uploadPic(Pindex)">
                  <span class="add-pic"></span>
                  <template v-if="(item.picLocalId?item.picLocalId.length:0)>0">
                    <span class="totalPic">{{(item.picLocalId?item.picLocalId.length:0)}}/5</span>
                  </template>
                  <template v-else>
                    <span class="totalPic">添加图片</span>
                  </template>
                </li>
              </template>
            </ul>
            <!--是否匿名发表评价-->
            <div class="unknown" style="display: none;">
              <div class="check-area" :class="{'active':item.unknown}" @click="setUnknown(Pindex)">
                <span class="iconCheck"></span>
                <span class="check-txt">匿名</span>
              </div>
              <div class="txt">你写的评价会以匿名的形式展现</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--添加图片拍照/打开相册选择弹窗-->
    <actionsheet ref="actionsheet" :actions="actions" @cancel="cancel" @btn1Click="camera" @btn2Click="addFromAlbum"></actionsheet>
    <!--底部发布评价按钮-->
    <div class="fixed-release" @click="release">发布</div>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import BScroll from 'better-scroll'
import Actionsheet from 'base/actionsheet/actionsheet'
import Star from 'components/star/star'
import { initPage, uploadMixins, setToastMsg,share } from 'common/js/mixin'
import { avatar } from 'common/js/tools'
import { uploadFile,uploadFileByWxSdk } from 'api/file'
import { getSignData } from 'api/getSignData'
import {orderDetail} from 'api/order'
import {addOrderAppraise} from 'api/evaluate'
import {getWxAccessToken} from 'api/weChatConfig'
import { mapGetters, mapMutations } from 'vuex'

export default {
  mixins: [initPage, uploadMixins, setToastMsg,share],
  data() {
    return {
      needCropper: false, //上传图片不需要裁剪
      actions: ['拍照', '相册'], //添加图片拍照/打开相册选择弹窗列表文字
      operateGoodsIndex: -1, //当前操作的商品索引
      orderInfo: {}, //订单详情信息
      access_token: '', //拼接图片地址给服务器
    }
  },
  computed: {
    ...mapGetters(['programType', 'openid','userToken','orderNo'])
  },
  created() {
    document.title = '晒单评价'
    this._shareDetail()
    this._orderNo = this.orderNo || this.$route.params.orderNo
    this._initscroll()
    this._initData()
    if (this.programType !== 'H5App') {
      //微网站或微信小程序下，需要获取签名
      this._getSignData()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initPage(this.$refs.evaluateWrapper,'close')
    })
  },
  methods: {
    back() {
      this.$router.goBack()
    },
    _initData(){
      getWxAccessToken().then((res)=>{
        if(res.success){
          this.access_token = res.access_token
        } else {
          this.setToastMsg(res.msg)
        }
      })
      //查询订单信息
      orderDetail(this._orderNo,this.userToken).then(res => {
        if(res.success){
          this.orderInfo = res
          this._initGoodsOtherInfo()
        } else {
          this.setToastMsg(res.msg)
        }
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      })
    },
    _initscroll() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.evaluateWrapper, {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    _initGoodsOtherInfo() {
      //初始化商品其他信息：评分，评价内容，上传图片，是否匿名
      let goods = this.orderInfo.goods
      goods.forEach((item, index) => {
        let goodsObj = {
          score: item.score ? item.score : 0,
          rating: item.rating ? item.rating : '',
          picLocalId: item.picLocalId ? item.picLocalId : [],
          picServerId: item.picServerId ? item.picServerId : [],
          picFids: item.picFids ? item.picFids : '',
          unknown: item.unknown ? item.unknown : false
        }
        Object.assign(item, goodsObj)
      })
    },
    changeScore(selectIndex, index) {
      //点击星星后，改变评分
      this.orderInfo.goods[index].score = selectIndex
    },
    setUnknown(index) {
      //设置匿名评价
      this.orderInfo.goods[index].unknown = !this.orderInfo.goods[index].unknown
      this.$set(this.$data.orderInfo.goods, index, this.orderInfo.goods[index])
    },
    deletePic(Pindex, index) {
      //删除图片
      let arrImg = [...[], ...this.orderInfo.goods[Pindex].picLocalId] //不要让vue观察到数据变化
      arrImg.splice(index, 1)
      this.orderInfo.goods[Pindex].picLocalId = arrImg
      this.$set(this.$data.orderInfo.goods, Pindex, this.orderInfo.goods[Pindex])
    },
    uploadPic(Pindex) {
      //添加图片
      if (this.programType === 'H5App') {
        this.$refs.actionsheet.show()
      } else {
        //微网站/小程序入口，调用微信SDK实现上传
        this.wxUpload()
      }
      this.operateGoodsIndex = Pindex
    },
    _getSignData() {
      let _self = this
      let url = location.href.split('#')[0]
      getSignData(_self.openid, url).then(res => {
        let data = res.data
        //配置微信
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['chooseImage', 'uploadImage']
        })
        wx.error(function(err) {
          _self.setToastMsg('验证失败~')
          console.log(err)
        })
      })
    },
    wxUpload() {
      let _self = this
      console.log('进入wxUpload方法')
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log('进入wx.chooseImage方法success回调')
          console.log('res.localIds：' + res.localIds)
          //res.localIds: 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          _self.orderInfo.goods[_self.operateGoodsIndex].picLocalId.push(res.localIds)
          _self.$set(
            _self.$data.orderInfo.goods,
            _self.operateGoodsIndex,
            _self.orderInfo.goods[_self.operateGoodsIndex]
          )
          //上传图片
          wx.uploadImage({
            localId: res.localIds.toString(),
            success: function(res2) {
              console.log('进入wx.uploadImage方法success回调')
              console.log('res.localIds：' + res2.serverId)
              _self.orderInfo.goods[_self.operateGoodsIndex].picServerId.push(
                res2.serverId
              )
              _self.$set(
                _self.$data.orderInfo.goods,
                _self.operateGoodsIndex,
                _self.orderInfo.goods[_self.operateGoodsIndex]
              )
            }
          })
          console.log(_self.orderInfo.goods)
        }
      })
    },
/*
    wxUpload() {
      let _self = this
      console.log('进入wxUpload方法')
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log('进入wx.chooseImage方法success回调')
          console.log('res.localIds：' + res.localIds)
          //res.localIds: 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          _self.orderInfo.goods[_self.operateGoodsIndex].picLocalId.push(res.localIds)
          _self.$set(
              _self.$data.orderInfo.goods,
              _self.operateGoodsIndex,
              _self.orderInfo.goods[_self.operateGoodsIndex]
          )
          //上传图片
          shareFileUpload(formdata).then((res)=>{
            alert('shareFileUpload进来了')
            alert(res)
            alert(res.fid)
          })
          console.log(_self.orderInfo.goods)
        }
      })
    },
*/
    cancel() {
      this.$refs.actionsheet.hide()
    },
    camera() {
      //拍照
      const self = this
      self.$refs.actionsheet.hide()
      self.shoot()
    },
    addFromAlbum() {
      //打开相册
      const self = this
      self.$refs.actionsheet.hide()
      self.openAlbum()
    },
    pageUploadHandle(res) {
      console.log(res.data.fid)
      var newAvatar = avatar(res.data.fid)
      this.orderInfo.goods[this.operateGoodsIndex].picLocalId.push(newAvatar)
      this.$set(
        this.$data.orderInfo.goods,
        this.operateGoodsIndex,
        this.orderInfo.goods[this.operateGoodsIndex]
      )
      this.$refs.actionsheet.hide()
    },
    _formatAppraiseJson(appraiseObj){
      //格式化商品信息为JSON字符串
      let tempAppraiseObj = appraiseObj.map((item,index,arr)=>{
        return {
          goodsId: item.goodsId,
          barCod: item.barCod||'',
          starLevel: item.score,
          message: item.rating,
          files: item.picFids,
          parentId: 0
        }
      })
      let appraiseJson = JSON.stringify(tempAppraiseObj)
      let appraiseJsonClone = appraiseJson.slice(0,appraiseJson.length)
      return appraiseJsonClone
    },
    //发布评论前的数据非空验证
    checkData(){
      if(this.orderInfo.goods.length>0){
        let flag = true
        this.orderInfo.goods.forEach(function(item,index,arr){
          if(item.score === 0 || item.rating === ''){
            flag = false
          }
        })
        return flag
      }
    },
    //发布前先把图片上传到新上传接口uploadFileByWxSdk
    uploadFileByWxSdk(notHasUploadPicsLength){
      if(notHasUploadPicsLength === this.orderInfo.goods.length){
        //如果所有商品都没有上传图片，就不用请求uploadFileByWxSdk接口
        this.orderInfo.goods.forEach(function (item,index,arr) {
          item.picFids = ''
        })
        //添加评论
        this.addOrderAppraise()
      }else {
        //如果有上传评论图片
        let jsonString = this.orderInfo.goods.map(function (item,index,arr) {
          return {
            key: `pic${index}`,
            pictureIds: item.picServerId?item.picServerId.join(','):''
          }
        })
        jsonString = JSON.stringify(jsonString)
        uploadFileByWxSdk(jsonString,this.access_token).then(res => {
          console.log(res)
          if(res.success){
            this.orderInfo.goods.forEach(function (item,index,arr) {
              item.picFids = res.jsonString[index].fids
            })
            //添加评论
            this.addOrderAppraise()
          }else{
            this.setToastMsg(res.msg)
          }
        })
      }
    },
    addOrderAppraise(){
      console.log(this.orderInfo.goods)
      let appraiseJson = this._formatAppraiseJson(this.orderInfo.goods)
      console.log(appraiseJson)
      addOrderAppraise(appraiseJson,this._orderNo,this.userToken).then((res)=>{
        if(res.success){
          this.setToastMsg('发布评价成功')
          this.$router.push('/myorder')
        } else {
          this.setToastMsg(res.msg)
        }
      })
    },
    //上才前判断评论是否有上传图片
    checkUploadPic(){
      let falseCount = 0
      //this.orderInfo.goods[0].picServerId = ['nChIR-wN_JuatoCRVbG8aGlBt3HWkNQILa3YWgeKrqwXH4_McDGZgyx_11SFGUU7','nChIR-wN_JuatoCRVbG8aGlBt3HWkNQILa3YWgeKrqwXH4_McDGZgyx_11SFGUU7']
      this.orderInfo.goods.forEach(function (item,index,arr) {
        if(item.picServerId.length===0){
          falseCount++
        }
      })
      return falseCount
    },
    //发布评论
    release(){
      //发布评论
      if(!this.checkData()){
        this.setToastMsg('请填写评价内容和评分哟！')
        return
      }
      let notHasUploadPicsLength = this.checkUploadPic()
      this.uploadFileByWxSdk(notHasUploadPicsLength)
    },
    ...mapMutations({
      setOrderNo: 'SET_ORDERNO'
    })
  },
  components: {
    MHeader,
    Star,
    Actionsheet
  }
}
</script>

<style type="text/sass" lang="sass">
  @import "../../common/sass/variable"
  @import "../../common/sass/mixin"

  .evaluate
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
    .evaluate-wrapper
      position: fixed
      top: 44/$cale+rem
      bottom: 47/$cale+rem
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
        position: relative
        width: 100%
        box-sizing: border-box
        padding: 8/$cale+rem 0
        background-color: $white
        .box
          flex: 1
          line-height: 20/$cale+rem
          font-size: 14/$cale+rem
          color: $text_color
          border: 0
          resize: none
          padding: 0 10/$cale+rem
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
          .icon-delete
            +bg-image('./icon-delete')
            background-size: 100% 100%
            +size(16/$cale+rem)
            position: absolute
            right: -5/$cale+rem
            top: -5/$cale+rem
          .add-pic
            +bg-image('./upload')
            background-size: 100% 100%
            +size(80/$cale+rem)
            position: absolute
            left: 0
            top: 0
          .totalPic
            line-height: 17/$cale+rem
            font-size: 12/$cale+rem
            color: $text_lighter
            display: inline-block
            padding-top: 50/$cale+rem
          img
            +size(80/$cale+rem)
        .addpic-bg-add
          +size(80/$cale+rem)
          position: relative
      .unknown
        display: flex
        justify-content: space-between
        padding: 10/$cale+rem 0
        margin: 0 10/$cale+rem
        background-color: $white
        border-top: 1px solid $mall-border-base
        .check-area
          font-size: 0
          line-height: 1
          .iconCheck
            display: inline-block
            +bg-image('./uncheck')
            background-size: 100% 100%
            +size(18/$cale+rem)
            margin: 1/$cale+rem 10/$cale+rem 1/$cale+rem 0
            +extend-click()
          .check-txt
            vertical-align: top
            line-height: 20/$cale+rem
            font-size: 14/$cale+rem
            color: $text_color
          &.active
            .iconCheck
              +bg-image('./checked')
        .txt
          color: $text_lighter
    .fixed-release
      position: fixed
      bottom: 0
      left: 0
      +size-height(100%,47/$cale+rem)
      text-align: center
      background-color: $mall-main
      color: $white
</style>