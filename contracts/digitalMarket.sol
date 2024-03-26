// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract DigitalMarket {
    enum Role {Seller, Buyer, User}

    enum State {OnSale, Sold, Canceled}
    struct Product {
        uint ID;
        string Title;
        string Compositor;
        string Artiste;
        string Description;
        address Owner;
    }

    struct Sale{
        uint SaleID;
        uint ProductID;
        uint Price;
        State State;
        address Seller;
        address Buyer;
    }

    mapping(address => Role) public roles;
    mapping(uint => State) public states;
    mapping(uint => Product) public products;
    mapping(uint => Sale) public sales;
    mapping(address => uint) public balances;

    uint idCounterMusic = 1;
    uint idCounterSales = 1;

    uint feesPercentage = 5;

    function incrementCounter(uint _counter) internal pure returns(uint) {
        return _counter++;
    }

    modifier onlyRole(Role _role) {
        require(roles[msg.sender]==_role, "UNAUTHORIZED ROLE");
        _;
    }

    function newProduct(string memory _title, string memory _compositor, string memory _artiste, string memory _description) public onlyRole(Role.Seller) {
        uint _id = incrementCounter(idCounterMusic);
        products[_id] = Product(_id, _title, _compositor, _artiste, _description, msg.sender);
        states[_id] = State.OnSale;

    }

    function getProduct(uint _productId) public view returns(string memory title, string memory compositor, string memory artiste, string memory description, address owner) {
        Product storage product = products[_productId];
        return (product.Title, product.Compositor, product.Artiste, product.Description, product.Owner);
    }

    function getSale(uint _saleId) public view returns(uint price, State state,address seller, address buyer) {
        Sale storage sale = sales[_saleId];
        return (sale.Price, sale.State, sale.Seller, sale.Buyer);
    }

    modifier productCanBePurchased(uint _productId) {
        require(products[_productId].ID != 0, "PRODUCT NOT FOUND");
        require(states[_productId] == State.OnSale && states[_productId] != State.Sold, "PRODUCT NOT ON SALE");
        _;
    }

    function newSale(uint _productID, uint _price) public productCanBePurchased(_productID) {
        require(products[_productID].Owner == msg.sender, "UNAUTHORIZED SELLER");
        require(roles[msg.sender]==Role.Seller, "UNAUTHORIZED ROLE");
        uint salesId = incrementCounter(idCounterSales);
        sales[salesId] = Sale(salesId, _productID, _price, State.OnSale ,msg.sender, address(0));
    }

    function buyProduct(uint _saleId, uint _productId) public payable productCanBePurchased(_productId) {
        Sale storage sale = sales[_saleId];
        uint fees = (msg.value * feesPercentage) / 100;
        require(msg.value > sale.Price, "INSUFFICIENT FUNDS");
        require(sale.Price <= msg.value - fees , "PRICE MISMATCH");
        require(sale.Buyer == address(0), "PRODUCT ALREADY SOLD");
        sale.Buyer = msg.sender;
        products[_productId].Owner = msg.sender;
        states[_productId] = State.Sold;
        balances[address(this)] += fees;
        balances[sale.Seller] += msg.value - fees;
    }

    modifier productHaveBeenPurchased(uint _productId) {
        require(products[_productId].ID != 0, "PRODUCT NOT FOUND");
        require(states[_productId] == State.Sold, "PRODUCT NOT SOLD");
        _;
    }

    function cancelSale(uint _saleId, uint _productId) public payable productHaveBeenPurchased(_productId) {
        Sale storage sale = sales[_saleId];
        require(sale.Seller == msg.sender || sale.Buyer == msg.sender, "UNAUTHORIZED SELLER");
        states[_productId] = State.Canceled;
        balances[sale.Buyer] += sale.Price;
    }
}