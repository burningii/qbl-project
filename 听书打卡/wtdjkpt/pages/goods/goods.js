var WxParse = require("../../wxParse/wxParse.js"),
    shoppingCart = require("../../components/shopping_cart/shopping_cart.js"),
    specificationsModel = require("../../components/specifications_model/specifications_model.js"),
    gSpecificationsModel = require("../../components/goods/specifications_model.js"),
    goodsBanner = require("../../components/goods/goods_banner.js"),
    goodsInfo = require("../../components/goods/goods_info.js"),
    goodsBuy = require("../../components/goods/goods_buy.js"),
    goodsRecommend = require("../../components/goods/goods_recommend.js"), p = 1, is_loading_comment = !1,
    is_more_comment = !0, share_count = 0;
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
    data: {
        pageType: "STORE",
        id: null,
        goods: {},
        show_attr_picker: !1,
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
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0,

        tryModalVisbile: !1,
        lessionList: [],
        play: `${app.imgUrl}player.png`,
        playEnd: `${app.imgUrl}player1.png`,
        playStatus: !0,
        // playText: '播放',
        currentIdx: -1,
        MusicInfo: {
            src: '',
            title: '',
        },
        currentVideoSrc: "",
        lessionProgress: 0,
        currentTime: 0,
        duraction: 0,
        seeOrListen: !1, // 试看或者试听
        tryModalVisbile2: !1
    },
    onCloseTryModal() {
        this.setData({
            tryModalVisbile: !1
        })
    },
    onCloseTryModal2() {
        this.setData({
            tryModalVisbile2: !1
        })
    },
    changePlayStatus(e) {
        if (-1 == this.data.currentIdx) return wx.showToast({
            title: '请选择章节',
            icon: 'none'
        }), !1
        const _this = this
        this.setData({
            playStatus: !_this.data.playStatus
        })

        if (this.data.playStatus) {
            this.endPlay()
        } else {
            this.playStart()
        }

    },

    playStart() {
        const _this = this
        backgroundAudioManager.title = this.data.MusicInfo.title
        backgroundAudioManager.src = this.data.MusicInfo.src
        backgroundAudioManager.play()
        backgroundAudioManager.onPlay(() => {
            console.log('开始了');
            _this.setData({
                playStatus: !1
            })
        })
        setTimeout(() => {
            backgroundAudioManager.onTimeUpdate(() => {
                let progress = parseInt((backgroundAudioManager.currentTime / backgroundAudioManager.duration) * 100)
                _this.setData({
                    lessionProgress: progress,
                    currentTime: app.formatSeconds(backgroundAudioManager.currentTime),
                    duraction: app.formatSeconds(backgroundAudioManager.duration),
                })
                if (0 == backgroundAudioManager.duration) _this.setData({playStatus: !0})
                // console.log(backgroundAudioManager.duration)   //总时长
                // console.log(backgroundAudioManager.currentTime)   //当前播放进度
            })
        }, 500)

        backgroundAudioManager.onStop(() => {
            _this.setData({
                lessionProgress: 0,
                currentTime: '',
                duraction: '',
                playStatus: !0
            })
        })

        // 监听背景音频暂停事件
        backgroundAudioManager.onPause(() => {
            console.log('我暂停了');
            _this.setData({
                playStatus: !0
            })
        })

    },
    endPlay() {
        backgroundAudioManager.pause();
        const _this = this

    },
    // 立即播放
    playerNow(e) {
        const {item,flag} = e.currentTarget.dataset
        if (1 == item.is_sk) { // 可以试看
            this.setData({
                currentIdx: e.currentTarget.dataset.idx,
                currentVideoSrc: item.content
            })
            if ('1'==flag){ // 音频
                this.setData({
                    MusicInfo:{
                        src:item.content,
                        title: item.title
                    }
                }),this.playStart()
            }else if ('2'==flag){
                this.setData({
                    currentVideoSrc: item.content
                })
            }
        } else { // 不可以
            wx.showModal({
                title: '提示',
                content: '该章节需要付费购买',
                showCancel: !1,
            })
        }
    },
    onLoad: function (t) {
        console.log(t.ids, '测试');
        t.type == 1 ? wx.setNavigationBarTitle({
            title: '课程详情',
        }) : t.type == 2 ? wx.setNavigationBarTitle({
            title: '专家详情',
        }) : t.type == 3 ? wx.setNavigationBarTitle({
            title: '技师详情',
        }) : wx.setNavigationBarTitle({
            title: '商品详情'
        });
        this.setData({
            type: t.type || 4
        })
        var _that = this;
        //
        getApp().request({
            url: getApp().api.default.get_artificers,
            data: {
                type: t.type || 2
            },
            success: res => {
                console.log(res.data);
                let arr = res.data.filter(item => {
                    return item.id == t.ids
                });
                _that.setData({
                    basicInfo: arr
                })
                console.log(_that.data.basicInfo);
                wx.setStorageSync('data', JSON.stringify(_that.data.basicInfo[0]))
                console.log(res, '+++++');
            }
        })
        console.log(t);
        getApp().page.onLoad(this, t);
        var o = this;
        share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1));
        var e = t.quick;
        if (e) {
            var a = getApp().core.getStorageSync(getApp().const.ITEM);
            if (a) var i = a.total, s = a.carGoods; else i = {
                total_price: 0,
                total_num: 0
            }, s = [];
            o.setData({
                quick: e,
                quick_list: a.quick_list,
                total: i,
                carGoods: s,
                quick_hot_goods_lists: a.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var n = decodeURIComponent(t.scene);
            if (void 0 !== n) {
                var d = getApp().helper.scene_decode(n);
                d.uid && d.gid && (t.id = d.gid);
            }
        } else if (null !== getApp().query) {
            var c = getApp().query;
            getApp().query = null, t.id = c.gid;
        }
        o.setData({
            id: t.id
        }), o.getGoods(), o.getCommentList(), o.getAr;
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart),
            gSpecificationsModel.init(this), goodsBanner.init(this), goodsInfo.init(this), goodsBuy.init(this);
        goodsRecommend.init(this);
        var t = getApp().core.getStorageSync(getApp().const.ITEM);
        if (t) var o = t.total, e = t.carGoods, a = this.data.goods_num; else o = {
            total_price: 0,
            total_num: 0
        }, e = [], a = 0;
        this.setData({
            total: o,
            carGoods: e,
            goods_num: a
        });
    },
    onHide: function () {
        this.endPlay()
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    onUnload: function () {
        this.endPlay()
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    onPullDownRefresh: function () {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function () {
        getApp().page.onReachBottom(this);
        var t = this;

        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var o = this, t = getApp().getUser();
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + t.id,
            success: function (t) {
                1 == ++share_count && o.shareSendCoupon(o);
            },
            title: o.data.goods.name,
            imageUrl: o.data.goods.pic_list[0]
        };
    },
    closeCouponBox: function (t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function (t) {
        var o = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: o
        });
    },
    getGoods: function () {
        var n = this;
        if (n.data.quick) {
            var t = n.data.carGoods;
            if (t) {
                for (var o = t.length, e = 0, a = 0; a < o; a++) t[a].goods_id == n.data.id && (e += parseInt(t[a].num));
                n.setData({
                    goods_num: e
                });
            }
        }
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: n.data.id
            },
            success: function (t) {
                if (0 == t.code) {
                    var o = t.data.detail;
                    WxParse.wxParse("detail", "html", o, n);
                    var e = t.data;
                    e.attr_pic = t.data.attr_pic, e.cover_pic = t.data.pic_list[0].pic_url;
                    var a = e.pic_list, i = [];
                    for (var s in a) i.push(a[s].pic_url);
                    //数据处理
                    n.setData({
                        lessionList: t.data.article
                    })
                    if (3 == t.data.courseData.type) { // 视频
                        n.setData({
                            seeOrListen: !1
                        })
                    } else if (2 == t.data.courseData.type) { // 音频
                        n.setData({
                            seeOrListen: !0
                        })
                    }
                    n.data.type == 2 ? e.min_price = n.data.basicInfo[0].price : e.min_price;
                    console.log(n.data.basicInfo);
                    e.pic_list = i, n.data.type == 2 ? e.price = n.data.basicInfo[0].price : '', n.setData({
                        goods: e,
                        attr_group_list: t.data.attr_group_list,
                        btn: !0
                    }), n.goods_recommend({
                        goods_id: t.data.id,
                        reload: !0
                    }), n.selectDefaultAttr();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    getCommentList: function (o) {
        var e = this;
        o && "active" != e.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0,
            getApp().request({
                url: getApp().api.default.comment_list,
                data: {
                    goods_id: e.data.id,
                    page: p
                },
                success: function (t) {
                    0 == t.code && (is_loading_comment = !1, p++, e.setData({
                        comment_count: t.data.comment_count,
                        comment_list: o ? e.data.comment_list.concat(t.data.list) : t.data.list
                    }), 0 == t.data.list.length && (is_more_comment = !1));
                }
            }));
    },
    tabSwitch: function (t) {
        "detail" == t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function (t) {
        var o = t.currentTarget.dataset.index, e = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[o].pic_list[e],
            urls: this.data.comment_list[o].pic_list
        });
    }
});