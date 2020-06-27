const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: '',
        timeArr: ['1年', '2年', '3年', '4年'],
        timeText: '点击选择时长',
        timeEndText: '点击选择时长',
        modalVisible: !1,
        modalVisible2: !1,
        timeTextValue: '',
        timeEndValue: '',
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
            return value;
        }
    },

    // 开始时间
    onCofirmStartTime(e) {
        this.setData({
            timeText: app.formatTimestap(e.detail),
            timeTextValue: e.detail,
            modalVisible: !1,
        })
    },
    onCofirmEndTime(e) {
        this.setData({
            timeEndText: app.formatTimestap(e.detail),
            timeEndValue: e.detail,
            modalVisible2: !1,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (op) {
        op.info && this.setData({info: JSON.parse(op.info)})
    },

    onCloseModal() {
        this.setData({
            modalVisible: !1
        })
    },
    onCloseModal2() {
        this.setData({
            modalVisible2: !1
        })
    },
    // 选择时长
    confirmModal(e) {
        const _this = this
        this.setData({
            timeText: _this.data.timeArr[e.detail.index],
            currentIdx: e.detail.index,
            modalVisible: !1
        })
    },

    showModal() {
        this.setData({
            modalVisible: !0
        })
    },
    // 校验时间
    verifyTime() {
        const forMatTime = (timeStr) => {
            const timeArr = timeStr.split('-')
            const months = timeArr[1].split(' ')
            if (months[0] == '0') {
                timeArr[1] = Number(months[1] - 1)
            } else {
                timeArr[1] = Number(months.join('')) - 1
            }
            return new Date(timeArr[0], timeArr[1], timeArr[2]).getTime()
        }
        if (this.data.timeEndValue <= this.data.timeTextValue) return '结束时间不能小于开始时间'
        if (this.data.timeTextValue <= forMatTime(this.data.info.recordDate)) return '租赁开始时长不能小于终审通过时间'
        return ''
    },
    // 立即提交
    sureSubmit() {
        if ('' == this.data.text) return wx.showToast({
            title: '请输入内容',
            icon: 'none'
        }), !1
        if ('' == this.data.timeTextValue) return wx.showToast({
            title: '请选择开始时间',
            icon: 'none'
        }), !1
        if ('' == this.data.timeEndValue) return wx.showToast({
            title: '请选择结束时间',
            icon: 'none'
        }), !1

        if ('' != this.verifyTime()) {
            return wx.showToast({
                title: this.verifyTime(),
                icon: 'none',
                duration: 3000
            }), !1
        }

        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'upd_house_state',
            method: 'POST',
            data: {
                token: app.token,
                houseId: this.data.info.houseId,
                houseState: 1,
                recRemark: this.data.text,
                createId: wx.getStorageSync('user_id') || '',
                begTime: app.formatTimestapToSecond(this.data.timeTextValue),
                endTime: app.formatTimestapToSecond(this.data.timeEndValue),
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            if ('0' == data.err_code) {
                wx.showModal({
                    title: '提示',
                    content: '提交成功',
                    showCancel: !1,
                    success: res2 => {
                        if (res2.confirm) {
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

    },
    showModal2() {
        this.setData({
            modalVisible2: !0
        })
    },

    // 输入内容
    onChangeValue(e) {
        this.setData({
            text: e.detail
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