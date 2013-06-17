#! /usr/bin/env bash

{
  for r in http changes ws; do
    pushd $r > /dev/null
    test -f README.md && carpenter README.md
    popd > /dev/null
  done
} > README.md
