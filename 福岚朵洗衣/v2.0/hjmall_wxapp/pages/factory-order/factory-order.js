const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadData()
    },

    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.factory,
            method: 'POST',
            success: res => {
                1 == res.code ? (wx.showModal({
                    title: '失败',
                    content: res.msg,
                    showCancel: !1,
                    confirmText: '我知道了',
                    success: res2 => {
                        res2.confirm && wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })) : 0==res.code?(
                    console.log(res.data),this.setData({
                      orderList:res.data
                    })
                ): ''
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