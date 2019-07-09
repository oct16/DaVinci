#!/bin/bash

echo "rsync to deply server"
rsync -arvz ./* root@148.70.114.23:/root/DaVinci --exclude=server/node_modules --exclude=client/node_modules
echo "rsync is finish"
