## connecting to tacodb/level via http

Create a database customization file...
This will expose an http interface,
that can store files inside leveldb.

### simple http access

``` js
//examples/http/index.js

{{{!cat index.js}}}
```

``` 
>tacodb local static.js --name static
listening on 8000
```

This starts a tacodb server running around your `db.js` file.

``` sh
#http PUT hi = HELLO
echo 'HELLO!' | curl -sSNT . localhost:8000/hi
#http GET hi
curl localhost:8000/hi
HELLO!
```


