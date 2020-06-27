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

        idNum: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 立即备案
    rightRecord(e){
        const {item} = e.currentTarget.dataset
        wx.navigateTo({
          url: `./record?info=${JSON.stringify(item)}`,
        })
    },

    goInfo(e){
        wx.navigateTo({
            url: `/pages/landlord/page2/info/info?data=${JSON.stringify(e.currentTarget.dataset.item)}&flag=1`
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

    // 输入
    onChangeIdNum(e){
        this.setData({
            idNum: e.detail.replace(/\s*/g,"")
        })
    },

    // 选择时间
    onInputTime(e) {
        const date = app.formatTimestap(e.detail).split(' ')[0]
        console.log(date);
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
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: 'get_house_record',
            method: 'POST',
            data: {
                token: app.token,
                houseState: 1,
                createId: wx.getStorageSync('user_id') || '',
                rDate1: this.data.startTime,
                rDate2:this.data.endTime
            }
        }).then(res=>{
            wx.hideLoading()
            const data = res.data
            if ('0'==data.err_code){
                this.setData({
                    resultList: data.data || []
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

        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: 'get_house_record',
            method: 'POST',
            data: {
                token: app.token,
                houseState: 1,
                createId: wx.getStorageSync('user_id') || '',
            }
        }).then(res=>{
            wx.hideLoading()
            const data = res.data
            if ('0'==data.err_code){
                this.setData({
                    resultList: data.data || []
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
    // 复制许可证号
    copyNo(e){
        console.log('pk');
        console.log(e);
        wx.setClipboardData({
            data:e.currentTarget.dataset.no,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        });
    },
    preivImage(e){
        const arr = []
        arr.push(e.currentTarget.dataset.src + '')
        wx.previewImage({
            urls: arr,
            current: ''
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