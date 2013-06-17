
{
  for r in */; do
    echo $r
    pushd $r
    test -f README.md &&  carpenter README.md
    popd
  done
} > README.md
