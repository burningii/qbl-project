const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },

    scanShapeByScan() {
        wx.scanCode({
            onlyFromCamera: true,
            success: res => {
                let shape = res.result
                let flag = true
                let tempOrderList = this.data.orderList
                tempOrderList.forEach(item => {
                    item.shape == shape ? flag = false : ''
                })
                if (flag) {
                    wx.showLoading({
                        title: '加载中',
                        mask: !0
                    })
                    app.request({
                        url: app.api.logist.shape,
                        method: 'POST',
                        data: {
                            shape: shape || ''
                        },
                        success: res2 => {
                            let tempList = this.data.orderList
                            if (0 == res2.code) {
                              if (''==res2.data.shopname){
                                  wx.showModal({
                                    title: '提示',
                                    content: res2.msg,
                                    showCancel: !1
                                  })
                              }else{
                                tempList.push(res2.data)
                                this.setData({
                                  orderList: tempList
                                })
                              }
                            }else if (1==res2.code){
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
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请勿重复扫码',
                        showCancel: !1
                    })
                }
            }
        })
    },

    // 提交订单
    onSubmitOrder() {
        let tempArray = []
        let tempList = this.data.orderList
        tempList.forEach(item => [
          tempArray.push(item.id)
        ])
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.san,
            method: 'POST',
            data: {
                order_id: tempArray
            },
            success: res => {
                0 == res.code ? (wx.showModal({
                    title: '成功',
                    content: '提交订单成功',
                    showCancel: !1,
                    success: res => {
                        res.confirm && wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })) : 1 == res.code ? (wx.showModal({
                    title: '提示',
                    content: res.msg,
                    showCancel: !1
                })) : wx.showModal({
                    title: '提示',
                    content: '系统错误',
                    showCancel: !1
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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