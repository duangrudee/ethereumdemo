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
This will initial the first node, once the node is initiated, on the geth console type in
```sh
> miner.start(1);
```
Then leave this console running

To stop the miner, use 
```sh
>> miner.stop();  
```
	
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

#### To start the node with the account unlocked by default
Start geth with these arguments.

Create a file that contains the passphrase e.g. \PrivateBlockSetup\unlockpass.txt

```sh
geth [Other arguments as in runnode1.bat] --unlock "base account UUID" --password "[Fullpath to working dir]\PrivateBlockSetup\unlockpass.txt"
```
    
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
>admin.addPeer("enode://b3f8a16f7aeeb4bf5a4c8ebbee9f94f2f859fec406f3a054e2d12cd4ccca8965cfc8ae759037a577db50c8efe6731dad91ac78e75b96c4f9bb14c70a629bbb46@127.0.0.1:30303?discport=0");
>admin.peers;
```


## The sample apps

### Greeter 
This is just an example of how to use web3 API from Javascript code. The contract code was copied from Ethereum [Greeter](https://www.ethereum.org/greeter) page
The only compiler of the Solidity contract can be found [here](https://ethereum.github.io/browser-solidity) 


### The Solar Chain 
I started the code by taking most part from [Solarchain-dashboard](https://github.com/tomconte/solarchain-dashboard)
,then modified it to be Angular based with some additional details in Contract code.


### To run the sample app 
Open the folder solarchain/greeter with VS Code
Run 
```sh
cd <Sample app folder>
npm install
npm start
```

### Contributors
* Myself
* (Nutdanai)[https://github.com/Moozz]





