## Add real time logging

`level-static` extend the simple http example,
so that we can track changes as they occur.

``` js
//examples/changes/index.js

{{{!cat index.js}}}
```

start the server...

``` js
tacodb local ./index.js --name changes
```

Then, connect and stream changes like this:

```
curl localhost:8000/_changes
```

Then in another terminal:

```
echo 'Hi!' | curl -sSNT . localhost:8000/hi
echo 'whats up?' | curl -sSNT . localhost:8000/wazzup
echo 'Good Bye!' | curl -sSNT . localhost:8000/bye
```


