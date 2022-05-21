import { io } from "socket.io-client";

interface customHeader {
  [propName: string]: any;
}
interface socketOption {}
interface subscribeType {
  destination: string;
  callback: Function;
  headers?: object;
}
export default class socket {
  instance: any = null; // io 实例
  header: customHeader = {}; //请求头参数
  monitorEvents: Map<string, any> = new Map(); // 消息订阅集合
  connected: boolean = false; // 连接状态
  reconnect_num: number = 0; // 重连次数
  max_reconnect_num: number = 4; //最大重连次数

  connectCallback: Function | null = null; // 连接成功回调
  errorCallback: Function | null = null; //错误回调

  constructor(ws: string) {
    this.instance = io(ws);
    let data = {};
    // this.instance.connect();
  }
  asyncConnect() {
    if (this.connected) {
      //   已连接
      return {
        success: true,
      };
    }

    if (this.instance) {
      console.log("发起连接");
      //   this.instance.open();
      this.instance.on("connect", () => {
        // 成功连接
        console.log("connect:websocket 连接成功");
      });
    }
  }
  send() {
    this.instance.emit("chat message", "客户机发送信息");
  }

  subscribe({ destination, callback, headers }: subscribeType) {
    if (this.connected) {
      // 判断是否订阅
      if (this.monitorEvents.has(destination)) {
        // this.unsubscribe(destination);
      }
      this.instance.on(destination, callback);
    }
  }
}
