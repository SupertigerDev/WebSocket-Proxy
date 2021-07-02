const { Proxy } = require("./dist")

const proxy = new Proxy({ newPort: 7001, serverURL: "ws://localhost:7000/ws" })


proxy.on("connection", (client, connectToServer) => {
	console.log("connected")
  let joined = false;
  let authenticated = false;
  let user_id = null;
  let channel_id = null;

	client.onmessage = event => {
    const { method, params } = JSON.parse(event.data);

    if (method === "authenticate") {
      const token = params.token;
      user_id = Math.random().toString()
      channel_id = params.channel_id;
      client.send(JSON.stringify({
        jsonrpc: "2.0",
        method: "authenticated",
        params: {user_id, channel_id}
      }))
      connectToServer()
    }
    if (method === "join") {
      const joinChannelId = params.sid;
      const joinUserId = params.uid;
      if (user_id !== joinUserId || joinChannelId !== channel_id) {
        client.close();
        return;
      }

    }
    
	}
})