const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentDate: new Date().getTime(),
        minDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`;
            }
        },
        startTime: app.formatTimestap(new Date().getTime()),
        startTimeValue: new Date().getTime(),
        endTime: app.formatTimestap(new Date().getTime()),
        endTimeValue: new Date().getTime(),
        showTimePickerVisible: !1,

        resultList: [], // 查询结果列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    showTimePicker(e) {
        const {flag} = e.currentTarget.dataset
        this.setData({
            showTimePickerVisible: !0,
            timeFlag: flag
        })
    },
    onCloseTimePicker() {
        this.setData({
            showTimePickerVisible: !1
        })
    },
    // 选择时间
    onInputTime(e) {
        const date = app.myFormattime(e.detail, 2).split(' ')[0]
        if ('1' == this.data.timeFlag) {
            this.setData({startTime: date, startTimeValue: e.detail})
        } else {
            this.setData({endTime: date, endTimeValue: e.detail})
        }
        this.onCloseTimePicker()
    },
    // 立即查询
    queryNow() {
        if ('' == this.data.startTimeValue || '' == this.data.endTimeValue) return wx.showToast({
            title: '请选择开始/结束时间',
            icon: 'none'
        }), !1
        const organNo = wx.getStorageSync('user_organNo').organNo;
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'get_tenant_declare',
            method: 'POST',
            data: {
                token: app.token,
                dDate1: app.formatTimestap(this.data.startTimeValue),
                dDate2: app.formatTimestap(this.data.endTimeValue),
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                const resultList = data.data
                const resArr = []
                for (let i = 0; i < resultList.length; i++) {
                    if (organNo == resultList[i].organNo) {
                        resArr.push(resultList[i])
                    }
                }
                let newResArr = resArr.filter(item=>{
                    return 5!=item.houseState
                })
                newResArr.forEach((item, index) => {
                    if (1 == item.tenantState) item.statusTxt = '终审通过'
                    if (2 == item.tenantState) item.statusTxt = '未审批'
                    if (3 == item.tenantState) item.statusTxt = '初审通过'
                    if (4 == item.tenantState) item.statusTxt = '初审未通过'
                    // if (5 == item.tenantState) item.statusTxt = '申报删除'
                    if (6 == item.tenantState) item.statusTxt = '终审未通过'
                })
                //: newResArr
                this.setData({
                    resultList: newResArr
                })


                // for (let i = 0; i < resultList.length; i++) {
                //     if (1 == resultList[i].tenantState) resultList[i].statusTxt = '终审通过'
                //     if (2 == resultList[i].tenantState) resultList[i].statusTxt = '未审批'
                //     if (3 == resultList[i].tenantState) resultList[i].statusTxt = '初审通过'
                //     // if (4 == resultList[i].tenantState) resultList.splice(i--, 1)
                //     if (4 == resultList[i].tenantState) resultList[i].statusTxt = '初审未通过'
                //     // if (5 == resultList[i].tenantState) resultList.splice(i--, 1)
                //     if (5 == resultList[i].tenantState) resultList[i].statusTxt = '申报删除'
                //     if (6 == resultList[i].tenantState) resultList[i].statusTxt = '终审未通过'
                // }
                // this.setData({
                //     resultList: resultList
                // })
            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
        })

    },
    queryNow2() {
        const organNo = wx.getStorageSync('user_organNo').organNo;
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'get_tenant_declare',
            method: 'POST',
            data: {
                token: app.token,
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                const resultList = data.data
                const resArr = []
                for (let i = 0; i < resultList.length; i++) {
                    if (organNo == resultList[i].organNo) {
                        resArr.push(resultList[i])
                    }
                }
                let newResArr = resArr.filter(item=>{
                    return 5!=item.tenantState
                })
                newResArr.forEach((item, index) => {
                    if (1 == item.tenantState) item.statusTxt = '终审通过'
                    if (2 == item.tenantState) item.statusTxt = '未审批'
                    if (3 == item.tenantState) item.statusTxt = '初审通过'
                    if (4 == item.tenantState) item.statusTxt = '初审未通过'
                    // if (5 == item.tenantState) item.statusTxt = '申报删除'
                    if (6 == item.tenantState) item.statusTxt = '终审未通过'
                })
                //: newResArr
                this.setData({
                    resultList: newResArr
                })


                // for (let i = 0; i < resultList.length; i++) {
                //     if (1 == resultList[i].tenantState) resultList[i].statusTxt = '终审通过'
                //     if (2 == resultList[i].tenantState) resultList[i].statusTxt = '未审批'
                //     if (3 == resultList[i].tenantState) resultList[i].statusTxt = '初审通过'
                //     // if (4 == resultList[i].tenantState) resultList.splice(i--, 1)
                //     if (4 == resultList[i].tenantState) resultList[i].statusTxt = '初审未通过'
                //     // if (5 == resultList[i].tenantState) resultList.splice(i--, 1)
                //     if (5 == resultList[i].tenantState) resultList[i].statusTxt = '申报删除'
                //     if (6 == resultList[i].tenantState) resultList[i].statusTxt = '终审未通过'
                // }
                // this.setData({
                //     resultList: resultList
                // })
            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
        })

    },

    // 初审
    changeOne(e) {
        wx.navigateTo({
            url: `/pages/verify-tenant/index?id=${e.currentTarget.dataset.id}&remark=${e.currentTarget.dataset.remark}`
        })
    },

    goInfo(e) {
        wx.navigateTo({
            url: `/pages/tenant-info/index?data=${JSON.stringify(e.currentTarget.dataset.item)}`
        })
    },

    // 终审
    changeTwo(e) {
        wx.showModal({
            title: '提示',
            content: '确定要通过终审吗?',
            success: res => {
                if (res.confirm) {
                    app.util.req({
                        url: 'upd_tenant_state',
                        method: 'POST',
                        data: {
                            token: app.token,
                            tenantId: e.currentTarget.dataset.id,
                            tenantState: 1,
                        }
                    }).then(res2 => {
                        const data = res2.data
                        if ('0' == data.err_code) {
                            wx.showModal({
                                title: '提示',
                                content: '终审成功',
                                showCancel: !1,
                                success: res => {
                                    if (res.confirm) {
                                        this.queryNow()
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.queryNow2()
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