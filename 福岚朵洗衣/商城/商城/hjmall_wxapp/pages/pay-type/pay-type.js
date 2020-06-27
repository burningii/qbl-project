const app = getApp()
Page({
    data: {
        radio: '1',
        pay_money: ''
    },
    onLoad(options) {
        console.log('加载参数');
        console.log(options);
        if (options.order_id && options.money) {
            this.setData({
                order_id_list: JSON.parse(options.order_id),
                pay_money: options.money
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '参数不正确',
                showCancel: !1,
                success: res => {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                }
            })
        }
    },
    onClick(e) {
        const {name} = e.currentTarget.dataset
        this.setData({
            radio: name
        })
    },
    onChange(event) {
        this.setData({
            radio: event.detail
        });
    },
    // 立即支付
    order_pay_now() {
        const {radio} = this.data
        const {order_id_list = []} = this.data,
            {pay_money} = this.data
        if (!wx.getStorageSync('ACCESS_TOKEN')) return wx.showModal({
            title: '提示',
            content: '无效的token，请重新登录',
            showCancel: !1,
            success: res => {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/user/user'
                    })
                }
            }
        }), !1

        if ('1' == radio) { // 微信支付
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.order.wxpay,
                method: 'POST',
                data: {
                    order_id: JSON.stringify(order_id_list),
                    money: pay_money
                },
                success: res => {
                    if (0 == res.code) {
                        wx.requestPayment({
                            'timeStamp': res.data.timeStamp,
                            'nonceStr': res.data.nonceStr,
                            'package': res.data.package,
                            'signType': 'MD5',
                            'paySign': res.data.paySign,
                            'success': res2 => {
                                wx.showModal({
                                    title: '提示',
                                    content: '支付成功',
                                    showCancel: !1,
                                    success: res => {
                                        res.confirm && setTimeout(() => {
                                            wx.reLaunch({
                                                url: '/pages/index/index'
                                            })
                                        }, 500)
                                    }
                                })
                            },
                            'fail': err => {
                                wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    success: function (e) {
                                        e.confirm && wx.reLaunch({
                                            url: '/pages/order/order' + "?status=0"
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        } else { // 余额支付
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            new Promise((resolve, reject) => {
                app.request({
                    url: app.api.user.member,
                    method: "POST",
                    success: res => {
                        resolve(res)
                    }
                })
            }).then(res => {
                wx.hideLoading()
                if (0 == res.code) {
                    if (Number(pay_money) > res.data.money) {
                        wx.showModal({
                            title: '提示',
                            content: '您的余额不足',
                            showCancel: !1
                        })
                    } else if (Number(pay_money) <= res.data.money) {
                        _pay_now(res.data.money) // 立即支付
                    }
                } else {
                    wx.showToast({
                        title: '获取余额失败',
                        icon: 'none',
                        duration: 2500
                    })
                }
            })

            // 立即支付
            function _pay_now(money) {
                wx.showModal({
                    title: '提示',
                    content: `您当前余额${money}，是否继续支付`,
                    confirmText: '是',
                    cancelText: '否',
                    success: res => {
                        if (res.confirm) {
                            wx.showLoading({
                                title: '提交中',
                                mask: !0
                            }), app.request({
                                url: app.api.order.yepay,
                                method: 'POST',
                                data: {
                                    order_id: JSON.stringify(order_id_list),
                                    money: pay_money
                                },
                                success: res2 => {
                                    if (0==res2.code){
                                        wx.showModal({
                                            title: '提示',
                                            content: '支付成功',
                                            showCancel: !1,
                                            success: res => {
                                                res.confirm && setTimeout(() => {
                                                    wx.reLaunch({
                                                        url: '/pages/index/index'
                                                    })
                                                }, 500)
                                            }
                                        })
                                    }else{
                                        wx.showModal({
                                            title: '提示',
                                            content: res2.msg,
                                            showCancel: !1,
                                        })
                                    }

                                },
                                complete: () => {
                                    wx.hideLoading()
                                }
                            })
                        }
                    }
                })
            }
        }
    },
    onShow() {

    },
    onReachBottom() {

    },
    onReady() {

    },
    onHide() {

    },
    onUnload() {

    },
})