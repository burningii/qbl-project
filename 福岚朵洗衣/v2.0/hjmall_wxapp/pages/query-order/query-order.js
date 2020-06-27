const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {}
    },


    scanNow() {
        wx.scanCode({
            onlyFromCamera: true,
            complete: res => {
                if ('scanCode:ok' == res.errMsg) {
                    this.setData({
                        scanValue: res.result
                    }), this.loadData()
                } else {
                    wx.showToast({
                        title: '扫码失败',
                        icon: 'none',
                        duration: 1500
                    })
                }
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

    loadData() {
        const _this=this
        const {scanValue} = _this.data
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.imges,
            method: 'POST',
            data: {
                order_id: scanValue
            },
            success: res => {
                if (0 == res.code) {
                    _this.setData({
                        order: res.data
                    })
                } else {
                    app.utils.showModal({
                        content: res.msg,
                        showCancel: !1
                    })
                }
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