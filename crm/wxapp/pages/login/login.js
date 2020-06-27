const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        pwd: '',
        btnFlag: !0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '登录'
        })
    },
    onChangeField(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            this.setData({
                username: e.detail.replace(/\s*/g, ""),
            })
        } else if ('2' == f) {
            this.setData({
                pwd: e.detail.replace(/\s*/g, "")
            })
        }
        if (this.data.username == '' || '' == this.data.pwd) {
            this.setData({
                btnFlag: !0
            })
        } else {
            this.setData({
                btnFlag: !1
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 立即登录
     */
    loginNow() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'login',
            method: 'POST',
            data: {
                account: this.data.username,
                pass: this.data.pwd,
            },
        }).then(res => {
            const result = res.data
            console.log(result);
            if (0 == result.code) {
                wx.setStorageSync('user_info', result.data);
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            } else {
                wx.showModal({
                    title: '失败',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
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