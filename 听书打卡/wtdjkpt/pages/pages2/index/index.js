const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lessionList: [121, 21, 2],
        lessionList2: [1, 312, 3123, 312123]
    },

    // 去课程播放
    goLession(e) {
        wx.navigateTo({
            url: `/pages/pages2/play/index`
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadMyCourse()
    },

    // 加载我的课程
    loadMyCourse() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.order.list,
            data: {
                status: 3
            },
            success: res => {
                console.log(res);
                if (0 == res.code) {
                    this.setData({lessionList: res.data.list})
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
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