var app = getApp(), api = getApp().api, is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        status: -1,
        order_list: [],
        show_no_data_tip: !1,
        hide: 1,
        qrcode: "",
        showProblemVisible: !1,
        uploadImg: '',
        message: '',
        showQrCodeVisible: !1,
        qrCodeSrc: ''
    },
    onLoad: function (t) {
        getApp().page.onLoad(this, t);
        var e = this;
        app.request({
            url: app.api.user.result,
            success: res => {
                if (0 == res.data.verify || 2 == res.data.verify || null == res.data.verify) {
                    wx.showModal({
                        title: '提示',
                        content: '您还未加入平台,请申请角色',
                        showCancel: !1,
                        confirmText: '我知道了',
                        success: res => {
                            res.confirm && wx.reLaunch({
                                url: '/pages/user/user'
                            })
                        }
                    })
                } else {
                    e.setData({
                        roleStatus: res.data.part_id
                    })
                }
            }
        })
        is_loading = is_no_more = !1, p = 2, e.setData({
            options: t
        }), e.loadOrderList(t.status || -1), getCurrentPages().length < 2 && e.setData({
            show_index: !0
        });
    },
    loadOrderList: function (t) {
        null == t && (t = -1);
        var e = this;
        e.setData({
            status: t
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var a = {
            status: e.data.status
        };
        e.data.options;
        void 0 !== e.data.options.order_id && (a.order_id = e.data.options.order_id), getApp().request({
            url: getApp().api.order.list,
            data: a,
            success: function (t) {
                0 == t.code && (e.setData({
                    order_list: t.data.list,
                    pay_type_list: t.data.pay_type_list
                }), getApp().core.getStorageSync(getApp().const.ITEM) && getApp().core.removeStorageSync(getApp().const.ITEM));
                e.setData({
                    show_no_data_tip: 0 == e.data.order_list.length
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    // 收件点确认订单(无异常情况)
    orderConfirmMy(e) {
        let order_id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '是否确认该订单',
            cancelText: '否',
            confirmText: '是',
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: !0
                    })
                    app.request({
                        url: app.api.logist.done,
                        method: 'POST',
                        data: {
                            order_id: order_id
                        },
                        success: res => {
                            0 == res.code ? (wx.showModal({
                                title: '成功',
                                content: '订单确认成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.redirectTo({
                                        url: '/pages/order/order?status=4'
                                    })
                                }
                            })) : wx.showModal({
                                title: '失败',
                                content: res.msg,
                                showCancel: !1,
                            })
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })
                }
            }
        })
    },
    onClose() {
        this.setData({
            showQrCodeVisible: !1
        }), wx.navigateBack()
    },
    onReachBottom: function () {
        var a = this;
        is_loading || is_no_more || (is_loading = !0, getApp().request({
            url: getApp().api.order.list,
            data: {
                status: a.data.status,
                page: p
            },
            success: function (t) {
                if (0 == t.code) {
                    var e = a.data.order_list.concat(t.data.list);
                    a.setData({
                        order_list: e,
                        pay_type_list: t.data.pay_type_list
                    }), 0 == t.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function () {
                is_loading = !1;
            }
        }));
    },
    orderPay_1: function (e) {
        var a = this, t = a.data.pay_type_list;
        1 == t.length ? (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 == t[0].payment && a.WechatPay(e), 3 == t[0].payment && a.BalancePay(e)) : getApp().core.showModal({
            title: "提示",
            content: "选择支付方式",
            cancelText: "余额支付",
            confirmText: "线上支付",
            success: function (t) {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.confirm ? a.WechatPay(e) : t.cancel && a.BalancePay(e);
            }
        });
    },
    WechatPay: function (t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function () {
                getApp().core.hideLoading();
            },
            success: function (t) {
                0 == t.code && getApp().core.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function (t) {
                    },
                    fail: function (t) {
                    },
                    complete: function (t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? getApp().core.redirectTo({
                            url: "/pages/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function (t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && getApp().core.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    BalancePay: function (t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "BALANCE_PAY"
            },
            complete: function () {
                getApp().core.hideLoading();
            },
            success: function (t) {
                0 == t.code && getApp().core.redirectTo({
                    url: "/pages/order/order?status=1"
                }), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    // 退款
    orderTuiMoney(e) {
        const {id} = e.currentTarget.dataset
        const _this = this
        app.utils.showModal({
            content: '是否退款?',
            cancelText: "否",
            confirmText: "是",
        }).then(res => {
            if (res.confirm) {
                wx.showLoading({
                    title: '加载中',
                    mask: !0
                })
                app.request({
                    url: app.api.logist.refund,
                    method: 'POST',
                    data: {
                        order_id: id
                    },
                    success: res2 => {
                        if (0 == res2.code) {
                            app.utils.showModal({
                                content: res2.msg,
                                showCancel: !1
                            }).then(res3 => {
                                res3.confirm && _this.loadOrderList(_this.data.status);
                            })
                        } else {
                            app.utils.showModal({
                                content: res2.msg,
                                showCancel: !1
                            })
                        }
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                })
            }
        })
    },
    showImage4(e){
        const {src} = e.currentTarget.dataset
        let array = []
        array.push(src + '')
        wx.previewImage({
            urls: array, //需要预览的图片http链接列表，注意是数组
            current: '', // 当前显示图片的http链接，默认是第一个
        })
    },
    // 物流员同意退款
    orderTuiKuan(e) {
        const {id} = e.currentTarget.dataset
        const _this = this
        app.utils.showModal({
            content: '是否同意退款?',
            confirmText: '是',
            cancelText: '否'
        }).then(res => {
            if (res.confirm) {
                wx.showLoading({
                    title: '加载中',
                    mask: !0
                })
                return new Promise(resolve => {
                    app.request({
                        url: app.api.logist.draw,
                        method: 'POST',
                        data: {
                            order_id: id
                        },
                        success: res2 => {
                            resolve(res2)
                        },
                        // complete: () => {
                        //     wx.hideLoading()
                        // }
                    })
                })

                // wx.showLoading({
                //     title: '加载中',
                //     mask: !0
                // })
                //
                // app.request({
                //     url: app.api.logist.draw,
                //     method: 'POST',
                //     data: {
                //         order_id: id
                //     },
                //     success: res2 => {
                //         if (0 == res2.code) {
                //             app.utils.showModal({
                //                 content: res2.msg,
                //                 showCancel: !1
                //             }).then(res3 => {
                //                 res3.confirm && _this.loadOrderList(_this.data.status);
                //             })
                //         } else {
                //             app.utils.showModal({
                //                 content: res2.msg,
                //                 showCancel: !1
                //             })
                //         }
                //     },
                //     complete: () => {
                //         wx.hideLoading()
                //     }
                // })
            }
        }).then(res2=>{
            wx.hideLoading()
            if (res2){
                if (0 == res2.code) {
                    app.utils.showModal({
                        content: res2.msg,
                        showCancel: !1
                    }).then(res3 => {
                        res3.confirm && _this.loadOrderList(_this.data.status);
                    })
                } else {
                    app.utils.showModal({
                        content: res2.msg,
                        showCancel: !1
                    })
                }
            }
        })
    },
    orderRevoke: function (e) {
        var a = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function (t) {
                if (t.cancel) return !0;
                t.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.revoke,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function (t) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function (t) {
                                t.confirm && a.loadOrderList(a.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    onCloseModal() {
        this.setData({
            showProblemVisible: !1
        })
    },
    // diy付款
    orderPayZb(e) {
        let arr = []
        const {id} = e.currentTarget.dataset
        arr.push(id)
        const {price} = e.currentTarget.dataset
        wx.showLoading({
            title: '加载中',
            mask: !0
        }),
            app.request({
                url: app.api.logist.forders,
                method: 'POST',
                data: {
                    order_id: JSON.stringify(arr),
                    money: price
                },
                success: res2 => {
                    if (0 == res2.code) {
                        this.setData({
                            showQrCodeVisible: !0,
                            qrCodeSrc: res2.data
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '系统出错',
                            showCancel: !1
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        this.setData({
            showQrCodeVisible: !0
        })
    },
    // 放大图片
    showImage() {
        let imgUrl = this.data.uploadImg;
        let array = []
        array.push(imgUrl + '')
        wx.previewImage({
            urls: array, //需要预览的图片http链接列表，注意是数组
            current: '', // 当前显示图片的http链接，默认是第一个
        })
    },
    // 放大图片
    showImage2(e) {
        let imgUrl = e.currentTarget.dataset.src;
        let array = []
        array.push(imgUrl + '')
        wx.previewImage({
            urls: array, //需要预览的图片http链接列表，注意是数组
            current: '', // 当前显示图片的http链接，默认是第一个
        })
    },
    onInputMsg(e) {
        this.setData({
            message: e.detail
        })
    },
    cancelSubmit() {
        this.setData({
            message: '',
            uploadImg: ''
        })
    },
    sureSubmit() {
        if ('' == this.data.uploadImg && '' == this.data.message) {
            wx.showModal({
                title: '提示',
                content: '请填写信息后再提交',
                showCancel: !1,
                confirmText: '我知道了'
            })
            this.setData({
                showProblemVisible: !0
            })
        } else {
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            app.request({
                url: app.api.logist.problem,
                method: 'POST',
                data: {
                    order_id: this.data.currentOrderId,
                    problem: this.data.message,
                    problem_photo: this.data.uploadImg
                },
                success: res => {
                    0 == res.code ? (wx.showModal({
                        title: '成功',
                        content: '操作成功',
                        showCancel: !1,
                        success: res => {
                            res.confirm && wx.reLaunch({
                                url: '/pages/order/order?status=5'
                            })
                        }
                    })) : wx.showModal({
                        title: '失败',
                        content: '系统出错',
                        showCancel: !1
                    })
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        }
    },
    deleteImage() {
        this.setData({
            uploadImg: ''
        })
    },
    chooseImage() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                app.core.uploadFile({
                    url: app.api.default.upload_image,
                    name: "image",
                    filePath: tempFilePaths[0],
                    complete: (t) => {
                        if (t.data) {
                            let result = JSON.parse(t.data)
                            // tempFormList[currentIndex].tempImageSrc = result.data.url
                            this.setData({
                                uploadImg: result.data.url
                            })
                        }
                    }
                })
            }
        })
    },
    orderRevoke2(e) {
        let orderId = e.currentTarget.dataset.id
        this.setData({
            showProblemVisible: !0,
            currentOrderId: orderId
        })
        // wx.showLoading({
        //     title:'加载中',
        //     mask: !0
        // })
        // app.request({
        //     url: app.api.logist.problem,
        //     method: 'POST',
        //     data: {
        //         order_id:12,
        //         problem: '',
        //         problem_photo: ''
        //     },
        //     success: res=>{
        //
        //     },
        //     complete: ()=>{
        //         wx.hideLoading()
        //     }
        // })
    },
    orderConfirm: function (e) {
        var a = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function (t) {
                if (t.cancel) return !0;
                t.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.confirm,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function (t) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: t.msg
                        }), 0 == t.code && a.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function (t) {
        var e = this, a = e.data.order_list, o = t.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.order_list[o].offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.order_list[o].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.order.get_qrcode,
            data: {
                order_no: a[o].order_no
            },
            success: function (t) {
                0 == t.code ? e.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function (t) {
        this.setData({
            hide: 1
        });
    },
    onShow: function () {
        getApp().page.onShow(this);
    }
});