import WebSocket from 'ws';
import queue from 'queue'
import FlakeId from '@brecert/flakeid';

const flake = new FlakeId();

interface Events {
  connection?: (socket: WebSocket, connectToServer: () => void) => void
}

interface Options {
  serverURL: string,
  newPort: number
}
export class Proxy {
  proxy: WebSocket.Server;
  eventListener: Events;
  opts: Options;
  constructor(opts: Options) {
    this.opts = opts;
    this.eventListener = {}
    this.proxy = new WebSocket.Server({ port: opts.newPort })

    this.proxy.on("connection", socket => {
      const id = flake.gen().toString()
      this.eventListener["connection"]?.(socket, () => this.connectToServer(socket))

    })
  }
  on<K extends keyof Events>(event: K, cb: Events[K]) {
    this.eventListener[event] = cb;
  }
  connectToServer(socket: WebSocket) {
    
  }
}