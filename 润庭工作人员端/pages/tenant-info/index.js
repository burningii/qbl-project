const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.data) {
            const data = JSON.parse(options.data)
            console.log(data);

            switch (data.houseState) {
                case 1:
                    data.houseStateText = '已备案'
                    break
                case 2:
                    data.houseStateText = '未审批'
                    break
                case 3:
                    data.houseStateText = '申报通过'
                    break
                case 4:
                    data.houseStateText = '申报失败'
                    break
            }

            this.setData({
                data
            })

        }
    },

    showPreImage(e) {
        const arr = []
        arr.push(e.currentTarget.dataset.src + '')
        wx.previewImage({
            urls: arr,
            current: ''
        })
    },

    checkNow(){
        wx.showModal({
            title: '提示',
            content: '确定要通过吗?',
            success: res => {
                if (res.confirm) {
                    app.util.req({
                        url: 'upd_tenant_state',
                        method: 'POST',
                        data: {
                            token: app.token,
                            tenantId: this.data.data.tenantId,
                            tenantState: 3,
                            remark: this.data.data.remark
                        }
                    }).then(res2 => {
                        const data = res2.data
                        if ('0' == data.err_code) {
                            wx.showModal({
                                title: '提示',
                                content: '初审成功',
                                showCancel: !1,
                                success: res => {
                                    if (res.confirm) {
                                        wx.navigateBack()
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.err_msg,
                                showCancel: !1,
                            })
                        }
                    })
                }
            }
        })
    },
    //
    goChuShen(){
        wx.navigateTo({
            url: `/pages/verify-tenant/index?id=${this.data.data.tenantId}&remark=${this.data.data.remark}`
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