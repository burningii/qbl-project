const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        idNum: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    // 输入许可证号
    onChangeNum(e) {
        this.setData({
            idNum: e.detail.replace(/\s*/g, "")
        })
    },

    // 下一页
    goNextPage() {
        if ('' == this.data.idNum) return wx.showModal({
            title: '提示',
            content: '请输入许可证编号',
            showCancel: !1,
        }),!1

        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: 'get_house_record',
            method: 'POST',
            data: {
                token: app.token,
                recordNo: this.data.idNum,
            }
        }).then(res=>{
            wx.hideLoading()
            const data = res.data
            console.log(data);
            if ('0'==data.err_code){
                if (null==data.data){
                    wx.showModal({
                        title: '提示',
                        content: '未查询到该条记录',
                        showCancel: !1,
                    })
                }else if (data.data.length>0) {
                    // this.setData({
                    //     houseInfo: data.data[0]
                    // })
                    wx.navigateTo({
                      url: `/pages/tenant/page1/page1?data=${JSON.stringify(data.data[0])}&id=${this.data.idNum}&flag=1`
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (!app._isNull(wx.getStorageSync('tenantNo'))){
            if (!app._isNull(wx.getStorageSync('tenantNo').value)){
                this.setData({
                    idNum: wx.getStorageSync('tenantNo').value
                })
            }
        }
    },

    checkData(){
        const obj = {}
        obj.value = ''==this.data.idNum? '':this.data.idNum
        obj.text  = '这是租户提交之前的租赁许可证号'
        wx.setStorageSync('tenantNo', obj);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.checkData()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.checkData()
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