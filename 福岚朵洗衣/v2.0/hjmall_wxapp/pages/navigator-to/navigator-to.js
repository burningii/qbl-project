const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        party_id: '',
        orderList: [],
        orderOldList: null,
        orderOldListFlag: undefined,

        fileList: [],
        orderTotalPrice: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.party_id && this.setData({
            party_id: options.party_id
        })
        options.part_id && this.setData({
            part_id: options.part_id
        })
        this.loadData(this.data.part_id)
    },

    afterRead(e) {
        const order_id = e.currentTarget.dataset.id
        const {file} = e.detail
        const {index} = e.currentTarget.dataset
        const {fileList = []} = this.data
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

    // 加载数据
    loadData(part_id) {
        if (1 == part_id) {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.logist.logistics,
                method: 'POST',
                data: {
                    party_id: this.data.party_id
                },
                success: res => {
                    // code=1 不是物流员
                    // code=2 不是指定的物流员
                    if (0 == res.code) {
                        this.setData({
                            orderList: res.data
                        })
                    } else if (1 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else if (2 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '抱歉,系统出错',
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        } else if (2 == part_id) {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.logist.cuation,
                method: 'POST',
                data: {
                    party_id: this.data.party_id
                },
                success: res => {
                    if (0 == res.code) {
                        let totalPrice = 0
                        res.data.forEach(item=>{
                            totalPrice += Number(item.pay_price)
                        })
                        this.setData({
                            orderList: res.data,
                            orderTotalPrice: totalPrice,
                            orderOldList: function () {
                                if (null != res.dat) {
                                    return res.dat
                                } else {
                                    return null
                                }
                            }(),
                            orderOldListFlag: function () {
                                if (null != res.dat && res.dat.length > 0) {
                                    return !0
                                } else {
                                    return undefined
                                }
                            }()
                        })
                    } else if (1 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else if (2 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        }
    },

    // 点数确认按钮
    checkAllOrder() {
        if (null == this.data.orderOldList) { // 工厂扫描物流员
            let allOrderList = this.data.orderList
            let tempArrayOrder = []
            // if('2' == this.data.part_id){
                for(let item of allOrderList){
                    tempArrayOrder.push({
                        order_id: item.id,
                        img_list: item.factory_img || []
                    })
                }
            // }else{
            //     for(let item of allOrderList){
            //         tempArrayOrder.push(item.id)
            //     }
            // }

            // allOrderList.forEach(item => {
            //     tempArrayOrder.push(item.id)
            // })
            // console.log(tempArrayOrder);

            // if (true){
            //     return !1
            // }

            wx.showModal({
                title: '提示',
                content: `检测到共有${this.data.orderList.length}条条目信息,请确认`,
                success: res => {
                    res.confirm && (wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }), 1 == this.data.part_id ? (app.request({
                        url: app.api.logist.queen,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
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
                    })) : 2 == this.data.part_id ? (app.request({
                        url: app.api.logist.cuten,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
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
                            }) : 1 == res.code ? (wx.showModal({
                                title: '提示',
                                content: res.msg,
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })) : ''
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })) : '')
                }
            })
        } else if (null != this.data.orderOldList.length && this.data.orderOldList.length > 0) {
            let allOrderList = this.data.orderOldList
            let tempArrayOrder = []
            allOrderList.forEach(item => {
                tempArrayOrder.push(item.id)
            })
            wx.showModal({
                title: '提示',
                content: `检测到共有${allOrderList.length}条条目信息,请确认`,
                success: res => {
                    res.confirm && (wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }), 1 == this.data.part_id ? (app.request({
                        url: app.api.logist.queen,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
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
                    })) : 2 == this.data.part_id ? (app.request({
                        url: app.api.logist.cuten,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
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
                            }) : 1 == res.code ? (wx.showModal({
                                title: '提示',
                                content: res.msg,
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })) : ''
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })) : '')
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '暂时没有要提交的订单',
                showCancel: !1
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