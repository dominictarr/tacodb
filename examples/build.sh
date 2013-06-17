#! /usr/bin/env bash

{
  for r in */; do
    pushd $r > /dev/null
    test -f README.md && carpenter README.md
    popd
  done
} > README.md
