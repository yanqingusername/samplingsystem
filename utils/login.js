const app = getApp()
var request = require('../utils/request.js')
var box = require('../utils/box.js')

function toLogin(phone,code){
    console.log("utils toLogin方法")
    var data = {
        // openid: app.globalData.openid,
        person_phone: phone,
        password: code
    }
    request.request_get('/eastlogin/login.hn', data, function (res) {
        if(res){
            if(res.success){
                if(res.allow_auto_login == 1 || res.allow_auto_login == 0){
                    let userInfo = res.result[0];
                    app.globalData.userInfo = userInfo;
                    localStorage.setItem('lisPhone',phone);
                    localStorage.setItem('lisPassword',code)

                    
                }

            }else{
                box.showToast(res.msg);
            }
        }
    })
}

module.exports = {
    toLogin: toLogin
}