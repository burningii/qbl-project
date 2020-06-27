const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // if (options.order_id) {
        //     this.setData({
        //         order_id: options.order_id
        //     })
        //     this.loadOrderData()
        // } else {
        //     wx.showModal({
        //         title: '提示',
        //         content: '未检测到order_id',
        //         showCancel: !1
        //     })
        // }
    },

    testQrcode() {
        wx.scanCode({
            success: res => {
                console.log(res)
                const order_id = res.result
                wx.showLoading({
                    title: '加载中',
                    mask: !0
                })
                app.request({
                    // url: app.api.logist.forder,
                    url: app.api.logist.imges,
                    method: 'POST',
                    data: {
                        order_id: order_id
                    },
                    success: res2 => {
                        if (0 == res2.code) {
                            if (null == res2.data) {
                                wx.showModal({
                                    title: '提示',
                                    content: '未检测到该订单信息',
                                    showCancel: !1
                                })
                            } else {
                                let newArray = []
                                newArray.push(res2.data)
                                this.setData({
                                    order: newArray
                                })
                            }
                        } else {
                            wx.showModal({
                                title: '提示',
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

    // 衣服出库
    cuku_item(e) {
        let order_id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '是否出库',
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
                                content: '出库成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.navigateBack()
                                }
                            })) : wx.showModal({
                                title: '失败',
                                content: '出库失败',
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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