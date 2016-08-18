angular.module('solarchain.controllers', []).

    controller('solarchainController', ['$scope', 'ContractConfig', 'Web3Service', function($scope, ContractConfig, web3) {
        console.log('Active account = ' + web3.eth.accounts[0]);
        var account = web3.eth.accounts[0];
        var filter = web3.eth.filter('latest');
        var contractAddress= ContractConfig.ApolloTrade.address;                      
        var contract = web3.eth.contract(ContractConfig.ApolloTrade.abi).at(contractAddress);   
        var functionHashes = getFunctionHashes(ContractConfig.ApolloTrade.abi);
        
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

        setInterval(function() {
                // Account balance in Ether
                var balanceWei = web3.eth.getBalance(account).toNumber();
                var balance = web3.fromWei(balanceWei, 'ether');
                $scope.currenteth = balance;
                //console.log("Current ETH = " + $scope.currenteth);

                // Block number
                var number = web3.eth.blockNumber;
                if ($scope.blocknum != number)
                    $scope.blocknum = number;
                //console.log("Current blocknum = " + $scope.blocknum);

                // Contract coin balance: call (not state changing)
                var coinBalance = contract.getCoinAccount.call();
                $scope.coinBalance = coinBalance;
                //console.log("Current coinBalance = " + $scope.coinBalance);

                // Contract energy balance: call (not state changing)
                var energyBalance = contract.getEnergyAccount.call();
                $scope.energyBalance = energyBalance;
               // console.log("Current energyBalance = " + $scope.energyBalance);
                $scope.$apply();

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
                        var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
                        console.dir(inputData);
                        $scope.transactions.push({blockNumber : t.blockNumber, from: sender, to : 'ApolloTrade', transaction : 'sellEnergy(' + inputData[0].toString() });
                        
                } else if (func == 'buyEnergy') {
                        // This is the buyEnergy() method
                        var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
                        console.dir(inputData);

                        $scope.transactions.push({blockNumber : t.blockNumber, from: sender, to : 'ApolloTrade', transaction : 'buyEnergy(' + inputData[0].toString() });                    
                } else {
                        // Default log
                        $scope.transactions.push({blockNumber : t.blockNumber, from :  t.to , transaction : t.input });                          
                }

                $scope.$apply();
            }
            });


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
