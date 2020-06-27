const app = getApp()
Page({
    data: {
        contact_tel: "",
        show_customer_service: 0,
        userCenterBg: 'https://api1.qibuluo.net/addons/zjhj_mall/core/web/statics/images/user-center/img-user-bg.png',
    },
    onLoad: function (e) {
        getApp().page.onLoad(this, e);
        if (!wx.getStorageSync('ACCESS_TOKEN')) {
            this.setData({
                showUserInfoVisible: true
            })
        } else {
            this.setData({
                showUserInfoVisible: false
            })
            this.loadData()
        }
    },
    showUserInfoFalse() {
        getApp().page.setUserInfoShowFalse()
    },
    loadData: function (e) {
        var t = this;
        t.setData({
            store: getApp().core.getStorageSync(getApp().const.STORE)
        }),wx.showLoading({
            title:'加载中',
            mask: !0
        }),getApp().request({
            url: getApp().api.user.index,
            success: function (o) {
                //  改变申请角色的路径
                let menus = o.data.menus
                if (0 == o.code) {
                    if ("my" == t.data.__platform) o.data.menus.forEach(function (e, t, a) {
                        "bangding" === e.id && o.data.menus.splice(t, 1, 0);
                    });
                    t.setData({
                        showUserInfoVisible: false
                    })
                    let tempMenuList = o.data
                    tempMenuList.menus = undefined
                    t.setData(tempMenuList)
                    app.request({
                        url: app.api.user.result,
                        success: res => {
                            let userMenus={}
                            menus.forEach((item, index) => {
                                if ('yuyue' === item.id) {
                                    item.url = `/pages/order/order?status=0`
                                } else if ('kefu' === item.id) {
                                    if (1 == res.data.verify) {
                                        menus.splice(index, 1)
                                        // 判断是否为收件点角色
                                        if (1==res.data.part_id){
                                            userMenus = {
                                                sign: 'center',
                                                id: 'usercenter',
                                                name: '用户中心',
                                                icon: 'https://api5.qibuluo.net/addons/zjhj_mall/user.png',
                                                open_type: 'navigator',
                                                url: '/pages/user/user-center'
                                            }
                                            let userStore = {
                                                sign: 'center',
                                                id: 'usercenter',
                                                name: '商户登录',
                                                icon: 'https://api5.qibuluo.net/addons/zjhj_mall/user.png',
                                                open_type: 'navigator',
                                                url: '/pages/business-center/index'
                                            }
                                            let userStore2 = {
                                                sign: 'center',
                                                id: 'usercenter',
                                                name: '密码修改',
                                                icon: 'https://api5.qibuluo.net/addons/zjhj_mall/user.png',
                                                open_type: 'navigator',
                                                url: '/pages/business-restPwd/index'
                                            }
                                            menus.push(userStore)
                                            menus.push(userStore2)
                                        }
                                    } else {
                                        item.open_type = 'navigator'
                                        item.url = '/pages/apply-role/apply-role'
                                    }
                                }
                            })
                            Object.keys(userMenus).length>0 && menus.push(userMenus)
                            t.setData({
                                menus: menus
                            })
                            if (2!=res.data.part_id) { // 物流员
                                let _navbar = t.data._navbar;
                                _navbar.navs.forEach((item, index)=>{
                                    '查询'==item.text && _navbar.navs.splice(index, 1)
                                })
                                t.setData({
                                    _navbar: _navbar
                                })
                                wx.setStorageSync('_navbar', _navbar);
                            }
                        }
                    })
                    getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, o.data),
                        getApp().core.setStorageSync(getApp().const.SHARE_SETTING, o.data.share_setting)
                    // getApp().core.setStorageSync(getApp().const.USER_INFO, o.data.user_info);
                }else{
                    let _navbar = t.data._navbar;
                    _navbar.navs.forEach((item, index)=>{
                        '查询'==item.text && _navbar.navs.splice(index, 1)
                    })
                    t.setData({
                        _navbar: _navbar
                    })
                    wx.setStorageSync('_navbar', _navbar);
                    t.setData({
                        showUserInfoVisible: true
                    })
                }

            },
            complete: ()=>{
                wx.hideLoading()
            }
        });
    },
    queryBtn(){
        wx.navigateTo({
          url: '/pages/query-order/query-order'
        })
    },
    // 立即登录
    signNow() {
        getApp().page.setUserInfoShow()
        // this.loadData();
    },
    onReady: function (e) {
        getApp().page.onReady(this);
    },
    onShow: function (e) {
        getApp().page.onShow(this);
        this.loadData();
        // console.log('我执行了user');
    },
    callTel: function (e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function (t) {
        var a = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), o = getApp().getUser();
        1 == a.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != a.share_condition && 2 != a.share_condition || (0 == o.is_distributor ? getApp().core.showModal({
            title: "申请成为" + this.data.store.share_custom_data.words.share_name.name,
            content: "是否申请？",
            success: function (e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: t.detail.formId
                    },
                    success: function (e) {
                        0 == e.code && (0 == a.share_condition ? (o.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (o.is_distributor = 1, getApp().core.navigateTo({
                            url: "/pages/share/index"
                        })), getApp().core.setStorageSync(getApp().const.USER_INFO, o));
                    },
                    complete: function () {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function (e) {
        getApp().core.scanCode({
            onlyFromCamera: !1,
            success: function (e) {
                getApp().core.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function (e) {
                getApp().core.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function () {
        getApp().core.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function (e) {
        var t, a;
        getApp().permission_list && getApp().permission_list.length && (t = getApp().permission_list,
            a = "integralmall", -1 != ("," + t.join(",") + ",").indexOf("," + a + ",")) && getApp().core.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },
    clearCache: function () {
        wx.showActionSheet({
            itemList: ["清除缓存"],
            success: function (e) {
                if (0 === e.tapIndex) {
                    wx.showLoading({
                        title: "清除中..."
                    });
                    getApp().getStoreData();
                    setInterval(function () {
                        wx.hideLoading();
                    }, 1e3);
                }
            }
        });
    },
    completemessage: function (e) {
        var t = this.data.__wxapp_img.cell, a = [t.cell_1.url, t.cell_2.url, t.cell_3.url, t.cell_4.url, t.cell_5.url];
        getApp().core.previewImage({
            current: a[0],
            urls: a
        });
    }
});
