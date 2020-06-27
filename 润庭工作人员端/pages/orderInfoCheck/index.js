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
        active: 0,

        resultList: [], // 查询结果列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadOrganNo()
    },
    // 获取机构号
    loadOrganNo() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req({
            url: 'get_organ',
            method: 'POST',
            data: {
                token: app.token
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                const arrayData = data.data
                this.data.allOrganNoList = arrayData
            }
        })
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
    // 确认用户的预约时间
    sureTwoCheckTime(e) {
        const {item} = e.currentTarget.dataset
        wx.showModal({
            title: '提示',
            content: `用户变更时间为：${item.reserveDate}，是否同意?`,
            confirmText: '同意',
            cancelText: '拒绝',
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }), app.util.req({
                        url: 'upd_reserve',
                        method: 'POST',
                        data: {
                            token: app.token,
                            declareNo: item.declareNo,
                            reserveDate: item.reserveDate,
                            reserveState: 4,
                            itemType: item.itemType,
                            createId: wx.getStorageSync('user_organNo').id
                        }
                    }).then(res => {
                        wx.hideLoading()
                        const data = res.data
                        if ('0' == data.err_code) {
                            wx.showModal({
                                title: '提示',
                                content: '成功',
                                showCancel: !1,
                                success: res => {
                                    if (res.confirm) {
                                        this.queryNow2()
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.err_msg,
                                showCancel: !1
                            })
                        }
                    })
                }else{
                    wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }), app.util.req({
                        url: 'upd_reserve',
                        method: 'POST',
                        data: {
                            token: app.token,
                            declareNo: item.declareNo,
                            reserveDate: item.reserveDate,
                            reserveState: 3,
                            itemType: item.itemType,
                            createId: wx.getStorageSync('user_organNo').id
                        }
                    }).then(res => {
                        wx.hideLoading()
                        const data = res.data
                        if ('0' == data.err_code) {
                            wx.showModal({
                                title: '提示',
                                content: '成功',
                                showCancel: !1,
                                success: res => {
                                    if (res.confirm) {
                                        this.queryNow2()
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.err_msg,
                                showCancel: !1
                            })
                        }
                    })
                }
            }
        })
    },
    // 选择时间
    onInputTime(e) {
        // const date = app.myFormattime(e.detail, 2).split(' ')[0]
        const date = app.formatTimestap(e.detail).split(' ')[0]

        if ('1' == this.data.timeFlag) {
            this.setData({startTime: date, startTimeValue: e.detail})
        } else {
            this.setData({endTime: date, endTimeValue: e.detail})
        }
        this.onCloseTimePicker()
    },
    onChangeMenus(event) {
        console.log(event);
        this.setData({
            active: event.detail.index
        })
    },
    // 立即查询
    queryNow() {
        const organNo = wx.getStorageSync('user_organNo').organNo;
        const _this=this
        if ('' == this.data.startTimeValue || '' == this.data.endTimeValue) return wx.showToast({
            title: '请选择开始/结束时间',
            icon: 'none'
        }), !1

        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req({
            url: 'get_reserve',
            method: 'POST',
            data: {
                token: app.token,
                date1: this.data.startTime,
                date2: this.data.endTime,
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                this.setData({
                    resultList: data.data
                })
                const getOrganNo = (s) =>{
                    let result = _this.data.allOrganNoList.filter(item=>{
                        return s==item.fullCname
                    })
                    if (result.length>0){
                        return result[0].organNo
                    }else{
                        return 0
                    }
                }
                data.data.forEach(item=>{
                    item.organNo = getOrganNo(item.community)
                })
                // console.log('---处理----',data.data);
                let newResult = data.data.filter(item=>{
                    return item.organNo==organNo
                })
                // : newResult
                this.setData({
                    resultList:  newResult
                    // resultList
                })

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
        const _this=this
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req({
            url: 'get_reserve',
            method: 'POST',
            data: {
                token: app.token,
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                const getOrganNo = (s) =>{
                    let result = _this.data.allOrganNoList.filter(item=>{
                        return s==item.fullCname
                    })
                    if (result.length>0){
                        return result[0].organNo
                    }else{
                        return 0
                    }
                }
                data.data.forEach(item=>{
                    item.organNo = getOrganNo(item.community)
                })
                // console.log('---处理----',data.data);
                let newResult = data.data.filter(item=>{
                    return item.organNo==organNo
                })
                // : newResult
                this.setData({
                    resultList:  newResult
                    // resultList
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
        })

    },
    // 变更预约信息
    changeOrderInfo(e) {
        wx.navigateTo({
            url: `/pages/landlord/page3/change-order/change-order?idNum=${e.currentTarget.dataset.id}&type=2`
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