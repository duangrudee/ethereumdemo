angular.module('solarchain.controllers', []).
    controller('solarchainController', ['$scope', 'ContractConfig', 'Web3Service', 'SolidityCoderService', //'EthTxService' , 'lodashService', 'keythereumService', 'SolidityFunctionService',
     function($scope, ContractConfig, web3, solcCoder) { //, ethTx, _ , keythereum, solidityFunction) {
        console.log('Active account = ' + web3.eth.accounts[0]);
        var account = web3.eth.accounts[0];
        var filter = web3.eth.filter('latest');
        var contractAddress= ContractConfig.ApolloTrade.address;                      
        var contract = web3.eth.contract(ContractConfig.ApolloTrade.abi).at(contractAddress);   
        var functionHashes = getFunctionHashes(ContractConfig.ApolloTrade.abi);
        
        $scope.transactions = [];

        $scope.buyEnergy = function() {
            $scope.result = "";

            console.log("Buy Amount : " + $scope.buyAmount);
            contract.buyEnergy( $scope.buyAmount, {from: account});     
            console.log(ContractConfig.ApolloTrade.abi);            
        }

        $scope.sellEnergy = function() {
            $scope.result = "";

            console.log("Sell Amount : " + $scope.sellEnergyAmount);
            contract.sellEnergy( $scope.sellEnergyAmount, {from: account});
            console.log(ContractConfig.ApolloTrade.abi);            
        }

        setInterval(function () {
                $scope.$apply( function () {             
                    // Account balance in Ether
                    // var balanceWei = web3.eth.getBalance(account).toNumber();
                    // var balance = web3.fromWei(balanceWei, 'ether');
                    // $scope.currenteth = balance;
                    //console.log("Current ETH = " + $scope.currenteth);

                    // Block number
                    // var number = web3.eth.blockNumber;
                    // if ($scope.blocknum != number)
                    //     $scope.blocknum = number;
                    //console.log("Current blocknum = " + $scope.blocknum);

                    // Contract coin balance: call (not state changing)                    
                    contract.getCoinAccount({from: account}, (error, result) => 
                        $scope.coinBalance = result);
                    //console.log("Current coinBalance = " + $scope.coinBalance);

                    // Contract energy balance: call (not state changing)                    
                    contract.getEnergyAccount({from: account}, (error, result) => 
                        $scope.energyBalance = result);
                    // console.log("Current energyBalance = " + $scope.energyBalance);

                    $scope.villageTotalEnergy = contract.totalEnergy();
                });
             
        }, 1000);
  

        filter.watch(function(error, result){
            if (error) {
                console.log(error);
                return;
            } 
  
            var block = web3.eth.getBlock(result, true);
            console.log('block #' + block.number);
            console.dir(block.transactions);

            for (var index = 0; index < block.transactions.length; index++) {
                var t = block.transactions[index];

                // Decode from
                var sender = t.from==account ? "me" : t.from;

                // Decode function
                var func = findFunctionByHash(functionHashes, t.input);
                if (func == 'sellEnergy') {
                        // This is the sellEnergy() method
                        var inputData = solcCoder.decodeParams(["uint256"], t.input.substring(10));
                        console.dir(inputData);
                        $scope.transactions.push({blockNumber : t.blockNumber, from: sender, to : 'ApolloTrade', transaction : 'sellEnergy(' + inputData[0].toString() + ')'});
                } else if (func == 'buyEnergy') {
                        // This is the buyEnergy() method
                        var inputData = solcCoder.decodeParams(["uint256"], t.input.substring(10));
                        console.dir(inputData);
                        $scope.transactions.push({blockNumber : t.blockNumber, to: sender, from : 'ApolloTrade', transaction : 'buyEnergy(' + inputData[0].toString() + ')'});                    
                } else {
                        // Default log
                        $scope.transactions.push({blockNumber : t.blockNumber, from :  t.to , transaction : t.input });                          
                }

                $scope.$apply();
            }
            });
            

            // function sendTransaction(funcName, contractABI, toAccount, fromAccount) {          
            //     // This is what you get from keythereum when generating a new private key:
            //     var dk = {
            //         "dk": {
            //             "privateKey": {
            //                 "type": "Buffer",
            //                 "data": [
            //                     251,
            //                     130,
            //                     130,
            //                     184,
            //                     46,
            //                     69,
            //                     62,
            //                     86,
            //                     16,
            //                     1,
            //                     166,
            //                     96,
            //                     184,
            //                     89,
            //                     54,
            //                     191,
            //                     54,
            //                     119,
            //                     213,
            //                     251,
            //                     162,
            //                     8,
            //                     241,
            //                     40,
            //                     200,
            //                     21,
            //                     82,
            //                     232,
            //                     200,
            //                     137,
            //                     251,
            //                     135
            //                 ]
            //             },
            //             "iv": {
            //                 "type": "Buffer",
            //                 "data": [
            //                     214,
            //                     200,
            //                     194,
            //                     220,
            //                     251,
            //                     16,
            //                     12,
            //                     200,
            //                     144,
            //                     160,
            //                     41,
            //                     133,
            //                     200,
            //                     56,
            //                     39,
            //                     198
            //                 ]
            //             },
            //             "salt": {
            //                 "type": "Buffer",
            //                 "data": [
            //                     2,
            //                     2,
            //                     82,
            //                     45,
            //                     73,
            //                     187,
            //                     119,
            //                     171,
            //                     227,
            //                     87,
            //                     73,
            //                     56,
            //                     48,
            //                     187,
            //                     180,
            //                     207,
            //                     156,
            //                     112,
            //                     187,
            //                     205,
            //                     194,
            //                     99,
            //                     48,
            //                     150,
            //                     249,
            //                     210,
            //                     117,
            //                     187,
            //                     193,
            //                     153,
            //                     4,
            //                     137
            //                 ]
            //             }
            //         }
            //     };

            //     var privateKey = new Buffer(dk.dk.privateKey.data);
            //     console.log('privateKey');
            //     console.log(privateKey);

            //     // Step 2:
            //     var solidityFunction = new SolidityFunction('', _.find(contractABI, { name: funcName }), '');
            //     console.log('This shows what toPayload expects as an object');
            //     console.log(solidityFunction)

            //     // Step 3:
            //     var payloadData = solidityFunction.toPayload([toAccount, 3]).data;

            //     // Step 4:
            //     gasPrice = web3.eth.gasPrice;
            //     gasPriceHex = web3.toHex(gasPrice);
            //     gasLimitHex = web3.toHex(300000);
            //     console.log('Current gasPrice: ' + gasPrice + ' OR ' + gasPriceHex);

            //     nonce =  web3.eth.getTransactionCount(fromAccount) ;
            //     nonceHex = web3.toHex(nonce);
            //     console.log('nonce (transaction count on fromAccount): ' + nonce + '(' + nonceHex + ')');

            //     var rawTx = {
            //         nonce: nonceHex,
            //         gasPrice: gasPriceHex,
            //         gasLimit: gasLimitHex,
            //         to: walletContractAddress,
            //         from: fromAccount,
            //         value: '0x00',
            //         data: payloadData
            //     };

            //     // Step 5:
            //     var tx = new Tx(rawTx);
            //     tx.sign(privateKey);

            //     var serializedTx = tx.serialize();

            //     web3.eth.sendRawTransaction(serializedTx.toString('hex'), function (err, hash) {
            //         if (err) {
            //             console.log('Error:');
            //             console.log(err);
            //         }
            //         else {
            //             console.log('Transaction receipt hash pending');
            //             console.log(hash);
            //         }
            //     });
            // }

            function getFunctionHashes(abi) {
                var hashes = [];
                for (var i=0; i<abi.length; i++) {
                    var item = abi[i];
                    if (item.type != "function") continue;
                    var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
                    var hash = web3.sha3(signature);
                    console.log(item.name + '=' + hash);
                    hashes.push({name: item.name, hash: hash});
                }
                return hashes;
            }

            function findFunctionByHash(hashes, functionHash) {
                for (var i=0; i<hashes.length; i++) {
                    if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
                    return hashes[i].name;
                }
                return null;
            }
       
    }]);
