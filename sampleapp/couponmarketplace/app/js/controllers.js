angular.module('coupon.controllers', []).

    controller('couponController', ['$scope', 'ContractConfig', 'Web3Service', function($scope, ContractConfig, web3) {
        $scope.newCouponResult = "";        
        console.log('Active account = ' + web3.eth.accounts[0]);

        var filter = web3.eth.filter('latest');
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
                var from = t.from==web3.eth.accounts[0] ? "me" : t.from;                        
                // Default log
                console.log('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>');
            }
        });

        $scope.newCoupon = function() {
            $scope.newCouponResult = "";        
            var contractAddress = ContractConfig.CouponMarket.address;                           
            var account = web3.eth.accounts[0];
            var contract = web3.eth.contract(ContractConfig.CouponMarket.abi).at(contractAddress);                                                           
            $scope.newCouponResult = contract.newCoupon.call($scope.title,$scope.description);
            console.log("new Coupon return = " + $scope.newCouponResult);           
            
        
        }

        




       
    }]);
