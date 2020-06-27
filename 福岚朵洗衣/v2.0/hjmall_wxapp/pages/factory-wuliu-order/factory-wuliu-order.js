const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderIdList: [],
        party_id: '',
        orderList: [],
        fileList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('我是参数');
        console.log(options);
        if (options.order_id && options.party_id) {
            this.setData({
                orderIdList: options.order_id,
                party_id: options.party_id
            })
        }
        this.loadData()
    },
    deleteImg(e) {
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
        const {index} = e.currentTarget.dataset
        const {file} = e.detail
        // const {fileList = []} = this.data
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
                    // for (let item of orderList){
                    //     if (order_id==item.id){
                    //         if (item.factory_img){
                    //             item.factory_img.push(result.data.url)
                    //         }else{
                    //             item.factory_img=[]
                    //             item.factory_img.push(result.data.url)
                    //         }
                    //         break
                    //     }
                    // }
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
    // 加载数据
    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.order,
            method: 'POST',
            data: {
                order_id: this.data.orderIdList
            },
            success: res => {
                if (0 == res.code) {
                    this.setData({
                        orderList: res.data
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    // 确认订单页面
    sureOrder() {
        const orderidList = []
        const {orderList} = this.data
        // const {fileList} = this.data
        orderList.forEach(item => {
            orderidList.push({
                order_id: item.id,
                img_list: item.factory_img || []
            })
        })
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.logist.cuten,
            method: 'POST',
            data: {
                order_id: JSON.stringify(orderidList)
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