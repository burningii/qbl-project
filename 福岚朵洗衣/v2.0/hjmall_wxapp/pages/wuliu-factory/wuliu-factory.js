const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showQrCodeVisible: !1,
        qrCodeSrc: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.flag) {
            this.setData({
                flag: options.flag
            })
        }
    },

    onClose() {
        this.setData({
            showQrCodeVisible: !1
        })
    },

    navToScanPage() {
        if (this.data.flag && 1 == this.data.flag) {
            wx.navigateTo({
                url: '/pages/navto-scan6/navto-scan'
            })
        } else {
            wx.navigateTo({
                url: '/pages/navto-scan/navto-scan'
            })
        }

    },

    // 物流员展示二维码
    showQrCode() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.codes,
            method: 'POST',
            data: {
                party_id: wx.getStorageSync('USER_INFO').id
            },
            success: res => {
                0 == res.code && this.setData({
                    qrCodeSrc: res.data
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
        this.setData({
            showQrCodeVisible: !0
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