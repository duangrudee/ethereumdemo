contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }
}

contract PraChaMaTiCreator is owned {
    struct Voter {
        bool isKorKorTor;
        string name;
        bool canVote;
        bool hasVoted;
        bool vote;
        address addedBy;
    }
    
    struct Topic {
        string name;
        string description;
        uint startTime;
        uint endTime;
        int supportCount;
        int oppositionCount;
    }

    modifier onlyKorKorTor {
        if (!voters[msg.sender].isKorKorTor) throw;
        _
    }
    
    // Everyone can see this information
    Topic[] public topics;

    // Only some users can see, depending on our contract code
    mapping(address => Voter) voters;

    function PraChaMaTiCreator(address headOfPraChaMaTi) {
        if (headOfPraChaMaTi != 0) {
            owner = headOfPraChaMaTi;
        }
    }
    // Public get functions

    // Only head of the pra cha ma ti contract can do this
    function addKorKorTor(address kktAddress, string name) onlyOwner {
        voters[kktAddress] = Voter({
            isKorKorTor: true,
            name: name,
            canVote: true,
            hasVoted: false,
            vote: false,
            addedBy: msg.sender
        });
    }

    function proposeTopic(string name, string description, uint startTime, uint votingPeriodInMinutes) 
        returns (uint topicId) {
            topics.push(Topic({
                name: name,
                description: description,
                startTime: now + startTime * 1 minutes,
                endTime: now + startTime * 1 minutes + votingPeriodInMinutes * 1 minutes,
                supportCount: 0,
                oppositionCount: 0
            }));
            return topics.length - 1;
    }

    // Functions reserved for Kor Kor Tor
    function addVoter(address voterAddress, string name) onlyKorKorTor {
        voters[voterAddress] = Voter({
            isKorKorTor: false,
            name: name,
            canVote: true,
            hasVoted: false,
            vote: false,
            addedBy: msg.sender
        });
    }
}