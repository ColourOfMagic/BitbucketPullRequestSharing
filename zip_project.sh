#!/bin/bash

version=`jq -r '.version' src/manifest.json`

if [[ version == "" ]]; then
  echo "wrong version"
  exit 1
fi

mkdir -p \build
cd src

archive_name="check-pr-v$version.zip"

zip -r ../build/"$archive_name" *

echo "Success! - $archive_name"
