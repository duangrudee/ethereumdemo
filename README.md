# ethereumdemo
My learning space on Ethereum

## To Setup a private blockchain using geth
```sh
> cd PrivateBlockSetup
> initgenesis.bat
```

This will create 2 nodes, the first node is the main bootnode and the second one will refer to the main node as it peers


## Working with Main node
```sh
> runnode1.bat
```
This will initial the first node, once the node is initiated type
	* miner.start(1);
	* leave this console running
	* miner.stop();  //to stop the miner
	

Use "geth attach" from another console to create and unlock the account
#### To create an account
```sh
   > personal.newAccount('passphase');
   > personal.unlockAccount(eth.accounts[0], 'passphase');
   > personal.newAccount('passphase1');
   > personal.unlockAccount(eth.accounts[1], 'passphase1');
   > admin.nodeInfo; 	//copy enode info to use in node2
```
You can use ethereume UI wallet to interact with this main node.
   
 
## Working with node2
```sh
> runnode2.bat
```
Mining on node2 while main node is running doesn't work in this geth version, if you want node 2 to mine its own ethers, please consider using ethermine.exe

### To attach to node 2
```sh
> geth attach ipc:\\.\pipe\geth2.ipc
```

Manually add node 1 as peer , in javascript console type
(Replace node address with the information you get from node 1 from admin.nodeInfo Command
```sh
>admin.addPeer("enode://b3f8a16f7aeeb4bf5a4c8ebbee9f94f2f859fec406f3a054e2d12cd4ccca8965cfc8ae759037a577db50c8efe6731dad91ac78e75b96c4f9bb14c70a629bbb46@127.0.0.1:30303?discport=0"");

> admin.peers;
```





