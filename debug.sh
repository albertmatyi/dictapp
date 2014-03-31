#!/bin/bash -x
node-inspector &
chromium http://127.0.0.1:8080/debug?port=5858
NODE_OPTIONS='--debug-brk' meteor
kill -9 %1
