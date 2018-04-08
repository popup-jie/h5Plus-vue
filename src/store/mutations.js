import * as types from './mutation-types'

const mutations = {
    [types.SET_TOAST_MSG](state, msg) {
        state.toastMsg = msg
    },
    [types.SET_USER_TOKEN](state, token) {
        state.userToken = token
    },
    [types.SET_USER_INFO_ID](state, id) {
        state.userInfoId = id
    },
    [types.SET_INFO_FLAG](state, infoFlag) {
        state.infoFlag = infoFlag
    },
    [types.SET_HAS_ZFMM](state, haszfmm) {
        state.haszfmm = haszfmm
    },
    [types.SET_USER_WALLET_MONEY](state, userWalletMoney) {
        state.userWalletMoney = userWalletMoney
    },
    [types.SET_FORGET_PWD](state, forgetPwd) {
        state.forgetPwd = forgetPwd
    },
    [types.SET_CATEGORY_ID](state, id) {
        state.categoryId = id
    },
    [types.SET_GOODSID](state, id) {
        state.goodsid = id
    },
    [types.SET_HIDDENHTAB](state, flg) {
        state.hiddenHTab = flg
    },
    [types.SET_HIDDENFTAB](state, flg) {
        state.hiddenFTab = flg
    },
    [types.SET_PROGRAMTYPE](state, str) {
        state.programType = str
    },
    [types.SET_OPENID](state, str) {
        state.openid = str
    },
    [types.SET_USER_MOBILE](state, mobile) {
        state.mobile = mobile
    },
    [types.SET_ORDERNO](state, no) {
        state.orderNo = no
    },
    [types.SET_RED_PACKET_MONEY](state, redPacketMoney) {
        state.redPacketMoney = redPacketMoney
    },
    [types.SET_USER_WALLET_ID](state, userWalletId) {
        state.userWalletId = userWalletId
    },
    [types.SET_ORDER_GOODS_IDS](state, orderGoodsIds) {
        state.orderGoodsIds = orderGoodsIds
    },
    [types.SET_THEMEID](state, themeId) {
        state.themeId = themeId
    },
    [types.SET_GOODSJSON](state, goodsJson) {
        state.goodsJson = goodsJson
    },
    [types.SET_VISIT_BOOK_RETEMPID](state, visitBookRetempId) {
        state.visitBookRetempId = visitBookRetempId
    },
    [types.SET_WXUNIONID](state, wxunionid) {
        state.wxunionid = wxunionid
    },
    [types.SET_REFERRALCODE](state, referralCode) {
        state.referralCode = referralCode
    },
    [types.SET_ISSUPERVIP](state, vip) {
        state.IsSuperVip = vip
    },
    [types.SET_SHARE_THUMBS](state, shareThumbs) {
        state.shareThumbs = shareThumbs
    },
    [types.SET_INVITE_TITLE](state, inviteTitle) {
        state.inviteTitle = inviteTitle
    },
    [types.SET_INVITE_CONTENT](state, inviteContent) {
        state.inviteContent = inviteContent
    },
    [types.SET_USERAVATAR](state, str) {
        state.userAvatar = str
    },
    [types.SET_USERNICKNAME](state, str) {
        state.userNickName = str
    },


}

export default mutations