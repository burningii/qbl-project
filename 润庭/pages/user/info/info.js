const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        nickModalVisible: !1,
        newNickname: '',
    },
    afterRead(event) {
        const {file} = event.detail;
        wx.uploadFile({
            url: `${app.siteInfo.api2.substr(0, app.siteInfo.api2.length - 1)}?i=17&c=entry&a=wxapp&do=Upload&m=zh_tcwq`,
            filePath: file.path,
            name: 'upfile',
            formData: null,
            success: res => {
                if (200 == res.statusCode) {
                    this.setData({
                        'userInfo.img': res.data
                    })
                    this.reloadAvatar()
                }
            },
        });
    },
    // 更换头像
    reloadAvatar() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req2({
            url: 'SetLocalInfo',
            data: {
                user_tel: wx.getStorageSync('user_info').user_tel,
                img: this.data.userInfo.img
            }
        }).then(res => {
            wx.hideLoading()
            const result = res.data
            if (0 == result.code) {
                wx.setStorageSync('user_info', result.data);
                wx.showToast({
                    title: '修改成功',
                    icon: 'none'
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
    onChangeNickname(e) {
        this.setData({
            newNickname: e.detail.replace(/\s*/g, "")
        })
    },
    // 昵称确认
    nickModalConfirm(e) {
        if ('confirm' == e.detail) {
            if ('' == this.data.newNickname) return wx.showToast({
                title: '昵称不能为空',
                icon: 'none'
            }), !1, this.setData({
                nickModalVisible: !0
            })
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            app.util.req2({
                url: 'SetLocalInfo',
                data: {
                    user_tel: wx.getStorageSync('user_info').user_tel,
                    name: this.data.newNickname
                }
            }).then(res => {
                wx.hideLoading()
                const result = res.data
                if (0 == result.code) {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'none'
                    })
                    wx.setStorageSync('user_info', result.data);
                    this.setData({
                        'userInfo.name': this.data.newNickname
                    })
                } else {
                    wx.showModal({
                        title: '失败',
                        content: result.msg,
                        showCancel: !1,
                    })
                }
            })

        }
    },
    // 改变密码
    goPwdChange() {
        wx.navigateTo({
            url: '/pages/restore-pwd/index'
        })
    },
    // 注销
    logout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗',
            success: res => {
                if (res.confirm) {
                    wx.removeStorageSync('user_id')
                    wx.removeStorageSync('user_info')
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    showNickModal() {
        this.setData({
            nickModalVisible: !0
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '个人中心'
        })
        this.setData({
            userInfo: wx.getStorageSync('user_info') || ''
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