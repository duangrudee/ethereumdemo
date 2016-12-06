geth --datadir "testnet/data" init testnet_genesis.json 
geth --datadir "testnet/data" --networkid 3 --rpc --rpcport "9000" --rpccorsdomain "*" console