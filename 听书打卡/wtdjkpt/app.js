var platform = null;

"undefined" != typeof wx && (platform = "wx"), "undefined" != typeof my && (platform = "my");

var modules = [ {
    name: "helper",
    file: "./utils/helper.js"
}, {
    name: "const",
    file: "./core/const.js"
}, {
    name: "getConfig",
    file: "./core/config.js"
}, {
    name: "page",
    file: "./core/page.js"
}, {
    name: "request",
    file: "./core/request.js"
}, {
    name: "core",
    file: "./core/core.js"
}, {
    name: "api",
    file: "./core/api.js"
}, {
    name: "getUser",
    file: "./core/getUser.js"
}, {
    name: "setUser",
    file: "./core/setUser.js"
}, {
    name: "login",
    file: "./core/login.js"
}, {
    name: "trigger",
    file: "./core/trigger.js"
}, {
    name: "uploader",
    file: "./utils/uploader.js"
}, {
    name: "orderPay",
    file: "./core/order-pay.js"
} ], args = {
    _version: "2.8.9",
    platform: platform,
    query: null,
    onLaunch: function() {
        this.getStoreData();
    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query), this.getUser() && this.trigger.run(this.trigger.events.login);
    },
    imgUrl: 'https://api13.qibuluo.net/addons/zjhj_mall/',
    imgUrl2: 'https://api13.qibuluo.net/addons/zjhj_mall/core/web/uploads/image/',
    countDownTime: 1000*3,
    formatSeconds2(value){
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

        let res = '';
        if(h !== '00') res += `${h}h`;
        if(m !== '00') res += `${m}min`;
        res += `${s}s`;
        return res;
    },
    formatSeconds(value){
        /**
         * 格式化秒
         * @param int  value 总秒数
         * @return string result 格式化后的字符串
         */
        let theTime = parseInt(value);// 需要转换的时间秒
        let theTime1 = 0;// 分
        let theTime2 = 0;// 小时
        let theTime3 = 0;// 天
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
                if(theTime2 > 24){
                    //大于24小时
                    theTime3 = parseInt(theTime2/24);
                    theTime2 = parseInt(theTime2%24);
                }
            }
        }
        let result = '';
        if(theTime > 0){
            result = ""+parseInt(theTime)+"秒";
        }
        if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+"分"+result;
            // result = ""+parseInt(theTime1)+":"+parseInt(theTime)+"";
        }
        if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+"小时"+result;
        }
        if(theTime3 > 0) {
            result = ""+parseInt(theTime3)+"天"+result;
        }
        return result;
    },
    is_login: !1,
    login_complete: !1,
    is_form_id_request: !0
};

for (var i in modules) args[modules[i].name] = require("" + modules[i].file);

var _web_root = args.api.index.substr(0, args.api.index.indexOf("/index.php"));

args.webRoot = _web_root, args.getauth = function(t) {
    var s = this;
    if ("my" == s.platform) {
        if (t.success) {
            var e = {
                authSetting: {}
            };
            e.authSetting[t.author] = !0, t.success(e);
        }
    } else s.core.getSetting({
        success: function(e) {
            console.log(e), void 0 === e.authSetting[t.author] ? s.core.authorize({
                scope: t.author,
                success: function(e) {
                    t.success && (e.authSetting = {}, e.authSetting[t.author] = !0, t.success(e));
                }
            }) : 0 == e.authSetting[t.author] ? s.core.showModal({
                title: "是否打开设置页面重新授权",
                content: t.content,
                confirmText: "去设置",
                success: function(e) {
                    e.confirm ? s.core.openSetting({
                        success: function(e) {
                            t.success && t.success(e);
                        },
                        fail: function(e) {
                            t.fail && t.fail(e);
                        },
                        complete: function(e) {
                            t.complete && t.complete(e);
                        }
                    }) : t.cancel && s.getauth(t);
                }
            }) : t.success && t.success(e);
        }
    });
}, args.getStoreData = function() {
    var s = this, e = this.api, o = this.core;
    s.request({
        url: e.default.store,
        success: function(t) {
            0 == t.code && (o.setStorageSync(s.const.STORE, t.data.store), o.setStorageSync(s.const.STORE_NAME, t.data.store_name), 
            o.setStorageSync(s.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), o.setStorageSync(s.const.CONTACT_TEL, t.data.contact_tel), 
            o.setStorageSync(s.const.SHARE_SETTING, t.data.share_setting), s.permission_list = t.data.permission_list, 
            o.setStorageSync(s.const.WXAPP_IMG, t.data.wxapp_img), o.setStorageSync(s.const.WX_BAR_TITLE, t.data.wx_bar_title), 
            o.setStorageSync(s.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), o.setStorageSync(s.const.STORE_CONFIG, t.data), 
            setTimeout(function(e) {
                s.config = t.data, s.configReadyCall && s.configReadyCall(t.data);
            }, 1e3));
        },
        complete: function() {}
    });
};

var app = App(args);