var is_no_more = !1, is_loading = !1, p = 2;
const app = getApp()
Page({
    data: {
        hide: 1,
        qrcode: "",
        inputValue: '',
        startValue: '',
        endValue: '',
        currentInput: 1,
        queryResult: [], // 搜索结果
        showQrCodeVisible: !1,
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        currentDate: new Date().getDate()
    },
    onLoad: function (e) {
        getApp().page.onLoad(this, e);
        is_loading = is_no_more = !1, p = 2, this.loadOrderList(e.status || -1);
    },

    getCalendarData(e) {
        let dateString = e.detail.currentYear + "-" + e.detail.currentMonth + "-" + e.detail.nowDate
        if (1 == this.data.currentInput) {
            this.setData({
                startValue: dateString
            })
        } else if (2 == this.data.currentInput) {
            this.setData({
                endValue: dateString
            })
        }
    },

    onClose() {
        this.setData({
            showQrCodeVisible: !1
        })
    },

    // 高级筛选
    nowQueryBy() {
        if ('' == this.data.startValue || '' == this.data.endValue) {
            wx.showModal({
                title: '提示',
                content: '您暂未选择时间',
                confirmText: "关闭",
                showCancel: !1
            })
            return
        }

        app.request({
            url: app.api.logist.search,
            method: 'POST',
            data: {
                start_time: this.data.startValue,
                end_time: this.data.endValue
            },
            success: res => {
                0 == res.code ? (this.setData({
                    queryResult: res.data,
                }), this.setData({
                    showQrCodeVisible: !1
                }), res.data.length == 0 && wx.showModal({
                    title: '提示',
                    content: '未搜索到数据',
                    showCancel: !1
                })) : wx.showModal({
                    title: '提示',
                    content: res.msg,
                    showCancel: !1
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })

    },

    onFouces(e) {
        if (1 == e.currentTarget.dataset.flag) {
            this.setData({
                currentInput: 1
            })
        } else if (2 == e.currentTarget.dataset.flag) {
            this.setData({
                currentInput: 2
            })
        }
    },

    onChange() {
        this.setData({
            startValue: '',
            endValue: '',
        })
    },

    // 立即搜索
    queryNow() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.search,
            method: 'POST',
            data: {
                key: this.data.inputValue
            },
            success: res => {
                0 == res.code && (this.setData({
                    queryResult: res.data
                }), 0 == res.data.length && wx.showModal({
                    title: '提示',
                    content: '未搜索到数据',
                    showCancel: !1
                }))
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    // 展示日历组件
    showCalendar() {
        this.setData({
            showQrCodeVisible: !0
        })
    },
    onReady: function (e) {
        getApp().page.onReady(this);
    },
    onShow: function (e) {
        getApp().page.onShow(this);
    },
    onHide: function (e) {
        getApp().page.onHide(this);
    },
    onUnload: function (e) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function (e) {
        getApp().page.onPullDownRefresh(this);
    },
    onInputValue(e) {
        this.setData({
            inputValue: e.detail
        })
    },
    onReachBottom: function (e) {
        getApp().page.onReachBottom(this);
        var o = this;
        is_loading || is_no_more || (is_loading = !0, getApp().request({
            url: getApp().api.book.order_list,
            data: {
                status: o.data.status,
                page: p
            },
            success: function (e) {
                if (0 == e.code) {
                    var t = o.data.order_list.concat(e.data.list);
                    o.setData({
                        order_list: t,
                        pay_type_list: e.data.pay_type_list
                    }), 0 == e.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function () {
                is_loading = !1;
            }
        }));
    },
    loadOrderList: function (e) {
        null == e && (e = -1);
        var t = this;
        t.setData({
            status: e
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.order_list,
            data: {
                status: t.data.status
            },
            success: function (e) {
                0 == e.code && t.setData({
                    order_list: e.data.list,
                    pay_type_list: e.data.pay_type_list
                }), t.setData({
                    show_no_data_tip: 0 == t.data.order_list.length
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    orderCancel: function (e) {
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var t = e.currentTarget.dataset.id;
        getApp().request({
            url: getApp().api.book.order_cancel,
            data: {
                id: t
            },
            success: function (e) {
                0 == e.code && getApp().core.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    GoToPay: function (e) {
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.order_pay,
            data: {
                id: e.currentTarget.dataset.id
            },
            complete: function () {
                getApp().core.hideLoading();
            },
            success: function (e) {
                0 == e.code && getApp().core.requestPayment({
                    _res: e,
                    timeStamp: e.data.timeStamp,
                    nonceStr: e.data.nonceStr,
                    package: e.data.package,
                    signType: e.data.signType,
                    paySign: e.data.paySign,
                    success: function (e) {
                    },
                    fail: function (e) {
                    },
                    complete: function (e) {
                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? getApp().core.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function (e) {
                                e.confirm && getApp().core.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == e.code && getApp().core.showToast({
                    title: e.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToDetails: function (e) {
        getApp().core.navigateTo({
            url: "/pages/book/order/details?oid=" + e.currentTarget.dataset.id
        });
    },
    orderQrcode: function (e) {
        var t = this, o = e.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), t.data.order_list[o].offline_qrcode ? (t.setData({
            hide: 0,
            qrcode: t.data.order_list[o].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.book.get_qrcode,
            data: {
                order_no: t.data.order_list[o].order_no
            },
            success: function (e) {
                0 == e.code ? t.setData({
                    hide: 0,
                    qrcode: e.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function (e) {
        this.setData({
            hide: 1
        });
    },
    applyRefund: function (e) {
        var t = e.target.dataset.id;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.apply_refund,
            data: {
                order_id: t
            },
            success: function (e) {
                0 == e.code ? getApp().core.showModal({
                    title: "提示",
                    content: "申请退款成功",
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/book/order/order?status=3"
                        });
                    }
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    comment: function (e) {
        getApp().core.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + e.target.dataset.id,
            success: function (e) {
            },
            fail: function (e) {
            },
            complete: function (e) {
            }
        });
    }
});