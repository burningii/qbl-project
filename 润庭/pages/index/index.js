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
        sendMsg: '发送验证码',
        sendMsgAbled: !1,
        verifyCode: '',
        btnFlag: !0,
        pwdFlag: !0,
        foucesFlag: !1,

        phoneModalVisible: !1,
        bindPhone: ''
    },
    /**
     * 展示信息
     */
    showTextInfo() {
        wx.showModal({
            title: '提示',
            content: '本软件为乌鲁木齐润庭技术服务有限公司开发',
            showCancel: !1,
            confirmText: '我知道了'
        })
    },
    onChangeBindPhone(e) {
        this.setData({
            bindPhone: e.detail.replace(/\s*/g, "")
        })
    },
    onCloseBindModal(e) {
        if ('confirm' == e.detail) {
            if ('' == this.data.bindPhone) return wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            }), this.setData({
                phoneModalVisible: !0,
            })
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            app.util.req2({
                url: 'SetTel',
                data: {
                    user_tel: this.data.bindPhone,
                    id: wx.getStorageSync('user_info').id
                }
            }).then(res => {
                wx.hideLoading()
                const result = res.data
                // 设置成功
                if (0 == result.code) {
                    wx.setStorageSync('user_info', result.data);
                    wx.setStorageSync('user_id', '100000' + result.data.id);
                    wx.showModal({
                        title: '提示',
                        content: '登录成功',
                        showCancel: !1,
                        success: res3 => {
                            if (res3.confirm) {
                                wx.reLaunch({
                                    url: '/pages/main/main'
                                })
                            }
                        }
                    })
                } else if (2 == result.code) {
                    // 注册
                    wx.redirectTo({
                        url: '/pages/user/register/register'
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: result.msg,
                        showCancel: !1,
                    })
                }
            })
        }
    },
    clickIcon() {
        const _this = this
        this.setData({
            pwdFlag: !_this.data.pwdFlag,
            foucesFlag: !0
        })
    },
    /**
     * 微信登录
     */
    updateUserInfo(t) {
        console.log(t), "getUserInfo:ok" == t.detail.errMsg && (this.setData({
            hydl: !1
        }), this.weChatLogin());
    },
    weChatLogin() {
        const c = this
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        wx.login({
            success: function (t) {
                var e = t.code;
                wx.getSetting({
                    success: function (t) {
                        t.authSetting["scope.userInfo"] ? wx.getUserInfo({
                            success: function (t) {
                                var a = t.userInfo.nickName, n = t.userInfo.avatarUrl;
                                app.util.req2({
                                    url: "openid",
                                    cachetime: "0",
                                    data: {
                                        code: e,
                                        i: 21
                                    },
                                }).then(res => {
                                    var e = res.data.openid;
                                    app.util.req2({
                                        url: "LoginRt",
                                        cachetime: "0",
                                        data: {
                                            openid: e,
                                            img: n,
                                            name: a,
                                            i: 21
                                        }
                                    }).then(res2 => {
                                        const result = res2.data.data
                                        console.log(result);
                                        wx.setStorageSync('user_info', result.data);
                                        // 未绑定手机号和密码
                                        if (0 == result.is_set_tel) {
                                            c.setData({
                                                phoneModalVisible: !0
                                            })
                                        } else {
                                            // 注册
                                            if (0 == result.is_zc) {
                                                wx.redirectTo({
                                                    url: '/pages/user/register/register'
                                                })
                                            } else {
                                                wx.setStorageSync('user_id', '100000' + result.data.id);
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '登录成功',
                                                    showCancel: !1,
                                                    success: res3 => {
                                                        if (res3.confirm) {
                                                            wx.reLaunch({
                                                                url: '/pages/main/main'
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                        }) : (console.log("未授权过"), c.setData({
                            hydl: !0
                        }));
                    }
                });
            }, complete: () => {
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.login()
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
        if (app._isNull(this.data.username) || app._isNull(this.data.pwd) || app._isNull(this.data.code)) {
            this.setData({
                btnFlag: !0
            })
        } else {
            this.setData({
                btnFlag: !1
            })
        }
    },

    // 发送验证码
    sendCode() {
        const _this = this
        if (!regexPhone.test(this.data.username)) return wx.showToast({
            title: '手机号不正确',
            icon: 'none'
        }), !1
        let time = 60
        let timer = setInterval(() => {
            if (1 == time) {
                clearInterval(timer)
                _this.setData({
                    sendMsg: `发送验证码`,
                    sendMsgAbled: !1
                })
            } else {
                time--
                _this.setData({
                    sendMsg: `${time}"重新获取`,
                    sendMsgAbled: !0
                })
            }

        }, 1000)

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req2({
            url: 'SendVerifyCode',
            data: {
                mobile: this.data.username
            }
        }).then(res => {
            wx.hideLoading()
            const result = res.data
            if (1 == result.errno) {
                this.setData({verifyCode: result.data.code})
                wx.showToast({
                    title: '发送成功',
                    icon: 'none',
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

    // 忘记密码
    goRestorePwd() {
        wx.navigateTo({
            url: '/pages/restore-pwd/index'
        })
    },

    // 去注册
    goRegister() {
        wx.navigateTo({
            url: '/pages/user/register/register'
        })
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
                url: 'GetLocalUser',
                data: {
                    loginName: this.data.username,
                    password: this.data.pwd,
                }
            }).then(res => {
                wx.hideLoading()
                const result = res.data
                if (1 == result.errno) {
                    wx.setStorageSync('user_id', '100000' + result.data.id);
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
        if (!regexPhone.test(this.data.username)) return '手机号格式不正确'
        if ('' == this.data.code) return '验证码不能为空'
        if (this.data.verifyCode != this.data.code) return '验证码无效'
        // console.log('密码长度: ', this.data.pwd.length);
        if ('' == this.data.pwd) return '密码不能为空'
        return ''
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