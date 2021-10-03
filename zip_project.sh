#!/bin/bash

version=`jq -r '.version' src/manifest.json`

if [[ version == "" ]]; then
  echo "wrong version"
  exit 1
fi

mkdir -p \build

archive_name="check-pr-v$version.zip"

zip -r -j ./build/"$archive_name" src/*

echo "Success! - $archive_name"
