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
        // this.loadOrgan()
        this.queryNow2()
    },
    loadOrgan(){
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req({
            url: 'get_organ',
            method: "POST",
            data: {
                token: app.token,
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            // console.log(data);
            if ('0' == data.err_code) {
                const resultList = data.data

            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
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
        })
        app.util.req({
            url: 'get_house_declare',
            method: "POST",
            data: {
                token: app.token,
                dDate1: this.data.startTime,
                dDate2: this.data.endTime,
                // houseState: 2
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            // console.log(data);
            if ('0' == data.err_code) {
                const resultList = data.data
                if (null==resultList){
                    this.setData({
                        resultList:[]
                    })
                }else{
                    const resArr = []
                    for (let i = 0; i < resultList.length; i++) {
                        if (organNo==resultList[i].organNo){
                            resArr.push(resultList[i])
                        }
                    }
                    let newResArr = resArr.filter(item=>{
                        return 5!=item.houseState
                    })
                    newResArr.forEach((item, index) => {
                        if (1 == item.houseState) item.statusTxt = '终审通过'
                        if (2 == item.houseState) item.statusTxt = '未审批'
                        if (3 == item.houseState) item.statusTxt = '初审通过'
                        if (4 == item.houseState) item.statusTxt = '初审未通过'
                        // if (5 == item.houseState) item.statusTxt = '申报删除'
                        if (6 == item.houseState) item.statusTxt = '终审未通过'
                    })
                    //:newResArr
                    this.setData({
                        resultList:newResArr
                    })
                }
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
        })
        app.util.req({
            url: 'get_house_declare',
            method: "POST",
            data: {
                token: app.token,
                // houseState: 2
            }
        }).then(res => {
            wx.hideLoading()
            const data = res.data
            // console.log(data);
            if ('0' == data.err_code) {
                const resultList = data.data
                if (null==resultList){
                    this.setData({
                        resultList:[]
                    })
                }else{
                    const resArr = []
                    for (let i = 0; i < resultList.length; i++) {
                        if (organNo==resultList[i].organNo){
                            resArr.push(resultList[i])
                        }
                    }
                    let newResArr = resArr.filter(item=>{
                        return 5!=item.houseState
                    })
                    newResArr.forEach((item, index) => {
                        if (1 == item.houseState) item.statusTxt = '终审通过'
                        if (2 == item.houseState) item.statusTxt = '未审批'
                        if (3 == item.houseState) item.statusTxt = '初审通过'
                        if (4 == item.houseState) item.statusTxt = '初审未通过'
                        // if (5 == item.houseState) item.statusTxt = '申报删除'
                        if (6 == item.houseState) item.statusTxt = '终审未通过'
                    })
                    //: newResArr
                    this.setData({
                        resultList: newResArr
                    })
                }
            } else {
                wx.showModal({
                    title: '提示',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
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
    // 进行初审
    goChuShen(e) {
        const {status, id,remark} = e.currentTarget.dataset
        // if (2 != status) {
        //     return wx.showModal({
        //         title: '提示',
        //         content: '只能对未审批的进行初审',
        //         showCancel: !1,
        //     })
        // }
        wx.navigateTo({
          url: `/pages/verify-house/verify-house?id=${id}&flag=1&remark=${remark}`
        })
    },
    testZongShen(e){
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
                            houseId: e.currentTarget.dataset.id,
                            houseState: 1,
                            recRemark: '终审给你通过',
                            remark: e.currentTarget.dataset.remark
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
    testZonshegnNo(e){
        wx.showModal({
            title: '提示',
            content: '确定要拒绝吗?',
            success: res => {
                if (res.confirm) {
                    app.util.req({
                        url: 'upd_house_state',
                        method: 'POST',
                        data: {
                            token: app.token,
                            houseId: e.currentTarget.dataset.id,
                            houseState: 6,
                            recRemark: '拒绝终审',
                            remark:e.currentTarget.dataset.remark
                        }
                    }).then(res2 => {
                        const data = res2.data
                        if ('0' == data.err_code) {
                            wx.showModal({
                                title: '提示',
                                content: '成功',
                                showCancel: !1,
                                success: res => {
                                    if (res.confirm) {
                                        // wx.navigateBack()
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
    // 终审, 状态改为 已备案
    goZongsheng(e){
        const {id, remark} = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/verify-house/verify-house?id=${id}&flag=2&remark=${remark}`
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '确定要终审吗',
        //   success: res=>{
        //     if (res.confirm) {
        //         wx.showLoading({
        //             title:'加载中',
        //             mask: !0
        //         })
        //         app.util.req({
        //             url: 'upd_house_state',
        //             method: 'POST',
        //             data: {
        //                 token: app.token,
        //                 houseId: id,
        //                 houseState: 1,
        //             }
        //         }).then(res2 => {
        //             wx.hideLoading()
        //             const data = res2.data
        //             if ('0' == data.err_code) {
        //                 wx.showModal({
        //                     title: '提示',
        //                     content: '成功',
        //                     showCancel: !1,
        //                     success: res3 => {
        //                         if (res3.confirm) {
        //                             this.queryNow()
        //                         }
        //                     }
        //                 })
        //             } else {
        //                 wx.showModal({
        //                     title: '提示',
        //                     content: data.err_msg,
        //                     showCancel: !1,
        //                 })
        //             }
        //         })
        //     }
        //   }
        // })
    },

    // 去详情页面
    goInfo(e){
        wx.navigateTo({
            url: `/pages/house-info/house-info?data=${JSON.stringify(e.currentTarget.dataset.item)}`
        })
    },

    // 删除条目
    deleteItem(e) {
        wx.showModal({
            title: '提示',
            content: '确定要删除吗?',
            success: res => {
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