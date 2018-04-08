import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 新增收货地址
const home = (resolve) => {
        import ('components/home/home').then((module) => {
            resolve(module)
        })
    }
    // 新增收货地址
const AddAddress = (resolve) => {
        import ('components/add-address/add-address').then((module) => {
            resolve(module)
        })
    }
    // 编辑收货地址
const EditAddress = (resolve) => {
        import ('components/edit-address/edit-address').then((module) => {
            resolve(module)
        })
    }
    //管理收货地址
const ManageAddress = (resolve) => {
        import ('components/manage-address/manage-address').then((module) => {
            resolve(module)
        })
    }
    //个人中心
const UserCenter = (resolve) => {
        import ('components/user-center/user-center').then((module) => {
            resolve(module)
        })
    }
    // 类别详情
const typeDetails = (resolve) => {
        import ('components/type-details/type-details').then((module) => {
            resolve(module)
        })
    }
    // 购物车页面
const Shopcart = (resolve) => {
    import ('components/shopcart/shopcart').then((module) => {
        resolve(module)
    })
}

// 商品详情
const goodsDetails = (resolve) => {
    import ('components/goods-details/goods-details').then((module) => {
        resolve(module)
    })
}

// 我的订单
const MyOrder = (resolve) => {
        import ('components/my-order/my-order').then((module) => {
            resolve(module)
        })
    }
    // 我的账户
const MyAccount = (resolve) => {
        import ('components/my-account/my-account').then((module) => {
            resolve(module)
        })
    }
    //我的账户交易详情
const MyAccountDetail = (resolve) => {
        import ('components/my-account-detail/my-account-detail').then((module) => {
            resolve(module)
        })
    }
    // 线上钱包充值
const MyAccountRecharge = (resolve) => {
        import ('components/my-account-recharge/my-account-recharge').then((module) => {
            resolve(module)
        })
    }
    //线上钱包充值协议
const RechargeAgreements = (resolve) => {
        import ('components/recharge-agreements/recharge-agreements').then((module) => {
            resolve(module)
        })
    }
    //账户安全
const AccountSafe = (resolve) => {
        import ('components/account-safe/account-safe').then((module) => {
            resolve(module)
        })
    }
    //意见反馈
const FeedBack = (resolve) => {
        import ('components/feedback/feedback').then((module) => {
            resolve(module)
        })
    }
    //意见反馈成功页面
const FeedbackSuccess = (resolve) => {
        import ('components/feedback-success/feedback-success').then((module) => {
            resolve(module)
        })
    }
    //我的信息
const MyInfo = (resolve) => {
        import ('components/my-info/my-info').then((module) => {
            resolve(module)
        })
    }
    //编辑我的信息
const EditInfo = (resolve) => {
        import ('components/edit-info/edit-info').then((module) => {
            resolve(module)
        })
    }
    //支付密码
const SetPassword = (resolve) => {
        import ('components/set-password/set-password').then((module) => {
            resolve(module)
        })
    }
    // 押金退款申请成功
const RefundSuccess = (resolve) => {
        import ('components/refund-success/refund-success').then((module) => {
            resolve(module)
        })
    }
    //确认订单页面
const ConfirmOrder = (resolve) => {
        import ('components/confirm-order/confirm-order').then((module) => {
            resolve(module)
        })
    }
    //商城订单--订单详情 页面
const OrderDetail = (resolve) => {
        import ('components/order-detail/order-detail').then((module) => {
            resolve(module)
        })
    }
    //商城订单--物流信息 页面
const Logistics = (resolve) => {
        import ('components/logistics/logistics').then((module) => {
            resolve(module)
        })
    }
    //商城订单--评价晒单 页面
const Evaluate = (resolve) => {
        import ('components/evaluate/evaluate').then((module) => {
            resolve(module)
        })
    }
    //商城订单--查看评价 页面
const EvaluateDetail = (resolve) => {
        import ('components/evaluate-detail/evaluate-detail').then((module) => {
            resolve(module)
        })
    }
    // 订单支付成功
const OrderPaySuccess = (resolve) => {
        import ('components/order-pay-success/order-pay-success').then((module) => {
            resolve(module)
        })
    }
    // 押金充值成功
const RechargeSuccess = (resolve) => {
        import ('components/recharge-success/recharge-success').then((module) => {
            resolve(module)
        })
    }
    //我的订单(空间订单)-订单
const OvertimeOrder = (resolve) => {
    import ('components/overtime-order/overtime-order').then((module) => {
        resolve(module)
    })
}

// 终端扫码页面
const Terminal = (resolve) => {
        import ('components/terminal/terminal').then((module) => {
            resolve(module)
        })
    }
    // 红包页面
const MyRed = (resolve) => {
        import ('components/my-red/my-red').then((module) => {
            resolve(module)
        })
    }
    //红包规则
