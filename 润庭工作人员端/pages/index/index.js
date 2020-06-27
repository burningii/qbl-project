const app = getApp()
const regexPhone = /^\d{11}$/
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        pwd: '',
        code: '',
        pwdFlag: !0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    clickIcon() {
        const _this = this
        this.setData({
            pwdFlag: !_this.data.pwdFlag,
        })
    },
    onChangeUser(e) {
        const {flag} = e.currentTarget.dataset
        if ('1' == flag) {
            this.setData({
                username: e.detail.replace(/\s*/g, "")
            })
        } else if ('2' == flag) {
            this.setData({
                pwd: e.detail.replace(/\s*/g, "")
            })
        } else if ('3' == flag) {
            this.setData({
                code: e.detail.replace(/\s*/g, "")
            })
        }


    },

    // 发送验证码
    sendCode() {
        if (!regexPhone.test(this.data.username)) return wx.showToast({
            title: '手机号不正确',
            icon: 'none'
        }), !1


    },

    // 立即登录
    loginNow() {
        // 验证成功
        const str = this.verfiData()
        if ('' == str) {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.util.req2({
                url: 'GetGovUser',
                method: 'GET',
                data: {
                    loginName: this.data.username,
                    password: this.data.pwd
                }
            }).then(res => {
                wx.hideLoading()
                console.log('登录：', res);
                const result = res.data
                if (1 == result.errno) {
                    wx.setStorageSync('user_id', 1);
                    wx.setStorageSync('user_organNo', result.data);
                    wx.showModal({
                        title: '提示',
                        content: '登录成功',
                        showCancel: !1,
                        success: res2 => {
                            if (res2.confirm) {
                                wx.reLaunch({
                                    url: '/pages/main/main'
                                })
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
        } else {
            wx.showToast({
                title: str,
                icon: 'none'
            })
        }
    },

    // 校验信息
    verfiData() {
        if ('' == this.data.username) return '账号不能为空'
        // if ('' == this.data.code) return '验证码不能为空'
        // console.log('密码长度: ', this.data.pwd.length);
        if ('' == this.data.pwd) return '密码不能为空'
        return ''
    },

    // 重置密码页面
    ResetPwd(){
        wx.navigateTo({
          url: '/pages/reset-pwd/reset-pwd'
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