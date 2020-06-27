const app = getApp()
const WxParse = require('../../wxParse/wxParse');
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.name
        })
        this.setData({
            id: options.id
        })
        this.loadData()
    },
    // 去食谱页面
    goInfo(e) {
        wx.navigateTo({
            url: `/pages/food/food?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
        })
    },
    /**
     * 加入购物车
     */
    addCart(e) {
        const {id} = e.currentTarget.dataset
        const o = [{
            attr_group_id: 1,
            attr_id: 1
        }]
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.cart.add_cart,
            method: 'POST',
            data: {
                goods_id: id,
                attr: JSON.stringify(o),
                num: 1
            },
            success: res => {
                if (0 == res.code) {
                    wx.showModal({
                        title: '成功',
                        content: '添加购物车成功',
                        showCancel: !1,
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
    preive(){
        wx.navigateBack()
    },
    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.talk_info,
            data: {
                id: this.data.id
            },
            success: res => {
                if (0 == res.code) {
                    WxParse.wxParse('article', 'html', res.data.info.content, this, 5);
                    this.setData({
                        info: res.data
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