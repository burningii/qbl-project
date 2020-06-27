const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        pwd: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '重置密码'
        })
    },

    onChangeValue(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            this.setData({
                username: e.detail.replace(/\s*/g, "")
            })
        } else if ('2' == f) {
            this.setData({
                pwd: e.detail.replace(/\s*/g, "")
            })
        }
    },


    resetNow() {
        if ('' == this.data.username || '' == this.data.pwd) {
            return wx.showModal({
                title: '失败',
                content: '账号和密码不能为空',
                showCancel: !1,
            }), !1
        }

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req2({
            url: 'SetGovUserPwd',
            method: 'POST',
            data: {
                loginName: this.data.username,
                password: this.data.pwd
            }
        }).then(res => {
            wx.hideLoading()
            const result = res.data
            if (1 == result.errno) {
                wx.showModal({
                    title: '提示',
                    content: '重置成功',
                    success: res2 => {
                        if (res2.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.message,
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