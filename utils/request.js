// 参数配置
var apiurl = 'https://store.coyotebio-lab.com/lis_appointment'    //东软信息采集  服务器

// 常用request get封装
function request_get(controller, data, cb) {
    var url = apiurl + controller;
    wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: function (res) {
            //console.log(cb(res.data))
            return typeof cb == "function" && cb(res.data)
        },
        fail: function (res) {
            console.log('request networkTimeout')
            wx.showModal({
                title: "提示",
                showCancel: false,
                content: '请求超时,请检查网络！'
            })
            return typeof cb == "function" && cb(false)
        }
    })
}

// 参数配置
var apicoyote = 'http://182.92.117.128:8885/admin'    //卡尤迪信息采集  服务器
function request_coyote(controller, data, cb) {
    var url = apicoyote + controller;
    wx.request({
        url: url,
        data: data,
        method: 'GET',
        success: function (res) {
            //console.log(cb(res.data))
            return typeof cb == "function" && cb(res.data)
        },
        fail: function (res) {
            console.log('request networkTimeout')
            wx.showModal({
                title: "提示",
                showCancel: false,
                content: '请求超时,请检查网络！'
            })
            return typeof cb == "function" && cb(false)
        }
    })
}


module.exports = {
    request_get: request_get,
    request_coyote: request_coyote
}