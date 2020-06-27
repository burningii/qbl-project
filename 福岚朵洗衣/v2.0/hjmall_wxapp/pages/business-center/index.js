const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        pwd: ''
    },

    onChangeInput(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            this.setData({username: e.detail.replace(/\s*/g, "")})
        } else if ('2' == f) {
            this.setData({pwd: e.detail.replace(/\s*/g, "")})
        }
    },

    // 立即登录
    goLogin() {
        if ('' == this.data.username || '' == this.data.pwd) return wx.showModal({
            title: '提示',
            content: '账号或密码不能为空',
            showCancel: !1,
        }), !1

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.logist.account,
            method: 'POST',
            data: {
                account: this.data.username,
                pass: this.data.pwd,
            },
            success: res => {
                console.log('登录结果: ', res);
                if (0 == res.code) {
                    const token = wx.getStorageSync('ACCESS_TOKEN');
                    wx.setStorageSync('ACCESS_TOKEN', res.data.access_token);
                    wx.setStorageSync('ACCESS_TOKEN2', token);
                    wx.setStorageSync('USER_INFO', res.data);
                    wx.showModal({
                        title: '提示',
                        content: '登录成功',
                        showCancel: !1,
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