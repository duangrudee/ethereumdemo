geth --identity "node2" --nodiscover --rpc --rpcport "8545" --rpccorsdomain "localhost" --datadir "privatenode2" --port "30304" --ipcpath "\\.\pipe\geth2.ipc" --autodag --networkid 1234 --nat none --bootnodes="enode://b3f8a16f7aeeb4bf5a4c8ebbee9f94f2f859fec406f3a054e2d12cd4ccca8965cfc8ae759037a577db50c8efe6731dad91ac78e75b96c4f9bb14c70a629bbb46@127.0.0.1:30303?discport=0"  --verbosity 6 console