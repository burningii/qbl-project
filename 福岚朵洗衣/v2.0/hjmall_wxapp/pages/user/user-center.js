const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPhoneVisible: !1,
        errorMsg: '', // 错误提示信息
        cashMoney: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadData(), this.loadUserMoney()
    },

    // 立即提现
    cashNow() {
        this.setData({
            showPhoneVisible: !0
        })
    },

    // 加载用户余额
    loadUserMoney() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.user.member,
            method: 'POST',
            success: res => {
                if (0 == res.code) {
                    this.setData({
                        userMoney: res.data.money
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    // 去佣金明细页面
    goComminPage() {
        const {commision_list} = this.data.pageInfo
        wx.navigateTo({
            url: `/pages/user/user-notice?flag=1&order1=${JSON.stringify(commision_list)}`
        })
    },
    // 去提现明细页面
    goTixianPage() {
        const {tiXian_list} = this.data.pageInfo
        wx.navigateTo({
            url: `/pages/user/user-notice?flag=2&order2=${JSON.stringify(tiXian_list)}`
        })
    },

    // 主页数据加载
    loadData() {
        const data = {}
        const _this = this
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.charge,
            method: 'POST',
            success: res => {
                console.log(res);
                if (0 == res.code) {
                    data.amount = res.data.amount // 总佣金
                    data.day_time = res.data.day_time // 今日营业额
                    data.pay_time = res.data.pay_time // 昨日佣金
                    data.commision_list = res.data.charges // 佣金明细
                    data.day_count = res.data.day // 今日下单量
                    data.curent_month = res.data.mo // 当月营业额
                    data.tiXian_list = res.data.charge
                    data.store_name = res.data.name
                    _this.setData({
                        pageInfo: data
                    })
                } else {
                    wx.showModal({
                        title: '提示',
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

    // 确认提现按钮
    confirmPhone() {
        const _this = this
        const {cashMoney} = _this.data
        if ('' == cashMoney.trim()) {
            _this.setData({
                showPhoneVisible: !0,
                errorMsg: '金额不能为空'
            })
            return !1
        }
        if (0 == cashMoney) {
            _this.setData({
                showPhoneVisible: !0,
                errorMsg: '金额不能为0'
            })
            return !1
        }

        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.cash,
            method: 'POST',
            data: {
                amount: cashMoney
            },
            success: res => {
                if (0 == res.code) {
                    app.utils.showModal({
                        title: '成功',
                        content: '提现成功',
                        showCancel: !1
                    })
                } else {
                    app.utils.showModal({
                        title: "系统信息",
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
    // 关闭弹窗
    cancelPhone() {
        this.setData({
            errorMsg: ''
        })
    },
    // 输入的金额
    onChangeMoney(e) {
        this.setData({
            cashMoney: e.detail
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