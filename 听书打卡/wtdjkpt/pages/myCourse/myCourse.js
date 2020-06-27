const app = getApp()
Page({
    data: {},
    onLoad() {
        this.init();
    },
    // 去详情页面
    goCourseInfo(e) {
        const {item} = e.currentTarget.dataset
        if ('2' == item.type) { // 音频
            wx.navigateTo({
              url: `/pages/pages2/play/index?info=${JSON.stringify(item)}`
            })
        } else if ('3' == item.type) { // 视频
            wx.navigateTo({
                url: `/pages/pages2/play/video?info=${JSON.stringify(item)}`
            })
        }
    },
    init() {
        const _that = this;
        app.request({
            url: app.api.default.my_course,
            success: res => {
                if (res.data.length == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '你还没有购买课程，快去购买吧',
                        success: function () {
                            wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    })
                }
                _that.setData({
                    course: res.data
                })
            }
        })
    }
})