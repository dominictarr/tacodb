# tacodb

reusable leveldb server

## Synopsis

tacodb wraps leveldbs in a server such that it would be possible
to create a hosted service with it, that can be connected to via
http and WebSockets.

You database is configured by writing a .js file, which is then
bundled (a la browserify) and sent to the tacodb server via http.

{{{!cat ./docs/getting-started.md}}}
{{{!cat ./examples/README.md}}}
## License

MIT
