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
  .factory('SolidityFunctionService', function(){
      return require('web3/lib/web3/function');
  })
  
  .factory('keythereumService', function() {
      var keythereum=  require("keythereum");
      var authAPI = {};
      var dumpKeyObject = null;
      
      authAPI.dumpPrivateKey = function (password) {
            keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, function (keyObject) {
                  // do stuff!
                  console.log(keyObject);
                  dumpKeyObject = keyObject;
                  keythereum.exportToFile(keyObject); //export to keystore sub-dir
            });            
      }    

      return authAPI;
  }) 
  ;
  
  
  
