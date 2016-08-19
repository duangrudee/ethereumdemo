contract ApolloTrade {
    uint public kWh_rate = 1000;
    mapping (address => uint) public energyAccount;
    mapping (address => uint) public coinAccount;
    address public owner;
    
    function ApolloTrade() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }
    
    function setRate(uint rate) onlyOwner {
        kWh_rate = rate;
    }

    // I am selling some energy; this will credit my account
    function sellEnergy(uint kwh) public {
        coinAccount[msg.sender] += (kwh * kWh_rate);
    }

    // I am buying some energy, thus crediting my energy account
    function buyEnergy(uint coin) {
        if (coinAccount[msg.sender] > coin) {
            coinAccount[msg.sender] -= coin;
            energyAccount[msg.sender] += (coin / kWh_rate);
        }
    }

}