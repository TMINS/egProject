import { io } from "socket.io-client";

interface customHeader {
  [propName: string]: any;
}
interface socketOption {
  ws: string; //连接地址
  header?: customHeader;
  reconnectionDelayMax?: number; // 重连次数   默认10000
  connectCallback?: Function;
  errorCallback?: Function;
  [propName: string]: any;
}
interface subscribeType {
  destination: string;
  callback: Function;
  headers?: object;
  [propName: string]: any;
}

const errorReason: Map<string, any> = new Map([
  ["io server disconnect", 1],
  ["io client disconnect", 1],
  ["ping timeout", 0],
  ["transport close", 0],
  ["transport error", 0],
]);

export default class socket {
  ws: string = ""; // 服务地址
  instance: any = null; // io 实例
  header: customHeader | undefined = {}; //请求头参数
  socketOption: socketOption | undefined;
  monitorEvents: Map<string, any> = new Map(); // 消息订阅集合
  waitMonitorEvents: Map<string, any> = new Map(); // 等待队列
  protected connected: boolean = false; // 连接状态
  protected reconnect_num: number = 1; // 重连次数
  max_reconnect_num: number = 5; //最大重连次数

  connectCallback: Function | undefined = undefined; // 连接成功回调
  errorCallback: Function | undefined = undefined; //错误回调

  constructor({ ws, header, connectCallback, errorCallback }: socketOption) {
    this.ws = ws;
    this.header = header; // 请求头信息
    this.connectCallback = connectCallback;
    this.errorCallback = errorCallback;
  }
  async asyncConnect() {
    if (this.connected) {
      //   已连接
      return {
        success: true,
      };
    }
    if (!this.ws) {
      throw "ws is must";
    }
    this.customLog("发起连接");
    this.instance = await io(this.ws, this.header);
    this.instance.on("connect", () => {
      // 成功连接
      this.connected = true;
      this.customLog("connect:websocket 连接成功");
      if (this.waitMonitorEvents.size > 0) {
        for (let destination of this.waitMonitorEvents.values()) {
          this.subscribe(destination);
        }
        this.waitMonitorEvents.clear();
      }
    });
    // 监听连接断开
    this.disconnectError();
    // 监听连接错误
    this.connectError();
  }
  send({ destination, content, callback }: subscribeType) {
    this.instance.emit(destination, content, callback);
  }
  subscribe({ destination, callback, headers }: subscribeType) {
    if (this.connected) {
      // 判断是否订阅
      if (this.monitorEvents.has(destination)) {
        this.unsubscribe(destination);
      }
      this.customLog("客户机订阅事件：" + destination);
      this.monitorEvents.set(
        destination,
        this.instance.on(destination, callback)
      );
    } else {
      // 未连接 将订阅存入等待队列
      if (!this.waitMonitorEvents.has(destination)) {
        // 等待对列不存在订阅事件
        this.waitMonitorEvents.set(destination, {
          destination,
          callback,
          headers,
        });
      }
    }
  }
  unsubscribe(destination: string) {
    if (this.connected) {
      this.instance.off(destination);
      this.monitorEvents.delete(destination);
    }
  }
  disconnect() {
    // 客户机主动断开连接
    if (this.instance) {
      this.instance.disconnect();
    }
  }
  disconnectError() {
    this.customLog("开始监听连接状态");
    if (this.connected) {
      this.instance.on("disconnect", (reason: string, detail: any) => {
        // 连接断开
        this.customLog("连接断开：" + reason);
        this.connected = false;
        if (errorReason.get(reason)) {
          //  显式断开  客户端或者服务端发起的断开 不进行重连
          this.monitorEvents.clear();
          this.waitMonitorEvents.clear();
        } else {
          //  其它error   默认间隔2000ms自动重连
        }
      });
    }
  }
  connectError() {
    this.instance.on("connect_error", (err: any) => {
      this.customLog(err, "error");
      this.reconnect_num++;
      if (this.reconnect_num > this.max_reconnect_num) {
        //
        this.instance.disconnect();
      }
    });
  }
  customLog(message: string, status?: "error" | "default") {
    switch (status) {
      case "error":
        console.log(
          `%c socket.io出现错误：${message} `,
          "border-radius:2px;background:#ee3f4d;padding:4px;"
        );
        break;
      default:
        console.log(
          `%c socket.io消息提示：${message} `,
          "border-radius:2px;background:#66c18c;padding:4px;color:#f9d367;"
        );
        break;
    }
  }
}
