
var app = angular.module('solarchain');
app.constant('ContractConfig', {
	ApolloTrade : 	{
		"address" : "0xFB9124e6A0244CB336776D0a5EDE5f81ab4BBa30" ,	//don't forget to update to sync with deploy.txt'
		"abi" : [{"constant":false,"inputs":[{"name":"rate","type":"uint256"}],"name":"setRate","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"kWh_rate","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"kwh","type":"uint256"}],"name":"sellEnergy","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getEnergyAccount","outputs":[{"name":"kwh","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getCoinAccount","outputs":[{"name":"coin","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"initialKwh","type":"uint256"}],"name":"setInitialEnergyInMemberPowerBank","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"kwh","type":"uint256"}],"name":"buyEnergy","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalEnergy","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"uint256"}],"name":"InsufficientEnergy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"},{"indexed":false,"name":"","type":"uint256"}],"name":"InsufficientCoin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"InitialEnergySet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"EnergyBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"EnergySold","type":"event"}],
	"data" : '60606040526103e860006000505560646004600050555b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61074d806100506000396000f360606040523615610095576000357c01000000000000000000000000000000000000000000000000000000009004806334fcf4371461009757806338bc0053146100af5780634326ee36146100d25780634615f12c146100ea5780635d17f66b1461010d5780638da5cb5b1461013057806395d8606c14610169578063bc8a251f1461018a578063bfe7af38146101a257610095565b005b6100ad60048080359060200190919050506101c5565b005b6100bc600480505061022f565b6040518082815260200191505060405180910390f35b6100e86004808035906020019091905050610238565b005b6100f760048050506103cc565b6040518082815260200191505060405180910390f35b61011a6004805050610408565b6040518082815260200191505060405180910390f35b61013d6004805050610444565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610188600480803590602001909190803590602001909190505061046a565b005b6101a06004808035906020019091905050610554565b005b6101af6004805050610744565b6040518082815260200191505060405180910390f35b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561022157610002565b806000600050819055505b50565b60006000505481565b80600160005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156102e2577f119d72970aac2af9d5edc137eeb2f0c9a93fbed7a45c65382a07b9ef577d3c31600160005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505482604051808381526020018281526020019250505060405180910390a1610002565b6000600050548102600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555080600160005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508060046000828282505401925050819055507f9fb339e191de31f84b67063370f6fdf06b0cb3b95c663b3c1910deb6e15b5f7c3382604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b50565b6000600160005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610405565b90565b6000600260005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610441565b90565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104c657610002565b80600160005060008473ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055507ffb1404cf7e15fb6ece8ce66a9fd7d53abda730aba4d2dedf2d27ddd5e0b4b7d38282604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5050565b60008160046000505410156105ac577f119d72970aac2af9d5edc137eeb2f0c9a93fbed7a45c65382a07b9ef577d3c3160046000505483604051808381526020018281526020019250505060405180910390a1610002565b6000600050548202905080600260005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610660577f7d9cb10d99aa1388527990c6b784adb873197c2cdbf1c251aafec6288a71e63d600260005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505482604051808381526020018281526020019250505060405180910390a1610002565b80600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508160046000828282505403925050819055507f473096e2da977596760b23740a6dc43e2eb265c5f04c241a147c377d5c543beb3383604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5050565b6004600050548156'
	}
});
