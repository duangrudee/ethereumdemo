angular.module('greeter.controllers', []).

    controller('greeterController', ['$scope', 'ContractConfig', 'Web3Service', function($scope, ContractConfig, web3) {
        $scope.executeResult = "";
        $scope.deployResult = "";
        console.log('Active account = ' + web3.eth.accounts[0]);

        $scope.executeGreeter = function() {
            $scope.executeResult = "";        
            var contractAddress;
            if ($scope.address == undefined || $scope.address == "" || !$scope.address.startsWith("0x"))
            {   
                console.log("Invalid contract given, reuse a pre-defined contract");                     
                contractAddress = ContractConfig.greeter.address;
            }
            else
            {                
                contractAddress = $scope.address;
            }

            var account = web3.eth.accounts[0];
            var contract = web3.eth.contract(ContractConfig.greeter.abi).at(contractAddress);                                        
            console.log(ContractConfig.greeter.abi);            
            $scope.executeResult = contract.greet.call();
            console.log("Greeting Text = " + $scope.executeResult);           
        }

        $scope.deployNewContract = function() {
            $scope.deployResult = "";
            if ($scope.greetingText == undefined)
            {   
                $scope.greetingText = "Hello World";
            }

            if ($scope.gasPrice == undefined || $scope.gasPrice == "")
            {
                $scope.gasPrice = 4700000;
            }
            
            var greeterContract = web3.eth.contract(ContractConfig.greeter.abi);
            var greeter = greeterContract.new(
                $scope.greetingText,
                {
                    from: web3.eth.accounts[0], 
                    data:  ContractConfig.greeter.data,
                    gas: $scope.gasPrice
                }, function (e, contract){
                        console.log(e, contract);
                        if (e != undefined) {
                            $scope.deployResult = 'Error: ' +  e.message;
                            return;
                        }
                        if (contract != 'undefined' && contract.address != 'undefined') {
                            $scope.deployResult  = 'Contract mined! address: ' + contract.address + ' ,transactionHash: ' + contract.transactionHash;                            
                        }
                    });
        }
    

        $scope.executeMortal = function() {
            var contractAddress = ContractConfig.mortal.address;
            var account = web3.eth.accounts[0];
            var contract = web3.eth.contract(ContractConfig.mortal.abi).at(contractAddress);

            
            console.log(ContractConfig.mortal.abi);            
            //contract.greet.call();
            //console.log("Greeting Text = " + contract.greet.call());
        }
    }]);
