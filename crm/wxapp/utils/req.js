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
                },
                complete: ()=>{
                    wx.hideLoading()
                }
            })
        })
    }
}