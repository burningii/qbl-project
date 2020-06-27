const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [], // 所有的订单信息集合
        scanCodeValue: '', // 当前条形码
        orderTotalPrice: '', // 价格总计
        showQrCodeVisible: !1,
        qrCodeSrc: '',
        barCodeFoucs: !0,
        inputOrScanFlag: !0, // 默认只支持扫码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    // 扫描二维码加载订单信息
    scanQrCode() {
        // 允许从相机和相册扫码
        wx.scanCode({
            success: res => {
                let result = res.result
                this.setData({
                    scanCodeValue: result
                })
            }
        })
    },

    // 打开手动输入标志
    openInputFlag() {
        this.setData({
            inputOrScanFlag: !1,
            barCodeFoucs: !0
        })
    },

    // 关闭手动输入标志
    closeInputFlag() {
        this.setData({
            inputOrScanFlag: !0,
            barCodeFoucs: !0
        })
    },

    onClose() {
        this.setData({
            showQrCodeVisible: !1
        })
    },
    deleteImg(e) {
        // const order_id = e.currentTarget.dataset.id
        const index2 = e.currentTarget.dataset.index
        const index = e.detail.index
        const {orderList} = this.data
        orderList[index2].factory_img.splice(index,1)
        orderList[index2].fileList.splice(index,1)
        // for(let item of orderList){
        //     if (order_id==item.id){
        //         item.factory_img.splice(index,1)
        //     }
        // }
        this.setData({
            orderList,
        })
    },
    afterRead(e) {
        // const order_id = e.currentTarget.dataset.id
        const {file} = e.detail
        const {index} = e.currentTarget.dataset
        const {orderList} = this.data
        wx.showLoading({
            title: '上传中',
            mask: !0
        })
        app.core.uploadFile({
            url: app.api.default.upload_image,
            name: "image",
            filePath: file.path,
            complete: (t) => {
                wx.hideLoading()
                if (t.data) {
                    let result = JSON.parse(t.data)
                    if (orderList[index].fileList) {
                        orderList[index].fileList.push({...file, url: result.data.url})
                    } else {
                        orderList[index].fileList = []
                        orderList[index].fileList.push({...file, url: result.data.url})
                    }
                    if (orderList[index].factory_img) {
                        orderList[index].factory_img.push(result.data.url)
                    } else {
                        orderList[index].factory_img = []
                        orderList[index].factory_img.push(result.data.url)
                    }
                    // fileListByOrderId.push({
                    //     order_id: e.currentTarget.dataset.id,
                    //     img_list: fileList
                    // })
                    this.setData({
                        orderList
                    })

                }
            }
        })
    },

    // 确认提交
    sureGitOrder() {
        if (0 == this.data.orderList.length) {
            wx.showModal({
                title: '提示',
                content: '未检测到订单存在',
                showCancel: !1,
            })
            return !1
        }
        let tempArray = []
        let tempList = this.data.orderList
        tempList.forEach(item => [
            tempArray.push({
                order_id: item.id,
                img_list: item.factory_img || []
            })
        ])

        // console.log(tempArray);
        // if (true){
        //     return !1
        // }

        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.queen,
            method: 'POST',
            data: {
                order_id: JSON.stringify(tempArray)
            },
            success: res => {
                0 == res.code ? wx.showModal({
                    title: '成功',
                    content: '操作成功',
                    showCancel: !1,
                    success: res => {
                        res.confirm && wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                }) : wx.showModal({
                    title: '异常',
                    content: '系统异常',
                    showCancel: !1,
                    success: res => {
                        res.confirm && wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    onScanCodeChange(e) {
        this.setData({
            scanCodeValue: e.detail
        })
    },

    onScanCodeChange2(e) {
        this.setData({
            scanCodeValue: e.detail.value
        })
        if (this.data.inputOrScanFlag) { // 扫码立即查询结果
            if ('' != this.data.scanCodeValue) {
                this.loadItemByBarCode()
            }
        } else { // 手动输入

        }
    },

    // 根据条形码加载数据
    loadItemByBarCode() {
        console.log('我被调动');
        if ('' == this.data.scanCodeValue) {
            wx.showModal({
                title: '提示',
                content: '请输入条形码',
                showCancel: !1,
                confirmText: '我知道了',
            })
            return
        }
        let flag = !0
        for (let item of this.data.orderList) {
            if (JSON.parse(item.shape)[0] == this.data.scanCodeValue) {
                flag = !1
                break
            }
        }
        // this.data.orderList.forEach(item => {
        //     if (item.shape == this.data.scanCodeValue) {
        //         flag = !1
        //     }
        // })
        if (flag) {
            // 根据条形码发送请求,成功之后更新总价格
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.logist.shapes,
                method: 'POST',
                data: {
                    shape: this.data.scanCodeValue,
                },
                success: res2 => {
                    // let tempList = this.data.orderList
                    if (0 == res2.code) {
                        if ('' == res2.data.shopname) {
                            wx.showModal({
                                title: '提示',
                                content: res2.msg,
                                showCancel: !1
                            })
                        } else {
                            // tempList.push(res2.data)
                            // this.setData({
                            //     orderList: tempList
                            // })

                            let tempList = [], tempTotalPrice = []
                            tempList.push(res2.data)
                            this.setData({
                                orderList: tempList.concat(this.data.orderList),
                            })
                            for (let item of this.data.orderList) {
                                tempTotalPrice.push(Number(item.pay_price))
                            }
                            // this.data.orderList.forEach(item => {
                            //     tempTotalPrice.push(Number(item.pay_price))
                            // })
                            let price = 0
                            tempTotalPrice.forEach(item => {
                                price = price + item
                            })
                            this.setData({
                                orderTotalPrice: parseFloat(price).toFixed(2)
                            })
                        }
                    } else if (1 == res2.code) {
                        wx.showModal({
                            title: '提示',
                            content: res2.msg,
                            showCancel: !1
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                    this.setData({
                        scanCodeValue: '',
                        barCodeFoucs: !0
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '条形码重复',
                showCancel: !1,
                confirmText: '关闭',
            })
        }
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