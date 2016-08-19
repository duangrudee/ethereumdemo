angular.module('solarchain.services', [])

  .factory('Web3Service', function() {
      
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9000"));
        return web3;    
  })
  .factory('SolidityCoderService', function() {      
       return require("web3/lib/solidity/coder.js");
  })
  .factory('EthTxService' , function () {
        return x = require('ethereumjs-tx');
  })
  .factory('lodashService', function () {
        return require('lodash');;
  })
  .factory('keythereumService', function() {
      return  require("keythereum");
  })
  .factory('SolidityFunctionService', function(){
      return require('web3/lib/web3/function');
  });
  
  
  
