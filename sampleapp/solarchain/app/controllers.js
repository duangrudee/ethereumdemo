angular.module('solarchain.controllers', []).
    controller('solarchainController', ['$scope', 'ContractConfig', 'Web3Service', 'SolidityCoderService', //'EthTxService' , 'lodashService', 'keythereumService', 'SolidityFunctionService',
     function($scope, ContractConfig, web3, solcCoder) { //, ethTx, _ , keythereum, solidityFunction) {
        console.log('Active account = ' + web3.eth.accounts[0]);
        var account = web3.eth.accounts[0];
        var filter = web3.eth.filter('latest');
        var contractAddress= ContractConfig.ApolloTrade.address;                      
        var contract = web3.eth.contract(ContractConfig.ApolloTrade.abi).at(contractAddress);   
        var functionHashes = getFunctionHashes(ContractConfig.ApolloTrade.abi);
        updateAccount();        
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

        contract.EnergyBought((err, data) => $scope.$apply(updateAccount));
        contract.EnergySold((err, data) => $scope.$apply(updateAccount));
        contract.InitialEnergySet((err, data) => $scope.$apply(updateAccount));
        
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
                        //$scope.transactions.push({blockNumber : t.blockNumber, from :  t.to , transaction : t.input });                          
                }

                $scope.$apply();
            }
        });
        
        function updateAccount() {
            $scope.coinBalance = contract.getCoinAccount({from: account});
            $scope.energyBalance = contract.getEnergyAccount({from: account});                    
            $scope.villageTotalEnergy = contract.totalEnergy();
        }

        function getFunctionHashes(abi) {
            var hashes = [];
            for (var i=0; i<abi.length; i++) {
                var item = abi[i];
                if (item.type != "function") continue;
                var signature = item.name + "(" + item.inputs.map(input => input.type).join(",") + ")";
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
