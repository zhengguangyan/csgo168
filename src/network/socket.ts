const md5 = require("blueimp-md5");

/****** WebSocket 工具类 ******/
/**
 * 为保证 this 指向
 * 内部方法声明使用 方法名(){} 的形式
 * 内部事件声明使用 方法名=()=>{} 的形式
 * 外部事件声明随意
 */
class MySocket {
    private websock: WebSocket
    private wsurl: string
    private action: { [type: string]: Function }
    private event: Function[]
    private timer: NodeJS.Timeout
    private isAuthen: boolean
    private id: string

    constructor() {
        this.wsurl = process.env.VUE_APP_SOCKET_URL
        this.action = {}
        this.event = []
        this.Add('connect', this.Authen)
    }

    //添加事件
    Add(name: string, func: Function): MySocket {
        if (!this.action[name]) this.action[name] = func
        return this
    }

    //添加事件
    Event(func: Function): MySocket {
        this.event[this.event.length] = func
        return this
    }

    //移除事件
    Remove(name: string): MySocket {
        if (this.action[name]) delete (this.action[name])
        return this
    }

    //测试使用
    Test() {
        for (const key in this.action) {
            if (Object.prototype.hasOwnProperty.call(this.action, key)) {
                if (key != 'connect') this.action[key]()
            }
        }
    }

    //启动服务
    Start(): void {
        this.websock && this.Close()
        this.websock = new WebSocket(this.wsurl)
        this.websock.onmessage = this.OnMessage
        this.websock.onopen = this.OnOpen
        this.websock.onerror = this.OnError
        this.websock.onclose = this.OnClose

        this.isAuthen = false
    }

    //发送数据
    Send(data: string): void {
        this.websock.send(data)
    }

    //关闭服务
    Close(): void {
        this.action = {}
        this.event = []
        this.websock && this.websock.close()
    }

    /******* WebSocket 事件绑定 *******/

    //开启事件
    private OnOpen: any = () => {
        this.OpenInterval()
    }

    //失败事件
    private OnError: any = () => {
        this.Start()
    }

    //接收事件
    private OnMessage: any = e => {
        const redata = JSON.parse(e.data)
        if (redata.hasOwnProperty('code') && redata.code != 200) {
            console.log("$socket err: code!=200")
        }
        if (redata.hasOwnProperty('MsgType') && redata.hasOwnProperty('Data')) {
            //分发
            this.action[redata.MsgType] && this.action[redata.MsgType](redata.Data)
        }
    }

    //关闭事件
    private OnClose: any = e => {
        this.CloseInterval()
        console.log('$socket msg: close socket', e)
    }

    /****** 工具类辅助事件 ******/

    //认证
    private Authen: Function = res => {
        this.id = res.client_id
        let ran: string = Math.floor(Math.random() * Math.pow(10, 20)).toString()

        let data = {
            MsgType: 'auth',
            token: '',
            string: ran,
            time: new Date().getTime(),
            app_id: 'csgoskins',
        }

        const temp = this.id + ran + data.time + data.app_id + 'h2T*V%&cQx6traMr'
        data.token = md5(temp)
        this.isAuthen = true
        this.Send(JSON.stringify(data))
    }

    //开启定时器
    private OpenInterval: Function = () => {
        let time = 0
        let dur = 200
        let heart = 15000
        this.timer = setInterval(() => {
            time += dur
            //处理事件
            if (this.isAuthen && this.event.length > 0) {
                this.event[0](this.id)
                this.event.splice(0, 1)
            }
            //发送心跳
            if (time > heart) {
                time = 0
                this.Send('z')
                console.log('$socket msg: send heart')
            }
        }, dur)
    }

    //关闭定时器
    private CloseInterval: Function = () => {
        this.timer && clearInterval(this.timer)
        this.timer = null
    }
}

export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$socket', {
            value: new MySocket(),
            writable: false
        })
    }
}