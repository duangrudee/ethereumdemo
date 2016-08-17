angular.module('greeter.services', [])

  .factory('Web3Service', function() {
      
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9000"));
        return web3;    
  });