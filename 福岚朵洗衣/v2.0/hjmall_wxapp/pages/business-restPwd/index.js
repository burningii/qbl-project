const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pwd: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '修改密码'
        })
    },

    onChangePwd(e) {
        this.setData({
            pwd: e.detail.replace(/\s*/g, "")
        })
    },
    gonow() {
        if ('' == this.data.pwd) return wx.showModal({
            title: '失败',
            content: '请输入新的密码',
            showCancel: !1,
        }), !1

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.edit_pass,
            method: 'POST',
            data: {
                pass: this.data.pwd
            },
            success: res => {
                if (0 == res.code) {
                    wx.showModal({
                        title: '成功',
                        content: '密码修改成功',
                        showCancel: 11,
                        success: res2 => {
                            if (res2.confirm) {
                                wx.navigateBack()
                            }
                        }
                    })
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