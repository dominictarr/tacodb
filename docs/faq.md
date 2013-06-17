
## what is tacodb based on?

tacodb is based on leveldb, an open source database library, created by google.

## where else is leveldb used?

leveldb was originally developed to be used in google-chrome to implement
[indexedDb](https://developer.mozilla.org/en-US/docs/IndexedDB), it's
also become popular as a back end for a number of database projects.
[riak](http://basho.com/) and [HyperDex](http://hyperdex.org/) both use
a fork of leveldb.

## installation

```
npm install -g tacodb
```

## Why not just use mongo, couch or redis?

tacodb is a responsive database, for responsive applications.

instead of quering the database - you effectively tell the 
database what you are interested in, and then the database
tells you when that changes.

If you are building an application about the real-time interactions of humans,
then tacodb/level is perfect.

## why implement a database in node.js?

node.js is a performant framework for implementing servers,
it combines this tight performant core with a vibrant ecosystem of modules
installed via `npm`, it's package manager.

javascript allows the community to rapidly iterate on new features,
and also dramatically lower the barrier to entry to work on database stuff.

## how do i X?

The core feature set of tacodb/level is very simple,
if you want something complex, the first thing you do is
install a plugin. many are available! most node.js level plugins are 
named `level-SOMETHING`, thus the node.js ecosystem is known as "level-*"

[search level-* modules](https://npmjs.org/search?q=level-&page=0)

## how can I get involved with level-*

join the irc room, ##leveldb on irc.freenode.net.


