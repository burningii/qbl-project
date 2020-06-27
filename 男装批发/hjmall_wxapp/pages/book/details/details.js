var utils = require("../../../utils/helper.js"), WxParse = require("../../../wxParse/wxParse.js"), gSpecificationsModel = require("../../../components/goods/specifications_model.js"), goodsBanner = require("../../../components/goods/goods_banner.js"), goodsInfo = require("../../../components/goods/goods_info.js"), goodsBuy = require("../../../components/goods/goods_buy.js"), p = 1, is_loading_comment = !1, is_more_comment = !0;

Page({
    data: {
        pageType: "BOOK",
        hide: "hide",
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        checkedAttrList:[],
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = t.user_id, o = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== o) {
            var a = utils.scene_decode(o);
            a.uid && a.gid ? (a.uid, t.id = a.gid) : o;
        } else if (null !== getApp().query) {
            var i = getApp().query;
            getApp().query = null, t.id = i.gid, i.uid;
        }
        this.setData({
            id: t.id
        }), p = 1, this.getGoodsInfo(t), this.getCommentList(!1);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), gSpecificationsModel.init(this), goodsBanner.init(this), 
        goodsInfo.init(this), goodsBuy.init(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        this.getCommentList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var e = this, o = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            title: e.data.goods.name,
            path: "/pages/book/details/details?id=" + e.data.goods.id + "&user_id=" + o.id,
            imageUrl: e.data.goods.pic_list[0],
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var e = t.id, i = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.details,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.info.detail;
                    WxParse.wxParse("detail", "html", e, i);
                    var o = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    t.data.attr_group_list.length <= 0 && (t.data.attr_group_list = [ {
                        attr_group_name: "规格",
                        attr_list: [ {
                            attr_id: 0,
                            attr_name: "默认",
                            checked: !0
                        } ]
                    } ]);
                    const myFormatData = ()=>{
                        const attrList = t.data.attr_group_list
                        let sizeList =  attrList.filter(item => {
                            return '尺码' == item.attr_group_name
                        })
                        for (let item of sizeList) {
                            // item.group_name =  t.data.attr_group_list[0].attr_list[0].attr_name
                            // item.group_id =  t.data.attr_group_list[0].attr_list[0].attr_id
                            for (let item2 of item.attr_list) {
                                item2.attr_num = 0
                            }
                        }
                        t.data.attr_group_list[0].attr_list[0].checked = !0
                        t.data.attr_group_list[0].attr_list[0].attr_num_0 = !1
                        t.data.attr_group_list[0].attr_list.forEach(item => {
                            item.attr_nums = 0
                        })
                        i.setData({
                            goods: t.data.info,
                            shop: t.data.shopList,
                            sales: o,
                            attr_group_list: t.data.attr_group_list,
                            mySizeList: sizeList,
                        })
                    }
                    var a = t.data.info;
                    a.num = t.data.info.stock, a.min_price = .01 < t.data.info.price ? t.data.info.price : "免费预约", 
                    a.price = .01 < t.data.info.price ? t.data.info.price : "免费预约", a.sales_volume = t.data.info.sales, 
                    a.service_list = t.data.info.service, myFormatData(), i.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    // 减少
    myNumberSub(e) {
        console.log('----触发减少----');
        const {checkedAttrList = [], attr_group_list, mySizeList} = this.data
        const {info, index} = e.currentTarget.dataset
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_num -= 1
        if (currentNum < 0) {
            return
        }
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`mySizeList[0].attr_list[${index}].attr_num`]: currentNum
        })
        let group_name = ''
        let group_id = ''
        for (let item of newAttrList) {
            for (let item2 of item.attr_list) {
                if (void 0 != item2.checked && item2.checked == !0) {
                    group_name = item2.attr_name
                    group_id = item2.attr_id
                    break
                }
            }
        }
        if (checkedAttrList.length > 0) {
            for (let i = 0; i < checkedAttrList.length; i++) {
                if (checkedAttrList[i].group_name && checkedAttrList[i].group_name == group_name) {
                    if (checkedAttrList[i].list && checkedAttrList[i].list.length > 0) {
                        for (let j = 0; j < checkedAttrList[i].list.length; j++) {
                            if (checkedAttrList[i].list[j].attr_name == info.attr_name) {
                                if (0 == currentNum) {
                                    checkedAttrList[i].list.splice(j--, 1)
                                } else {
                                    checkedAttrList[i].list[j].attr_num = currentNum
                                }
                            } else {
                                let flag1 = !0
                                for (let k = 0; k < checkedAttrList[i].list.length; k++) {
                                    if (checkedAttrList[i].list[k].attr_name == info.attr_name) {
                                        flag1 = !1
                                    }
                                }
                                flag1 && checkedAttrList[i].list.push({
                                    attr_name: info.attr_name,
                                    attr_id: info.attr_id,
                                    attr_num: currentNum
                                })
                            }
                        }
                    } else {
                        checkedAttrList[i].list.push({
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        })
                    }
                } else {
                    let flag1 = !0
                    for (let k = 0; k < checkedAttrList.length; k++) {
                        if (checkedAttrList[k].group_name == group_name) {
                            flag1 = !1
                            break
                        }
                    }

                    flag1 && checkedAttrList.push({
                        group_name: group_name,
                        group_id: group_id,
                        list: [{
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        }]
                    })
                }
            }
        } else if (0 == checkedAttrList.length) {
            checkedAttrList.push({
                group_name: group_name,
                group_id: group_id
            })
            checkedAttrList[0].list = []
            checkedAttrList[0].list.push({
                attr_name: info.attr_name,
                attr_id: info.attr_id,
                attr_num: currentNum
            })
        }
        let totalNums=0
        checkedAttrList.forEach(item=>{
            if (item.group_id==group_id){
                item.list.forEach(item2=>{
                    totalNums += item2.attr_num
                })
            }
        })
        attr_group_list[0].attr_list.forEach(item=>{
            if (item.attr_id==group_id){
                item.attr_nums = totalNums
            }
        })
        // checkedAttrList.push(str)
        this.setData({
            checkedAttrList,attr_group_list
        })
    },
    // 增加
    myNumberAdd(e) {
        console.log('----触发增加----');
        const {checkedAttrList = [], attr_group_list, mySizeList} = this.data
        const {info, index} = e.currentTarget.dataset
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_num += 1
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`mySizeList[0].attr_list[${index}].attr_num`]: currentNum
        })
        let group_name = ''
        let group_id = ''
        // 获取选中的组名和组ID
        for (let item of newAttrList) {
            for (let item2 of item.attr_list) {
                if (void 0 != item2.checked && item2.checked == !0) {
                    group_name = item2.attr_name
                    group_id = item2.attr_id
                    break
                }
            }
        }

        if (checkedAttrList.length > 0) {
            for (let i = 0; i < checkedAttrList.length; i++) {
                if (checkedAttrList[i].group_name && checkedAttrList[i].group_name == group_name) {
                    if (checkedAttrList[i].list && checkedAttrList[i].list.length > 0) {
                        for (let j = 0; j < checkedAttrList[i].list.length; j++) {
                            if (checkedAttrList[i].list[j].attr_name == info.attr_name) {
                                if (0 == currentNum) {
                                    checkedAttrList[i].list.splice(j--, 1)
                                } else {
                                    checkedAttrList[i].list[j].attr_num = currentNum
                                }
                            } else {
                                let flag1 = !0
                                for (let k = 0; k < checkedAttrList[i].list.length; k++) {
                                    if (checkedAttrList[i].list[k].attr_name == info.attr_name) {
                                        flag1 = !1
                                    }
                                }
                                flag1 && checkedAttrList[i].list.push({
                                    attr_name: info.attr_name,
                                    attr_id: info.attr_id,
                                    attr_num: currentNum
                                })
                            }
                        }
                    } else {
                        checkedAttrList[i].list.push({
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        })
                    }
                } else {
                    let result = checkedAttrList.find(item => {
                        return item.group_name == group_name
                    })
                    void 0 === result && checkedAttrList.push({
                        group_name: group_name,
                        group_id: group_id,
                        list: [{
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        }]
                    })
                }
            }
        } else if (0 == checkedAttrList.length) {
            checkedAttrList.push({
                group_name: group_name,
                group_id: group_id,
                list: [{
                    attr_name: info.attr_name,
                    attr_id: info.attr_id,
                    attr_num: currentNum
                }]
            })
        }
        console.log('----增加后---',checkedAttrList);
        console.log('----mySizeList---',this.data.mySizeList);
        let totalNums=0
        checkedAttrList.forEach(item=>{
            if (item.group_id==group_id){
                item.list.forEach(item2=>{
                    totalNums += item2.attr_num
                })
            }
        })
        attr_group_list[0].attr_list.forEach(item=>{
            if (item.attr_id==group_id){
                item.attr_nums = totalNums
            }
        })
        this.setData({
            checkedAttrList,
            attr_group_list
        })
    },
    tabSwitch: function(t) {
        "detail" == t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var e = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[e].pic_list[o],
            urls: this.data.comment_list[e].pic_list
        });
    },
    // 立即预约
    bespeakNow: function(t) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        // for (var o = [], a = !0, i = e.data.attr_group_list, s = 0; s < i.length; s++) {
        //     var n = i[s].attr_list;
        //     a = !0;
        //     for (var r = 0; r < n.length; r++) n[r].checked && (o.push({
        //         attr_group_id: i[s].attr_group_id,
        //         attr_id: n[r].attr_id,
        //         attr_group_name: i[s].attr_group_name,
        //         attr_name: n[r].attr_name
        //     }), a = !1);
        //     if (a) return void getApp().core.showModal({
        //         title: "提示",
        //         content: "请选择" + i[s].attr_group_name,
        //         showCancel: !1
        //     });
        // }

        // 验证
        const {checkedAttrList} = e.data
        if (0 == checkedAttrList.length){
            return wx.showToast({
                title: '请选择颜色或尺码',
                icon: 'none'
            }),!1
        }else{
            let flag = checkedAttrList.findIndex(value => value.list.length>0)
            if (flag==-1){
                return wx.showToast({
                    title: '请选择颜色或尺码',
                    icon: 'none'
                }), !1
            }
        }

        var d = [ {
            id: e.data.goods.id,
            // attr: o
            attr: JSON.stringify(e.data.checkedAttrList)
        } ];
        getApp().core.redirectTo({
            url: `/pages/book/submit/submit?goods_info=${JSON.stringify(d)}&attr_list=${JSON.stringify(e.data.attr_group_list)}`
        });
    },
    goToShopList: function(t) {
        getApp().core.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(e) {
        var o = this;
        e && "active" != o.data.tab_comment || is_loading_comment || (is_loading_comment = !0, 
        getApp().request({
            url: getApp().api.book.goods_comment,
            data: {
                goods_id: o.data.id,
                page: p
            },
            success: function(t) {
                0 == t.code && (is_loading_comment = !1, p++, o.setData({
                    comment_count: t.data.comment_count,
                    comment_list: e ? o.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (is_more_comment = !1));
            }
        }));
    }
});