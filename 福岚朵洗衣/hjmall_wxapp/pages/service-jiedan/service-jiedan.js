const app = getApp()
let AllFalg = !0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        codeValue: '',
        goodsColumns: [],
        goods: [],
        roleIndex: 0,
        currentGood: null,
        tempImageSrc: '',
        formList: null,
        codeTitleValue: '',
        codeEditFlag: false,
        iconStatus: 'success',
        fieldNum: 1,
        showMobileVisible: false,
        mobileMsg: '',
        phone: '',
        mobileFlag: false,
        currentPageCheckItem: null,
        currentPageCheckIndex: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options)
        this.loadCategory()
    },

    // 保存输入的号码段
    onChangeCodeValue(e) {
        this.setData({
            codeTitleValue: e.detail
        })
    },

    // 修改号码段前缀api.js
    onClickIcon(e) {
        let fieldNum = this.data.fieldNum
        if (1 == fieldNum) { // 保存
            if (!this.data.codeTitleValue) {
                wx.showModal({
                    title: '提示',
                    content: '请输入内容再保存',
                    showCancel: false
                })
            } else {
                this.setData({
                    codeEditFlag: true,
                    iconStatus: 'https://s2.ax1x.com/2019/10/22/K8gA8x.png',
                    fieldNum: 2
                })

                // let tempList = this.data.formList
                // tempList.forEach(item=>{
                //     item.codeValuePrefix = this.data.codeTitleValue
                // })

            }
        } else if (2 == fieldNum) { // 编辑
            this.setData({
                codeEditFlag: false,
                iconStatus: 'success',
                fieldNum: 1
            })
        }
    },

    // 扫码测试
    scanCode(event) {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        wx.scanCode({
            onlyFromCamera: true,
            scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
            success: res => {
                let currentIndex = event.currentTarget.dataset.index
                let tempFormList = this.data.formList
                tempFormList[currentIndex].codeValue = res.result
                tempFormList[currentIndex].codeValueFlag = 1
                this.setData({
                    formList: tempFormList
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    // 选择衣物
    bindCategoryChange(event) {
        let currentIndex = event.currentTarget.dataset.index
        let tempFormList = this.data.formList
        let currnetGoods = this.data.goods[event.detail.value]
        tempFormList[currentIndex].roleIndex = event.detail.value
        tempFormList[currentIndex].currentGood = currnetGoods
        this.setData({
            formList: tempFormList
        })
    },

    // 选择图片
    chooseImage(event) {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                let currentIndex = event.currentTarget.dataset.index
                let tempFormList = this.data.formList
                app.core.uploadFile({
                    url: app.api.default.upload_image,
                    name: "image",
                    filePath: tempFilePaths[0],
                    complete: (t) => {
                        if (t.data) {
                            let result = JSON.parse(t.data)
                            tempFormList[currentIndex].tempImageSrc = result.data.url
                            this.setData({
                                formList: tempFormList
                            })
                        }
                    }
                })
            }
        })
    },

    // 放大图片
    showImage(event) {
        let currentIndex = event.currentTarget.dataset.index
        let imgUrl = this.data.formList[currentIndex].tempImageSrc;
        let array = []
        array.push(imgUrl + '')
        wx.previewImage({
            urls: array, //需要预览的图片http链接列表，注意是数组
            current: '', // 当前显示图片的http链接，默认是第一个
        })
    },

    // 删除图片
    deleteImage(event) {
        let currentIndex = event.currentTarget.dataset.index
        let tempFormList = this.data.formList
        tempFormList[currentIndex].tempImageSrc = ''
        this.setData({
            formList: tempFormList
        })
    },

    // 添加一个条目
    addItem() {
        wx.showLoading({
            title: '执行中',
            mask: !0
        })
        let tempFormList = []
        let formList = this.data.formList
        let tempBbj = {
            codeValue: '',
            roleIndex: 0,
            goodsColumns: this.data.goodsColumns,
            currentGood: this.data.currentGood,
            tempImageSrc: ''
        }
        tempFormList.push(tempBbj) // 添加到头部
        this.setData({
            formList: tempFormList.concat(formList)
        })
        setTimeout(() => {
            wx.hideLoading()
        }, 300)
    },

    // 删除一个条目
    deleteItem(event) {
        wx.showLoading({
            title: '执行中',
            mask: !0
        })
        let currnetIndex = event.currentTarget.dataset.index
        let tempList = this.data.formList
        tempList.splice(currnetIndex, 1)
        this.setData({
            formList: tempList
        })
        setTimeout(() => {
            wx.hideLoading()
        }, 300)
    },

    // 输入条形码
    onChangeValue(event) {
        let currnetIndex = event.currentTarget.dataset.index
        let tempList = this.data.formList
        tempList[currnetIndex].codeValue = event.detail
        tempList[currnetIndex].codeValueFlag = 2
        this.setData({
            formList: tempList
        })
    },

    // 输入手机号
    onInputMobile(e) {
        this.setData({
            phone: e.detail
        })
    },

    // 确定手机号
    onConfirmMobile() {
        const regexPhone = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
        if (!regexPhone.test(this.data.phone)) {
            this.setData({
                mobileMsg: '手机号格式不正确',
                showMobileVisible: true,
                mobileFlag: false
            })
            return
        }
        wx.setStorageSync('customPhone', this.data.phone);
        this.createOrder2()
    },

    // 生成订单
    createOrder() {
        const _that = this
        let tempFormList = this.data.formList
        let flag = true
        // if (!this.data.codeTitleValue) {
        //     wx.showModal({
        //         title: '提示',
        //         content: '请填写条形码前缀',
        //         showCancel: false
        //     })
        //     return
        // }
        tempFormList.forEach(item => {
            if (!item.codeValue) {
                wx.showModal({
                    title: '提示',
                    content: '您有条目暂未填写条形码,请检查',
                    showCancel: false
                })
                flag = false
            }
        })

        if (flag) {
            // app.orderPay.init(_that, app)
            // let s=[]
            // s.push({
            //   mch_id: 0,
            //   goods_list: h
            // })
            // getApp().core.navigateTo({
            //   url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(s)
            // });
            this.setData({
                showMobileVisible: true
            })
        }
    },

    createOrder2() {
        let tempArray = []
        this.data.formList.forEach(item => {
            let goodsid = item.currentGood.id
            //this.data.codeTitleValue+item.codeValue,
            tempArray.push({
                goods_id: goodsid,
                // shape: 1 == item.codeValueFlag ? item.codeValue : this.data.codeTitleValue + item.codeValue,
                shape: item.codeValue,
                tempSrc: item.tempImageSrc
            })
            // this.addCart(goodsid, 1 == item.codeValueFlag ? item.codeValue : this.data.codeTitleValue + item.codeValue, item.tempImageSrc)
        })
        let flag=!0
        for (let i=0;i<tempArray.length-1;i++){
            if (tempArray[i].shape == tempArray[i+1].shape){
                flag=!1
            }
        }
        if (flag){
            tempArray.forEach(item=>{
                this.addCart(item.goods_id, item.shape, item.tempSrc)
            })
            setTimeout(() => {
                let s = []
                wx.showLoading({
                    title: '加载中',
                    mask: !0
                })
                app.request({
                    url: app.api.cart.list,
                    success: res => {
                        let tempList = res.data
                        let tempGoodsList = []
                        let tempMchList = []
                        tempList.list.forEach(item => {
                            tempGoodsList.push({
                                cart_id: item.cart_id
                            })
                        })
                        tempGoodsList.length > 0 && s.push({
                            mch_id: 0,
                            goods_list: tempGoodsList
                        })
                        if (tempList.mch_list.length > 0) {
                            tempList.mch_list.forEach(item2 => {
                                item2.list.forEach(item3 => {
                                    tempMchList.push({
                                        cart_id: item3.cart_id
                                    })
                                })
                                s.push({
                                    mch_id: item2.id,
                                    goods_list: tempMchList
                                })
                            })
                        }
                        getApp().core.navigateTo({
                            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(s)
                        });
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                })
            }, 500)
        } else {
            wx.showModal({
              title: '提示',
              content: '条形码重复',
             showCancel: !1
            })
        }

    },

    // 跳转到商品选择页面
    showGoodsList(e) {
        let currentIndex = e.currentTarget.dataset.index
        // let mch_id = wx.getStorageSync('USER_INFO').mch_id;
        wx.navigateTo({
            url: `/pages/list/list?index=${currentIndex}`
        })
        // wx.navigateTo({
        //     url: `/mch/shop/shop?index=${currentIndex}&mch_id=${mch_id}&tab=2`
        // })
    },

    // 加载所有的商品
    loadCategory() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: wx.getStorageSync('USER_INFO').mch_id || "",
                tab: 2,
            },
            success: res => {
                this.setData({
                    goods: res.data.goods_list,
                    goodsColumns: function () {
                        let newArray = []
                        res.data.goods_list.forEach(item => {
                            newArray.push(item.name)
                        })
                        return newArray
                    }()
                })

                let currnetGoods = this.data.goods[this.data.roleIndex]
                this.setData({
                    currentGood: currnetGoods
                })

                let formList = []
                let tempBbj = {
                    codeValue: '',
                    roleIndex: 0,
                    goodsColumns: this.data.goodsColumns,
                    currentGood: this.data.currentGood,
                    tempImageSrc: ''
                }
                formList.push(tempBbj)
                this.setData({
                    formList: formList
                })

                app.request({
                    url: app.api.default.goods,
                    data: {
                        id: this.data.goods[0].id
                    },
                    success: res => {
                        this.setData({
                            attr_group_list: res.data.attr_group_list
                        })
                        // // 添加一个商品到购物车
                        // this.addCart(this.data.currentGood.id)
                    }
                })

            },
            complete: () => {
                wx.hideLoading()
            }
        });
    },

    addCart(goodsId, shape, photo) {
        AllFalg = !0
        let attr = []
        attr.push({
            attr_group_id: this.data.attr_group_list[0].attr_group_id,
            attr_id: this.data.attr_group_list[0].attr_list[0].attr_id
        })
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: goodsId,
                attr: JSON.stringify(attr),
                num: 1,
                shape: shape,
                phone: photo
            },
            success: res2 => {
                if (1 == res2.code) {
                    AllFalg = !1
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
        // 然后在onshow里面
        const pages = getCurrentPages()
        const currPage = pages[pages.length - 1]  // 当前页
        const index = currPage.data.currentPageCheckIndex
        // console.log(currPage.data);
        if (currPage.data.currentPageCheckItem) {
            let tempList = currPage.data.formList
            tempList[index].currentGood = currPage.data.currentPageCheckItem
            this.setData({
                formList: tempList
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // this.clearCartList()
    },

    /**createOrder
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // this.clearCartList()
    },

    // 离开页面清空购物车
    clearCartList() {
        app.request({
            url: app.api.cart.list,
            success: res => {
                let cartIdArray = []
                let cartList = res.data.list
                cartList.forEach(item => {
                    cartIdArray.push(item.cart_id)
                })
                if (res.data.mch_list) {
                    res.data.mch_list.forEach(item => {
                        item.list.forEach(item2 => {
                            cartIdArray.push(item2.cart_id)
                        })
                    })
                }
                app.request({
                    url: app.api.cart.delete,
                    data: {
                        cart_id_list: cartIdArray
                    },
                    success: res => {

                    }
                })
            }
        })
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