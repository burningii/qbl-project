module.exports = {
    inputPhone(phone) {
        console.log('我耳边');
        console.log(phone);
    },
    showModal({title = '提示', content, showCancel = !0, confirmText = '确定', cancelText = '取消'}) {
        return new Promise((resolve,reject) => {
            wx.showModal({
                title: title,
                content: content,
                showCancel: showCancel,
                confirmText: confirmText,
                cancelText: cancelText,
                success: res => {
                    resolve(res)
                }
            })
        })
    },
}