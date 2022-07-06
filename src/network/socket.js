"use strict";
exports.__esModule = true;
var md5 = require("blueimp-md5");
/****** WebSocket 工具类 ******/
/**
 * 为保证 this 指向
 * 内部方法声明使用 方法名(){} 的形式
 * 内部事件声明使用 方法名=()=>{} 的形式
 * 外部事件声明随意
 */
var MySocket = /** @class */ (function () {
    function MySocket() {
        var _this = this;
        /******* WebSocket 事件绑定 *******/
        //开启事件
        this.OnOpen = function () {
            _this.OpenInterval();
        };
        //失败事件
        this.OnError = function () {
            _this.Start();
        };
        //接收事件
        this.OnMessage = function (e) {
            var redata = JSON.parse(e.data);
            if (redata.hasOwnProperty('code') && redata.code != 200) {
                // console.log("$socket err: code!=200");
            }
            if (redata.hasOwnProperty('MsgType') && redata.hasOwnProperty('Data')) {
                //分发
                _this.action[redata.MsgType] && _this.action[redata.MsgType](redata.Data);
            }
        };
        //关闭事件
        this.OnClose = function (e) {
            _this.CloseInterval();
            // console.log('$socket msg: close socket', e);
        };
        /****** 工具类辅助事件 ******/
        //认证
        this.Authen = function (res) {
            _this.id = res.client_id;
            var ran = Math.floor(Math.random() * Math.pow(10, 20)).toString();
            var data = {
                MsgType: 'auth',
                token: '',
                string: ran,
                time: new Date().getTime(),
                app_id: 'csgoskins'
            };
            var temp = _this.id + ran + data.time + data.app_id + 'h2T*V%&cQx6traMr';
            data.token = md5(temp);
            _this.isAuthen = true;
            _this.Send(JSON.stringify(data));
        };
        //开启定时器
        this.OpenInterval = function () {
            var time = 0;
            var dur = 200;
            var heart = 15000;
            _this.timer = setInterval(function () {
                time += dur;
                //处理事件
                if (_this.isAuthen && _this.event.length > 0) {
                    _this.event[0](_this.id);
                    _this.event.splice(0, 1);
                }
                //发送心跳
                if (time > heart) {
                    time = 0;
                    _this.Send('z');
                    // console.log('$socket msg: send heart');
                }
            }, dur);
        };
        //关闭定时器
        this.CloseInterval = function () {
            _this.timer && clearInterval(_this.timer);
            _this.timer = null;
        };
        this.wsurl = process.env.VUE_APP_SOCKET_URL;
        this.action = {};
        this.event = [];
        this.Add('connect', this.Authen);
    }
    //添加事件
    MySocket.prototype.Add = function (name, func) {
        if (!this.action[name])
            this.action[name] = func;
        return this;
    };
    //添加事件
    MySocket.prototype.Event = function (func) {
        this.event[this.event.length] = func;
        return this;
    };
    //移除事件
    MySocket.prototype.Remove = function (name) {
        if (this.action[name])
            delete (this.action[name]);
        return this;
    };
    //测试使用
    MySocket.prototype.Test = function () {
        for (var key in this.action) {
            if (Object.prototype.hasOwnProperty.call(this.action, key)) {
                if (key != 'connect')
                    this.action[key]();
            }
        }
    };
    //启动服务
    MySocket.prototype.Start = function () {
        this.websock && this.Close();
        this.websock = new WebSocket(this.wsurl);
        this.websock.onmessage = this.OnMessage;
        this.websock.onopen = this.OnOpen;
        this.websock.onerror = this.OnError;
        this.websock.onclose = this.OnClose;
        this.isAuthen = false;
    };
    //发送数据
    MySocket.prototype.Send = function (data) {
        this.websock.send(data);
    };
    //关闭服务
    MySocket.prototype.Close = function () {
        this.action = {};
        this.event = [];
        this.websock && this.websock.close();
    };
    return MySocket;
}());
exports["default"] = {
    install: function (Vue) {
        Object.defineProperty(Vue.prototype, '$socket', {
            value: new MySocket(),
            writable: false
        });
    }
};
