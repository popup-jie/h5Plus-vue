const state = {
  toastMsg: '', //弹窗信息
  userToken: '', //用户token
  // userToken: '',
  userInfoId: '',
  infoFlag: '', //从我的信息页跳转至信息编辑页 显示对应的输入框
  haszfmm: false, //是否有支付密码
  userWalletMoney: 0, //用户线上钱包金额
  forgetPwd: false, //是否点击找回密码跳转
  categoryId: '', //分类id
  goodsid: '', //商品id
  hiddenHTab: false, // 是否隐藏头部 默认不隐藏
  hiddenFTab: true, // 是否隐藏底部 默认不隐藏
  programType: 'H5App', //程序入口 microweb 微网站 H5App 菁葶APP wechat 微信 alipay 支付宝 默认值：微网站 从菁葶APP和微信小程序进来都需要隐藏
  openid: '', //微信用户
  mobile: '13682473985', //手机号
  orderNo: '', //订单编号
  redPacketMoney: '', //红包金额
  userWalletId: 0, //红包id
  orderGoodsIds: '0', //倾停空间订单详情页商品id
  themeId: 0, //云八id
  goodsJson: '', //商品信息json字符串，格式：[{'id':商品id,'specificationsId':规格id,'num':数量}]
  visitBookRetempId: '', //拜帖临时表ID
  referralCode: '', //邀请码
  wxunionid: '', //微信unid
  IsSuperVip: false, //是否是超级会员 默认不是
  shareThumbs: 'http://120.76.155.216/file/file/preview/bWFsbENhdGVJbWclMkYyMDE4MDExNiUyRjQ5MTEwNjFmZjFlZDRhN2JhZTY4Y2Y3NDYwODk0MjdkX2xBTFBCYkNjMVZRY3Back5BVlROQVdnXzM2MF8zNDAucG5n', //分享缩略图
  inviteTitle: '菁小咖邀您一起参与拼团', //分享标题
  inviteContent: '菁小咖 不寻常', //分享内容
  userAvatar: '', //用户头像
  userNickName: '', //用户昵称
}

export default state
