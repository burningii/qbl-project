const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.id && this.setData({id: options.id})
        options.status && this.setData({status: options.status})
        this.loadData()
    },

    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.logist.logdet,
            method: 'POST',
            data: {
                sates: this.data.status,
                id: this.data.id
            },
            success: res => {
                console.log('详情数据为: ', res);
                if (0 == res.code) {
                    this.setData({list: res.data})
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