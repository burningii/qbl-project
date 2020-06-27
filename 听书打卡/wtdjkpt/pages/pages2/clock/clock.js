const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text: '',
        fileList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (op) {
        op.orderNo && this.setData({orderNo: op.orderNo}),
        op.id && this.setData({id: op.id}), this.loadData()
    },
    deleteImg(e) {
        const {fileList = []} = this.data
        fileList.splice(e.detail.index, 1)
        this.setData({fileList})
    },
    // 加载课程数据
    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_mycourse,
            data: {
                course_id: this.data.id,
            },
            success: res => {
                this.setData({
                    info: res.data
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    onChangeInput(e) {
        this.setData({
            text: e.detail.replace(/\s*/g, "")
        })
    },

    afterRead(event) {
        const {file} = event.detail;
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.core.uploadFile({
            url: app.api.default.upload_image,
            filePath: file.path,
            name: "image",
            success: res => {
                // 上传完成需要更新 fileList
                const {fileList = []} = this.data;
                const url = JSON.parse(res.data).data.url
                fileList.push({url: url});
                this.setData({fileList});
            },
            complete: function () {
                app.core.hideLoading();
            }
        });
    },

    // 立即打卡
    clockRight() {
        if ('' == this.data.text) return wx.showModal({
            title: '提示',
            content: '请输入心得',
            showCancel: !1,
        }), !1
        if (0 == this.data.fileList) return wx.showModal({
            title: '提示',
            content: '请上传图片',
            showCancel: !1,
        }), !1
        this.goClock()
    },

    goClock(){
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.course.clock,
            method: 'POST',
            data: {
                content: this.data.text,
                img: JSON.stringify(this.data.fileList),
                orderNo: this.data.orderNo,
                course_id:this.data.info.id
            },
            success: res => {
                if (0 == res.code) {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                        success: res2 => {
                            if (res2.confirm) {
                                this.loadData()
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
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