const site = require('../siteinfo')
module.exports = {
    req({url, method='GET', data={}, header={'content-type':'application/json'}, dataType='json'}){
        // application/x-www-form-urlencoded
        return new Promise((resolve, reject) => {
            wx.request({
                url: site.api + url,
                method,
                data,
                header,
                dataType:dataType,
                success(res){
                    resolve(res)
                },
                fail(err){
                    reject(err)
                }
            })
        })
    },
    req2({url, method='GET', data={}, header={'content-type':'application/x-www-form-urlencoded'}, dataType='json'}){
        // application/x-www-form-urlencoded
        data.from = 'wxapp'
        data.c = 'entry'
        data.a = 'wxapp'
        data.m = 'zh_tcwq'
        data.do = url
        data.i = 17
        return new Promise((resolve, reject) => {
            wx.request({
                url: site.api2,
                method,
                data,
                header,
                dataType:dataType,
                success(res){
                    resolve(res)
                },
                fail(err){
                    reject(err)
                }
            })
        })
    }
}