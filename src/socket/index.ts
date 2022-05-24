import { io } from "socket.io-client";

interface customHeader {
  [propName: string]: any;
}
interface socketOption {}
interface subscribeType {
  destination: string;
  callback: Function;
  headers?: object;
  [propName: string]: any;
}

const errorReason = new Map([
  // ['name', '张三'],
  // ['title', 'Author']
  // ['io server disconnect', {}],
  // ['io client disconnect', '1'],
  // "io client disconnect" : 1,
  // "ping timeout" : 0,
  // "transport close" : 0,
  // "transport error" : 0
]);
export default class socket {
  instance: any = null; // io 实例
  header: customHeader = {}; //请求头参数
  monitorEvents: Map<string, any> = new Map(); // 消息订阅集合
  connected: boolean = false; // 连接状态
  reconnect_num: number = 1; // 重连次数
  max_reconnect_num: number = 5; //最大重连次数

  connectCallback: Function | null = null; // 连接成功回调
  errorCallback: Function | null = null; //错误回调

  constructor(ws: string) {
    this.instance = io(ws);
    this.connected = true;
    this.disconnectError();
    // this.asyncConnect();
    this.instance.on("connect", (res: any) => {
      console.log("连接", res);
    });

    this.instance.on("connect_error", (err: any) => {
      console.log("出现错误", err);
      this.reconnect_num++;
      console.log(this.reconnect_num);
      if (this.reconnect_num > this.max_reconnect_num) {
        //
        this.instance.disconnect();
      }
    });
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
      this.instance.on("connect", () => {
        // 成功连接
        this.connected = true;
        console.log("connect:websocket 连接成功");
      });
    }
  }
  send({ destination, content, callback }: subscribeType) {
    this.instance.emit(destination, content);
  }
  subscribe({ destination, callback, headers }: subscribeType) {
    if (this.connected) {
      // 判断是否订阅
      if (this.monitorEvents.has(destination)) {
        this.unsubscribe(destination);
      }
      console.log("客户机订阅事件：" + destination);
      this.monitorEvents.set(
        destination,
        this.instance.on(destination, callback)
      );
    } else {
      // 未连接 将订阅存入等待队列
    }
  }
  unsubscribe(destination: string) {
    this.monitorEvents.delete(destination);
  }
  disconnect() {
    // 客户机主动断开连接
    if (this.instance) {
      this.instance.disconnect();
    }
  }
  disconnectError() {
    console.log("开始监听连接状态");
    if (this.connected) {
      this.instance.on("disconnect", (reason: string, detail: any) => {
        // 连接断开
        console.log("连接断开：" + reason);
        this.connected = false;
        // if(errorReason.reason)
      });
    }
  }
}
