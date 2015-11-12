#!/bin/bash

while getopts "p:e:" opt; do
  case "$opt" in
    p) port=$OPTARG
      ;;
    e) env=$OPTARG
      ;;
    '?')
      exit 1
      ;;
  esac
done

PORT=${port:-$(( 1024+( $(od -An -N2 -i /dev/random) )%(49151+1) ))}
ENV=${env:-development} 

if [ $ENV = "test" ]; then
  START="PORT=$PORT NODE_ENV=$ENV grunt"
else
  START="PORT=$PORT NODE_ENV=$ENV node index.js"
fi

eval $START
