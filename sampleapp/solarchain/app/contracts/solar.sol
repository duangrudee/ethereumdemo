contract ApolloTrade {
    uint public kWh_rate = 1000;
    mapping (address => uint) energyAccount;
    mapping (address => uint) coinAccount;
    address public owner;
    uint public totalEnergy = 100;

    event InsufficientEnergy(uint, uint);
    event InsufficientCoin(uint, uint);
    event InitialEnergySet(address, uint);
    event EnergyBought(address, uint);
    event EnergySold(address, uint);

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
        if (energyAccount[msg.sender] < kwh) {
            InsufficientEnergy(energyAccount[msg.sender], kwh);             
            throw;
        }

        coinAccount[msg.sender] += (kwh * kWh_rate);
        energyAccount[msg.sender] -= kwh;
        totalEnergy += kwh;

        EnergySold(msg.sender, kwh);
    }

    // I am buying some energy, thus crediting my energy account
    function buyEnergy(uint kwh) {
        if (totalEnergy < kwh) {
            InsufficientEnergy(totalEnergy, kwh); 
            throw;
        }
        var coin = (kwh * kWh_rate);
        if (coinAccount[msg.sender] < coin){
            InsufficientCoin(coinAccount[msg.sender], coin);
            throw;
        }

        coinAccount[msg.sender] -= coin;
        energyAccount[msg.sender] += kwh;
        totalEnergy -= kwh;

        EnergyBought(msg.sender, kwh);
    }
    
    function getEnergyAccount() constant returns (uint kwh) {
        return energyAccount[msg.sender];
    }

    function getCoinAccount() constant returns (uint coin) {
        return coinAccount[msg.sender];
    }

    function setInitialEnergyInMemberPowerBank(address account, uint initialKwh) onlyOwner {
        energyAccount[account] = initialKwh;
        InitialEnergySet(account, initialKwh);
    }
}