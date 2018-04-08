import {
    mapMutations,
    mapGetters,
    mapState
} from 'vuex'
import {
    uploadFile
} from '../../api/file'
import {
    serverUrlPrefix,
    serverUrlSuffix
} from 'api/config'
import {
    getSignData
} from 'api/getSignData'
import {
    formatTime,
    initformatTime
} from 'common/js/tools'


export const setToastMsg = {
    methods: {
        ...mapMutations({
            setToastMsg: 'SET_TOAST_MSG'
        })
    }
}

export const plusMixns = {
    methods: {
        plusReady() {}
    },
    mounted() {
        const self = this
        if (window.plus) {
            self.plusReady()
        } else {
            document.addEventListener('plusready', self.plusReady, false)
        }
        document.addEventListener(
            'DOMContentLoaded',
            function() {
                self.domready = true
                self.plusReady()
            },
            false
        )
    }
}


export const uploadMixins = {
    data() {
        return {
            showCropper: false,
            imgPath: '',
            fileName: '',
            needCropper: true
        }
    },
    methods: {
        shoot() {
            //拍摄
            const self = this
                // 获取摄像头管理对象
            var cmr = plus.camera.getCamera()
                // 摄像头支持的摄像分辨率
            var res = cmr.supportedImageResolutions[0]
                // 摄像头支持的拍照文件格式
            var fmt = cmr.supportedImageFormats[0]
            cmr.captureImage(function(p) {
                plus.io.resolveLocalFileSystemURL(p, function(entry) {
                    var path = entry.fullPath
                    if (plus.os.name == 'iOS') {
                        path = 'file://' + path
                    }
                    if (self.needCropper) {
                        self.resolveFile(path)
                    } else {
                        self.clipImage(path, path.substr(path.lastIndexOf('/') + 1))
                    }
                }, function(e) {
                    plus.nativeUI.closeWaiting()
                    plus.nativeUI.alert('拍照失败')
                })
            })
        },
        openAlbum() {

            //打开相册
            const self = this
            plus.gallery.pick(
                function(path) {
                    if (self.needCropper) {
                        self.resolveFile(path)
                    } else {
                        plus.nativeUI.showWaiting("处理中...")
                        self.clipImage(path, path.substr(path.lastIndexOf('/') + 1))
                    }
                },
                function(e) {
                    plus.nativeUI.closeWaiting()
                        //plus.nativeUI.alert('打开相册失败')
                }, {
                    filter: 'image'
                }
            )
        },
        resolveFile(path) {
            const self = this
            plus.io.resolveLocalFileSystemURL(path, function(entry) {
                var reader = null;
                // 可通过entry对象操作文件
                entry.file(function(file) {
                    reader = new plus.io.FileReader();
                    reader.onloadend = function(e) {
                        var base64 = e.target.result
                        var fileName = path.substr(path.lastIndexOf('/') + 1)
                        if (self.needCropper) { //上传图片需要裁剪
                            self.imgPath = base64
                            self.fileName = fileName
                            self.showCropper = true
                        } else { //上传图片不需要裁剪
                            //图片上传
                            var fileString = base64.toString().split(',')[1]
                            console.log('fileString:' + fileString)
                            console.log('fileName:' + fileName)
                            self.uploadToServer(fileName, fileString)
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }, function(e) {
                plus.nativeUI.closeWaiting()
                plus.nativeUI.alert('解析文件失败')
            });
        },
        cropperBack() {
            this.showCropper = false
        },
        clipImage(oldPath, filename) {
            const self = this
            var newPath = '_doc/upload/' + filename
            console.log("oldPath:" + oldPath)
            console.log("newPath:" + newPath)
                //压缩裁剪图片
            plus.zip.compressImage({
                    src: oldPath,
                    dst: newPath,
                    quality: 80, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
                    overwrite: true, //overwrite: (Boolean 类型 )覆盖生成新文件
                    //clip:{top:"25%",left:"0",width: '100%',height:'50%'}		// 裁剪图片中心区域
                },
                function(event) {
                    var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
                    var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
                    var width = event.width; // 压缩转换后图片的实际宽度，单位为px
                    var height = event.height; // 压缩转换后图片的实际高度，单位为px
                    console.log("target:" + target)
                    console.log("size:" + size)
                    console.log("width:" + width)
                    console.log("height:" + height)
                    self.resolveFile(target)
                },
                function(error) {
                    alert("Compress error!");
                });
        },
        upload(base64) {
            console.log('base64:' + base64)
            console.log('fileName:' + this.fileName)
            this.uploadToServer(this.fileName, base64)
        },
        uploadToServer(fileName, fileString) {
            const self = this
            uploadFile(fileName, fileString).then(res => {
                console.log('进入uploadFile接口')
                if (res.status === 200) {
                    plus.nativeUI.closeWaiting()
                    self.pageUploadHandle(res)
                    self.showCropper = false
                } else {
                    plus.nativeUI.closeWaiting()
                    plus.nativeUI.alert('上传文件失败')
                }
            })
        },
        pageUploadHandle(res) {
            //调用页面上传图片成功后其他业务逻辑处理放于此方法内
            console.log('进入mixin')
        }
    }
}


export const initPage = {
    computed: {
        ...mapGetters(['hiddenHTab', 'hiddenFTab'])
    },
    methods: {
        _initPage(el, _close) {
            el = el.$el || el
            if (this.hiddenHTab) {
                el.style.top = '0px'
            }
            if (this.hiddenFTab && !_close) {
                el.style.bottom = '0px'
            }
        }
    }
}

// 微信反馈意见
export const wechatpage = {
    computed: {
        ...mapGetters(['programType', 'openid'])
    },
    data() {
        return {
            images: {
                localId: [],
                serverId: []
            }
        }
    },
    methods: {
        weChatReady() {
            var url = location.href;
            $.ajax({
                url: "../../wxConfig/getSignData",
                type: "get",
                data: {
                    openId: this.openid,
                    url: url
                },
                dataType: "json",
                success: function(data) {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            // 必填，需要使用的JS接口列表  所有要调用的 API 都要加到这个列表中
                            'chooseImage',
                            'uploadImage'
                        ]
                    });
                    wx.error(function(res) {
                        alert("验证失败~");
                    });
                },
                error: function(data) {
                    alert("微信验证出错~");
                }
            });
        },
        weChatImage() {
            const self = this
            wx.chooseImage({
                count: 1,
                success: function(res) {
                    var length1 = images.localId.length;
                    images.localId[length1] = res.localIds;
                    var i = 0,
                        length = images.localId.length;
                    // let images = res.localIds[0].toString();
                    //上传图片
                    wx.uploadImage({
                        localId: images,
                        success: function(res) {
                            this.mediaId = res.serverId
                        }
                    })
                }
            });
        },
        weChatDone(content, email) {
            //返回意见结束
            //这里要走本地上传接口
            $.post('../../fault/saveOpinionFeedBack', {
                    content: content,
                    openId: this.openid,
                    email: email,
                    pictureIds: this.mediaId
                },
                (data) => {

                }, 'json'
            );
        },
        //这里拿回本地ID
        weChatLocationUrl() {
            // this.mediaId 当前图片路径
            // $(img).attr('src,mediaId)
        }
    }
}

//微信支付配置
export const wxPay = {
    created() {
        this.wxPayConfig()
    },
    activated() {
        this.wxPayConfig()
    },
    methods: {
        wxPayConfig() {
            let _self = this
            let url = location.href.split('#')[0]
            if (this.programType === 'microweb') {
                getSignData(_self.openid, url).then(res => {
                    let data = res.data
                        //配置微信
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'chooseWXPay'
                        ]
                    })
                    wx.error(function(err) {
                        _self.setToastMsg('验证失败~')
                    })
                })
            }
        }
    }
}

