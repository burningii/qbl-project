const siteInfo = require('../siteinfo')
const request = ({url, method="GET",data={},header={'content-type':'application/x-www-form-urlencoded'}, dataType="json"})=>{
    // application/x-www-form-urlencoded
    return new Promise((resolve, reject) => {
        wx.request({
            url: siteInfo.site + url,
            method,
            data,
            header,
            timeout: 0,
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
module.exports = {
    request
}