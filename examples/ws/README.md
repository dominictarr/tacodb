## connect to tacodb/level over websockets

Create a streaming connection with websockets!

First, the server:

``` js
//examples/ws/server.js

{{{!cat ./server.js}}}
```

Then, the client.

``` js
//examples/ws/client.js

{{{!cat ./client.js}}}
```

this client can be used from both the browser and node.js!

start the server
``` sh
tacodb local server.js --name ws
```

connect from node:

``` sh
node client.js
```

or from the [browser](http://localhost:8000/)


