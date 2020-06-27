const app = getApp(),site = require('../../siteinfo')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        pwd: '',
        radio: '1'
    },

    onChangeInput(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            this.setData({username: e.detail.replace(/\s*/g, "")})
        } else if ('2' == f) {
            this.setData({pwd: e.detail.replace(/\s*/g, "")})
        }
    },

    onClick(e) {
        const {name} = e.currentTarget.dataset
        this.setData({
            radio: name,
        })
    },

    // 立即代付
    goPayNow() {
        if ('' == this.data.pwd) return wx.showModal({
            title: '提示',
            content: '手机号不能为空',
            showCancel: !1,
        }), !1

        if ('1' == this.data.radio) { // 微信
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            wx.request({
                url:app.api.order.pay_data,
                method: 'GET',
                data: {
                    _acid: site.acid,
                    r: 'api/order/pay-data',
                    order_id_list: this.data.orderidList,
                    pay_type: 'WECHAT_PAY',
                    condition: 2,
                    parent_user_id: this.data.parent_id,
                    access_token: wx.getStorageSync('ACCESS_TOKEN2') || wx.getStorageSync('ACCESS_TOKEN'),
                    names: this.data.username,
                    phones: this.data.pwd,
                    _version: '2.8.9',
                    _platform: 'wx'
                },
                header: {
                    'content-type':"application/x-www-form-urlencoded"
                },
                success:res=>{
                    console.log('返回结果为: ', res);
                    const data = res.data
                    if (0 == data.code) {
                        wx.requestPayment({
                            'timeStamp': data.data.timeStamp,
                            'nonceStr': data.data.nonceStr,
                            'package': data.data.package,
                            'signType': 'MD5',
                            'paySign': data.data.paySign,
                            'success': res2 => {
                                wx.showModal({
                                    title: '提示',
                                    content: '支付成功',
                                    showCancel: !1,
                                    success: res3 => {
                                        if (res3.confirm) {
                                            wx.reLaunch({
                                                url: '/pages/index/index'
                                            })
                                        }
                                    }
                                })
                            },
                            'fail': err => {
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none'
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: data.msg,
                            showCancel: !1,
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        } else {
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            wx.request({
                url: app.api.order.pay_data,
                method: 'GET',
                data: {
                    _acid: site.acid,
                    r: 'api/order/pay-data',
                    order_id_list: this.data.orderidList,
                    pay_type: 'BALANCE_PAY',
                    condition: 2,
                    parent_id: this.data.parent_id,
                    access_token: wx.getStorageSync('ACCESS_TOKEN2') || wx.getStorageSync('ACCESS_TOKEN'),
                    names: this.data.username,
                    phones: this.data.pwd,
                    _version: '2.8.9',
                    _platform: 'wx'
                },
                success: res => {
                    const data = res.data
                    console.log('返回结果为: ', res);
                    if (0 == data.code) {
                        wx.showModal({
                            title: '提示',
                            content: '支付成功',
                            showCancel: !1,
                            success: res3 => {
                                if (res3.confirm) {
                                    wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: data.msg,
                            showCancel: !1,
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        }


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options);
        options.order_id_list && this.setData({orderidList: JSON.parse(options.order_id_list)})
        options.parent_id && this.setData({parent_id: options.parent_id})
        options.price && this.setData({pay_money: JSON.parse(options.price)})
    },

    onChange(e) {
        this.setData({
            radio: e.detail
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.page.onShow(this)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})