const RedRule = (resolve) => {
    import ('components/red-rule/red-rule').then((module) => {
        resolve(module)
    })
}

//激活页面
const Activation = (resolve) => {
    import ('components/activation/activation').then((module) => {
        resolve(module)
    })
}

//推广中心
const Extend = (resolve) => {
    import ('components/extend/extend').then((module) => {
        resolve(module)
    })
}

//推广说明
const ExtendDesc = (resolve) => {
    import ('components/extend-desc/extend-desc').then((module) => {
        resolve(module)
    })
}

//推广用户列表
const ExtendUserList = (resolve) => {
        import ('components/extend-user-list/extend-user-list').then((module) => {
            resolve(module)
        })
    }
    //拼团用户列表
const FightList = (resolve) => {
        import ('components/fight-list/fight-list').then((module) => {
            resolve(module)
        })
    }
    //交易成功页面(只针对小程序跳转)
const TransactionSucc = (resolve) => {
    import ('components/transaction-succ/transaction-succ').then((module) => {
        resolve(module)
    })
}



Router.prototype.goBack = function() {
    this.isBack = true
    this.go(-1)
}


export default new Router({
    routes: [{
            path: '/'
        }, {
            path: '/home',
            name: 'home',
            component: home,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/addaddress',
            component: AddAddress,
            name: 'addaddress',
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/editaddress',
            component: EditAddress,
            name: 'editaddress',
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/manageaddress',
            component: ManageAddress,
            name: 'manageaddress',
        },
        {
            path: '/typedetails/:id',
            component: typeDetails,
            name: 'typedetails',
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/shopcart',
            component: Shopcart,
            name: 'shopcart',
        },
        {
            path: '/goodsdetails/:id',
            component: goodsDetails,
            name: 'goodsdetails',
            meta: {
                keepAlive: true
            }
        }, {
            path: '/user',
            component: UserCenter,
            name: 'user',
        }, {
            path: '/myorder',
            component: MyOrder,
            name: 'myorder',
        }, {
            path: '/myorder/:orderId',
            component: OvertimeOrder,
            name: 'overtimeorder',
        }, {
            path: '/terminal',
            component: Terminal,
            name: 'terminal'
        },
        {
            path: '/myaccount',
            component: MyAccount,
            name: 'myaccount',
        }, {
            path: '/accountsafe',
            component: AccountSafe,
            name: 'accountsafe',
        }, {
            path: '/myaccountdetail',
            component: MyAccountDetail,
            name: 'myaccountdetail',
        }, {
            path: '/myaccountrecharge',
            component: MyAccountRecharge,
            name: 'myaccountrecharge',
        }, {
            path: '/rechargeagreements',
            component: RechargeAgreements,
            name: 'rechargeagreements',
        }, {
            path: '/feedback',
            component: FeedBack,
            name: 'feedback',
        }, {
            path: '/feedbacksuccess',
            component: FeedbackSuccess,
            name: 'feedbacksuccess'
        }, {
            path: '/myinfo',
            component: MyInfo,
            name: 'myinfo',
        }, {
            path: '/editinfo',
            component: EditInfo,
            name: 'editinfo',
        }, {
            path: '/setpassword',
            component: SetPassword,
            name: 'setpassword',
        }, {
            path: '/refundsuccess',
            component: RefundSuccess,
            name: 'refundsuccess',
        }, {
            path: '/confirmorder',
            component: ConfirmOrder,
            name: 'confirmorder',
        }, {
            path: '/orderdetail/:orderNo',
            component: OrderDetail,
            name: 'orderdetail',
        }, {
            path: '/logistics/:orderNo',
            component: Logistics,
            name: 'logistics',
        }, {
            path: '/evaluate/:orderNo',
            component: Evaluate,
            name: 'evaluate',
        }, {
            path: '/evaluatedetail',
            component: EvaluateDetail,
            name: 'evaluatedetail',
        }, {
            path: '/orderpaysuccess',
            component: OrderPaySuccess,
            name: 'orderpaysuccess'
        }, {
            path: '/rechargesuccess',
            component: RechargeSuccess,
            name: 'rechargesuccess'
        }, {
            path: '/myred',
            component: MyRed,
            name: 'myred',
        }, {
            path: '/redrule',
            component: RedRule,
            name: 'redrule',
        },
        {
            path: '/activation',
            component: Activation,
            name: 'activation',
        },
        {
            path: '/extend',
            component: Extend,
            name: 'extend',
        },
        {
            path: '/extenddesc',
            component: ExtendDesc,
            name: 'extenddesc',
        },
        {
            path: '/extenduserlist',
            component: ExtendUserList,
            name: 'extenduserlist',
        },
        {
            path: '/fightlist',
            component: FightList,
            name: 'fightlist',
        },
        {
            path: '/transactionsucc',
            component: TransactionSucc,
            name: 'transactionsucc',
        },

    ]
})