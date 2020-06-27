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


        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'get_tenant_record',
            method: 'POST',
            data: {
                // createId: wx.getStorageSync('openId') || '',
                createId: wx.getStorageSync('user_id') || '',
                token: app.token,
                dDate1: app.formatTimestap(this.data.startTimeValue),
                dDate2: app.formatTimestap(this.data.endTimeValue),
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            // console.log(data);
            if ('0' == data.err_code) {
                const resultList = data.data
                this.setData({
                    resultList: resultList[0]
                })
                // for (let i = 0; i < resultList.length; i++) {
                //     if (1 == resultList[i].tenantState) resultList[i].statusTxt = '已备案'
                //     if (2 == resultList[i].tenantState) resultList[i].statusTxt = '未审批'
                //     if (3 == resultList[i].tenantState) resultList[i].statusTxt = '申报通过'
                //     if (4 == resultList[i].tenantState) resultList[i].statusTxt = '申报失败'
                //     if (5 == resultList[i].tenantState) resultList.splice(i--, 1)
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

    goInfo(){
        // const item = JSON.stringify(e.currentTarget.dataset.item)
        wx.navigateTo({
            url: `/pages/tenant/page2/info/info?data=${JSON.stringify(this.data.resultList)}`
        })
    },

    // 删除条目
    deleteItem(e){
        wx.showModal({
            title: '提示',
            content: '确定要删除吗?',
            success: res=>{
                if (res.confirm) {

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
        this.queryNow()
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