const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        streetName: '',
        communityName: '',
        buildName: '',
        taskInfo: '',
        showTimePickerVisible: !1,
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
        orderTime: '点击选择时间',
        orderTimeValue: '',
        timeArr: []
    },

    onInputTime(e) {
        this.setData({
            orderTime: app.myFormattime(e.detail, 2).split(' ')[0],
            showTimePickerVisible: !1,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.idNum && this.setData({
            idNum: options.idNum
        }), options.type && this.setData({
            orderType: options.type
        }),this.loadAllTime()
    },
    // 确定选择时间
    onConfirmTimeCheck(e) {
        const {index, value} = e.detail
        this.setData({
            currentValue: value,
            orderTime: value,
            orderTimeValue: value
        })
        this.onCloseTimePicker()
    },
    // 提交信息
    checkSubmit() {
        if ('' == this.data.orderTimeValue) return wx.showModal({
            title: '提示',
            content: '请选择时间',
            showCancel: !1
        }), !1

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'upd_reserve',
            method: 'POST',
            data: {
                token: app.token,
                declareNo: this.data.idNum,
                reserveDate: this.data.orderTimeValue,
                reserveState: 4,
                itemType: this.data.orderType,
                createId: wx.getStorageSync('user_id') || '',
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                wx.showModal({
                    title: '提示',
                    content: '变更成功',
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
                    showCancel: !1
                })
            }
        })

    },

    // 加载所有可预约时间
    loadAllTime() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'get_rsvday',
            method: 'POST',
            data: {
                token: app.token,
                n: 10,
                createId: wx.getStorageSync('user_id') || '',
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            console.log(data);
            if ('0' == data.err_code) {
                const arr = data.data
                const newArr = []
                for (let i = 0; i < arr.length; i++) {
                    newArr.push(arr[i].reserveDate)
                }
                this.setData({timeArr: newArr})
            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
        })
    },

    onCloseTimePicker() {
        this.setData({
            showTimePickerVisible: !1
        })
    },
    showTimePicker() {
        this.setData({
            showTimePickerVisible: !0
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