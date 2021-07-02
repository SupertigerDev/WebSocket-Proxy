const { Proxy } = require("./dist")

const proxy = new Proxy({ newPort: 7001, serverURL: "ws://localhost:7000/ws" })


proxy.on("connection", (client, connectToServer) => {
	client.onmessage = event => {
		const { name, data } = JSON.parse(event.data);
		if (name === "authentication") {
			if (!authenticate(data.token)) {
				client.close();
				return;
			}
			connectToServer()
		}
	}
})