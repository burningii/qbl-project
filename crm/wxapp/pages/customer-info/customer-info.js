const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customerInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '客户详情'
        })
        options.id && this.setData({id: options.id}), this.loadData()
    },

    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'getCustomerInfo',
            data: {
                id: this.data.id
            },
        }).then(res => {
            const result = res.data
            if (0 == result.code) {
                this.setData({
                    customerInfo: result.data
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.msg,
                    showCancel: !1,
                })
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