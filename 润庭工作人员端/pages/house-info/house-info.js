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
            if ('1' == data.propertyType) {
                data.propertyText = '商品房 '
            } else if ('2' == data.propertyType) {
                data.propertyText = '经济适用住房'
            } else if ('3' == data.propertyType) {
                data.propertyText = '集资建房'
            } else if ('4' == data.propertyType) {
                data.propertyText = '房改房'
            } else if ('5' == data.propertyType) {
                data.propertyText = '农权房'
            } else if ('6' == data.propertyType) {
                data.propertyText = '自建房'
            } else if ('7' == data.propertyType) {
                data.propertyText = '廉租房'
            } else if ('8' == data.propertyType) {
                data.propertyText = '其他'
            }

            switch (data.strctType) {
                case 1:
                    data.strctText = '框架'
                    break
                case 2:
                    data.strctText = '砖混'
                    break
                case 3:
                    data.strctText = '砖木'
                    break
                case 4:
                    data.strctText = '土木'
                    break
                case 5:
                    data.strctText = '其他'
                    break
            }

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
    // 立即通过
    checkNow() {
        // 初审
        wx.showModal({
            title: '提示',
            content: '确定要通过吗?',
            success: res => {
                if (res.confirm) {
                    app.util.req({
                        url: 'upd_house_state',
                        method: 'POST',
                        data: {
                            token: app.token,
                            houseId: this.data.data.houseId,
                            houseState: 3,
                            remark: this.data.data.remark2
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
    goChuShen(){
        wx.navigateTo({
            url: `/pages/verify-house/verify-house?id=${this.data.data.houseId}&flag=1&remark=${this.data.data.remark}`
        })
    },
    showPreImage(e) {
        const arr = []
        arr.push(e.currentTarget.dataset.src + '')
        wx.previewImage({
            urls: arr,
            current: ''
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