// 微信右上角分享
export const share = {
    computed: {
        ...mapGetters(['programType', 'openid'])
    },
    data() {
        return {
            title: '',
            thumbs: 'http://120.76.155.216/file/file/preview/bWFsbENhdGVJbWclMkYyMDE4MDExNiUyRjQ5MTEwNjFmZjFlZDRhN2JhZTY4Y2Y3NDYwODk0MjdkX2xBTFBCYkNjMVZRY3Back5BVlROQVdnXzM2MF8zNDAucG5n',
            content: '轻松工作，轻奢生活'
        }
    },
    created() {
        // this.inviteFriend(url)
    },
    methods: {
        allKindShareHref(url) {
            if (this.programType === 'microweb') {
                // console.log('进入微网站分享')
                return serverUrlPrefix + `programType=microweb&${url}` + serverUrlSuffix
            } else if (this.programType === 'wechat') {
                return '&' + url
            }
        },
        _shareDetail(paramsurl) {
            // console.log('paramsurl=' + paramsurl)
            let shareUrl = this.allKindShareHref(paramsurl)
                // console.log('shareUrl =' + shareUrl)
            let _self = this
            let url = location.href.split('#')[0]
            if (this.programType === 'microweb') {
                getSignData(_self.openid, url).then(res => {
                    let data = res.data
                        //配置微信
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareQZone',
                            'chooseWXPay'
                        ]
                    })
                    wx.ready(function() {
                        wx.onMenuShareTimeline({
                            //分享到朋友圈
                            title: _self.title, // 分享标题
                            link: shareUrl, // 分享链接
                            imgUrl: _self.thumbs, // 分享图标
                        });
                        wx.onMenuShareAppMessage({
                            //分享给朋友
                            title: _self.title, // 分享标题
                            desc: _self.content, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: _self.thumbs, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function() {
                                _self.setToastMsg('分享成功')
                            },
                            cancel: function() {
                                _self.setToastMsg('分享取消')
                            }
                        });
                        wx.onMenuShareQQ({ //分享到QQ
                            title: _self.title, // 分享标题
                            desc: _self.content, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: _self.thumbs // 分享图标
                        });
                        wx.onMenuShareQZone({ //分享到QQ空间
                            title: _self.title, // 分享标题
                            desc: _self.content, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: _self.thumbs // 分享图标
                        })

                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    })

                    wx.error(function(err) {
                        _self.setToastMsg('验证失败~')
                    })
                })
            } else if (window.__wxjs_environment === 'miniprogram') {
                wx.miniProgram.postMessage({
                    data: {
                        'webViewUrl': shareUrl,
                        'title': _self.title
                    }
                })
            }
        }
    }
}

export const CountDown = {
    data() {
        return {
            pingdanList: []
        }
    },
    methods: {
        //数据源 时间字段 计时器名字 回调函数
        _getFormatTime(_arr, mtype, timerName, cb, isDel) {
            timerName = null
            clearInterval(timerName)
            _arr = initformatTime(_arr, mtype)
            _arr = this._formatTime(_arr, mtype, timerName, isDel)
            cb && cb(_arr)
            timerName = setInterval(() => {
                _arr = this._formatTime(_arr, mtype, timerName, isDel)
                cb && cb(_arr, timerName)
            }, 1000)
        },
        _formatTime(_arr, mtype, timerName, isDel) {
            _arr = formatTime(_arr, mtype)
            if (isDel) {
                for (let i = 0; i < _arr.length; i++) {
                    if (!_arr[i].extratime.isShow) {
                        _arr.splice(i, 1)
                    }
                }
                if (_arr.length == 0) {
                    clearInterval(timerName)
                }
            }
            return _arr
        }
    }
}