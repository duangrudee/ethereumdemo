angular.module('solarchain.controllers', ['ngAnimate', 'toastr']).
    controller('solarchainController', ['$scope', 'toastr', 'ContractConfig', 'Web3Service', 'SolidityCoderService', //'EthTxService' , 'lodashService', 'keythereumService', 'SolidityFunctionService',
     function($scope, toastr, ContractConfig, web3, solcCoder) { //, ethTx, _ , keythereum, solidityFunction) {
        console.log('Active account = ' + web3.eth.accounts[0]);
        var account = web3.eth.accounts[0];
        var filter = web3.eth.filter('latest');
        var contractAddress= ContractConfig.ApolloTrade.address;                      
        var contract = web3.eth.contract(ContractConfig.ApolloTrade.abi).at(contractAddress);   
        var functionHashes = getFunctionHashes(ContractConfig.ApolloTrade.abi);
        updateAccount();
        $scope.sellLoadingShow = false;
        $scope.buyLoadingShow = false;
        $scope.transactions = [];
        $scope.buyAmount = $scope.sellAmount = 0;
        
        $scope.buyEnergy = function() {
            // I can't really find a way to detect insufficient coin/energy from the contract's funcion call itself.
            var coinNeeded = $scope.buyAmount * contract.kWh_rate();
            if (coinNeeded > contract.getCoinAccount({from: account}).toNumber()) {
                toastr.error("Insufficient coin");
                return;
            }

            if ($scope.buyAmount > contract.totalEnergy()) {
                toastr.error("Insufficient energy for sale");
                return;
            }

            contract.buyEnergy( $scope.buyAmount, {from: account});     
            toastr.success("Buying transaction has been created. Please wait until it has been executed shortly");
            $scope.buyAmount = 0;
            $scope.buyLoadingShow = true;
            updateAccount();
        };

        $scope.sellEnergy = function() {
            if ($scope.sellAmount > contract.getEnergyAccount({from: account}).toNumber()) {
                toastr.error("Insufficient energy for sale");
                return;
            }
            
            contract.sellEnergy( $scope.sellAmount, {from: account});
            toastr.success("Selling transaction has been created. Please wait until it has been executed shortly");
            $scope.sellAmount = 0;
            $scope.sellLoadingShow = true;
            updateAccount();
        };

        $scope.sellAmountChanged = () => {
            updateAccount();
            $scope.buyAmount = 0;
            
            if ($scope.sellAmount < 0) $scope.sellAmount = 0;
            if ($scope.sellAmount > $scope.energyBalance) $scope.sellAmount = $scope.energyBalance

            uiUpdateEnergyBalance($scope.energyBalance - $scope.sellAmount);
            uiUpdateVillageTotalEnergy($scope.villageTotalEnergy + $scope.sellAmount);
            uiUpdateCoin($scope.coinBalance + ($scope.sellAmount * $scope.energyPrice));
        };

        $scope.buyAmountChanged = () => {
            updateAccount();
            $scope.sellAmount = 0;

            if ($scope.buyAmount < 0) $scope.buyAmount = 0;
            if ($scope.buyAmount > $scope.villageTotalEnergy || 
                $scope.buyAmount * $scope.energyPrice > $scope.coinBalance) {
                $scope.buyAmount = Math.min($scope.villageTotalEnergy, $scope.coinBalance / $scope.energyPrice)
            }

            uiUpdateEnergyBalance($scope.energyBalance + $scope.buyAmount);
            uiUpdateVillageTotalEnergy($scope.villageTotalEnergy - $scope.buyAmount);
            uiUpdateCoin($scope.coinBalance - ($scope.buyAmount * $scope.energyPrice));
        };

        contract.InsufficientEnergy((err, data) => {
            toastr.error("Insufficient energy, the transaction has been cancelled");
        });
        contract.InsufficientCoin((err, data) => {
            toastr.error("Insufficient coin, the transaction has been cancelled");
        });
        contract.EnergyBought((err, data) => {
            $scope.$apply(updateAccount);
            $scope.buyLoadingShow = false;
            toastr.success("Energy bought!");
        });
        contract.EnergySold((err, data) => {
            $scope.$apply(updateAccount);
            $scope.sellLoadingShow = false;
            toastr.success("Energy sold!");
        });
        contract.InitialEnergySet((err, data) => {
            $scope.$apply(updateAccount);
            toastr.success("Initial energy has been set!");
        });
        
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
                var sender = t.from==account ? "Me" : t.from;

                // Decode function
                var func = findFunctionByHash(functionHashes, t.input);
                if (func == 'sellEnergy') {
                    // This is the sellEnergy() method
                    var inputData = solcCoder.decodeParams(["uint256"], t.input.substring(10));
                    console.dir(inputData);
                    $scope.sellLoadingShow = false;
                    $scope.transactions.push({ from: sender, to: 'The village energy pool',  amount : inputData[0].toString() });
                } else if (func == 'buyEnergy') {
                    // This is the buyEnergy() method
                    var inputData = solcCoder.decodeParams(["uint256"], t.input.substring(10));
                    console.dir(inputData);
                    $scope.buyLoadingShow = false;
                    $scope.transactions.push({ to: sender, from: 'The village energy pool',  amount : inputData[0].toString() });                    
                }

                $scope.$apply();
            }
        });

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

        function updateAccount() {
            $scope.villageTotalEnergyUp = 
            $scope.villageTotalEnergyDown = 
            $scope.coinBalanceUp = 
            $scope.coinBalanceDown = 
            $scope.energyBalanceUp = 
            $scope.energyBalanceDown = false;

            $scope.energyPrice = contract.kWh_rate().toNumber();
            $scope.coinBalance = contract.getCoinAccount({from: account}).toNumber();
            $scope.energyBalance = contract.getEnergyAccount({from: account}).toNumber();
            $scope.villageTotalEnergy = contract.totalEnergy().toNumber();
        }

        function uiUpdateVillageTotalEnergy(newValue) {
            $scope.villageTotalEnergyUp = newValue > $scope.villageTotalEnergy;
            $scope.villageTotalEnergyDown = newValue < $scope.villageTotalEnergy;
            $scope.villageTotalEnergy = newValue;
        }

        function uiUpdateCoin(newValue) {
            $scope.coinBalanceUp = newValue > $scope.coinBalance;
            $scope.coinBalanceDown = newValue < $scope.coinBalance;
            $scope.coinBalance = newValue;
        }

        function uiUpdateEnergyBalance(newValue) {
            $scope.energyBalanceUp = newValue > $scope.energyBalance;
            $scope.energyBalanceDown = newValue < $scope.energyBalance;
            $scope.energyBalance = newValue;
        }
    }]);
