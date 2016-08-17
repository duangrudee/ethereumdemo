import "std.sol";
import "set.sol";

contract CouponMarket is owned, named("CouponMarket"), SetUtil {

    uint32 public totalCouponNumbers;
    mapping (uint => Coupon) coupons;
    Set_ui32 couponList;
    
	event NewCoupon(uint id, bytes32 name, bytes32 description);
	event NewSeller(bytes32 name, address addr);    
    event StatusReported(string text);
	    
    enum CouponStatus {
        New, 
        InProgress, 
        SoldOut,
        Expire
    }

    Set_addr sellersList;
    Set_addr buyersList;
    mapping (address => Seller) sellers;
    mapping (address => Buyer) buyers;

    
    struct Seller {
        bytes32 name;
        address account;
        uint rank;
        uint couponsSold;
        Set_ui32  couponsIds;
    }
    
    struct Buyer {
        bytes32 name;
        address account;
        uint rank;
        uint couponBought;
        Set_ui32  couponsIds;
    }
    
    struct Coupon {
        Seller seller;
        bytes32 name;
        bytes32 description;
        CouponStatus status;
        uint price;
        Buyer buyer;
    }
    
    //Constructor
    function CouponMarket() {
        totalCouponNumbers = 0;
        StatusReported("Constructor => Contract created");
    }
    
    function newSeller(bytes32 _name) public returns(uint sellerId)  {
        Seller newSeller = sellers[msg.sender];
        newSeller.name = _name;
        newSeller.account= msg.sender;
        setAddUnique(sellersList, msg.sender);
        
        NewSeller(newSeller.name, newSeller.account);
        return(sellersList.arr.length);
    }

    function newCoupon(bytes32 _name, bytes32 _description) public returns( uint32 couponId)  {
        StatusReported("newCoupon => Begin");
        Coupon newCoupon= coupons[totalCouponNumbers];
        newCoupon.seller= sellers[msg.sender];
        newCoupon.name= _name;
        newCoupon.description= _description;
        newCoupon.status= CouponStatus.New;
        newCoupon.price= msg.value;
        setAddUnique(sellersList, msg.sender);
        
        totalCouponNumbers++;
        setAddUnique(couponList, totalCouponNumbers);
        
        NewCoupon(totalCouponNumbers, _name, _description);//sendout notiification
        return(totalCouponNumbers);
    }

    function getCoupons() constant returns( uint32 [] cList)  {
        return(couponList.arr);
    }

    function getCouponName(uint id) constant returns(bytes32 jn)  {
        return(coupons[id - 1].name);
    }
    
    function getCouponDescription(uint id) constant returns(bytes32 jd)  {
        return(coupons[id - 1].description);
    }
    
    function getCouponStatus(uint id) constant returns(uint status)  {
        return(uint256(coupons[id - 1].status));
    }
    
    function getCouponPrice(uint id) constant returns(uint value)  {
        return(coupons[id - 1].price);
    }
    
    function getCouponSellerName(uint id) constant returns(bytes32 jn)  {
        return(coupons[id - 1].seller.name);
    }

    function getCouponBuyerName(uint id) constant returns(bytes32 jn)  {
        return(coupons[id - 1].buyer.name);
    }

}