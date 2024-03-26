const  {expect}  = require('chai');
const { ethers } = require("hardhat");

describe("DigitalMarketPlace 1/4", function () {
    it("test for saving product", async function () {
        const [owner] = await ethers.getSigners();
        const market = await ethers.deployContract("DigitalMarket");
        await market.connect(owner).newProduct("the best of good love gone", "24 Carat Black", "24 Carat Black", "Holy Grail soul music");
        const product = await market.products(1);
        expect(product[1]).to.equal("the best of good love gone");
        expect(product[2]).to.equal("24 Carat Black");
        expect(product[3]).to.equal("24 Carat Black");
        expect(product[4]).to.equal("Holy Grail soul music");
        expect(product[5]).to.equal(owner.address);
    })
})

describe("DigitalMarketPlace 2/4", function () {
    it("test for saving sale", async function () {
        const [owner] = await ethers.getSigners();
        const market = await ethers.deployContract("DigitalMarket");
        await market.connect(owner).newProduct("the best of good love gone", "24 Carat Black", "24 Carat Black", "Holy Grail soul music");
        const product = await market.products(1);
        let nullAddr = '0x0000000000000000000000000000000000000000'
        let Price = BigInt(ethers.parseEther("0.0000015"))
        await market.connect(owner).newSale(1, Price);
        const sale = await market.sales(1);
        let price = parseInt(sale[2].toString());
        expect(price).to.equal(1500000000000);
        expect(sale[3].toString()).to.equal("0");
        expect(sale[4]).to.equal(owner.address);
        expect(sale[5]).to.equal(nullAddr);
    })
})

describe("DigitalMarketPlace 3/4", function () {
    it("test for user to see products and sales", async function () {
        const [owner, user] = await ethers.getSigners();
        const market = await ethers.deployContract("DigitalMarket");
        await market.connect(owner).newProduct("the best of good love gone", "24 Carat Black", "24 Carat Black", "Holy Grail soul music");
        const product = await market.products(1);
        let nullAddr = '0x0000000000000000000000000000000000000000'
        let Price = BigInt(ethers.parseEther("0.0000015"))
        await market.connect(owner).newSale(1, Price);

        const prod = await market.connect(user).getProduct(1);
        const sale = await market.connect(user).getSale(1);
        console.log(prod);
        console.log(sale);
    })
})

describe("DigitalMarketPlace 4/5", function () {
    it("test for buying a product right price", async function() {
        const [owner, secondOwner] = await ethers.getSigners();
        const market = await ethers.deployContract("DigitalMarket");
        await market.connect(owner).newProduct("the best of good love gone", "24 Carat Black", "24 Carat Black", "Holy Grail soul music");
        const productBloc = await market.products(1);
        console.log(productBloc);
        const option = {value: ethers.parseEther("0.0000015")};
        console.log(option.value);
        await market.connect(owner).newSale(1, option.value);

        let gooPrice = Number(ethers.parseEther("0.0000015"));
        let fees = gooPrice*5.5/100
        gooPrice = gooPrice + fees;
        option.value = BigInt(gooPrice);
        console.log(option.value);
        await market.connect(secondOwner).buyProduct(1, 1, option);
        
        const product = await market.products(1);
        expect(product.Owner).to.equal(secondOwner.address);
        const sale = await market.sales(1);
        console.log(sale);
    })
})

describe("DigitalMarketPlace 4/5", function () {
    it("test for buying a product wrong price", async function() {
        const [owner, secondOwner] = await ethers.getSigners();
        const market = await ethers.deployContract("DigitalMarket");
        await market.connect(owner).newProduct("the best of good love gone", "24 Carat Black", "24 Carat Black", "Holy Grail soul music");
        const productBloc = await market.products(1);
        console.log(productBloc);
        const option = {value: ethers.parseEther("0.0000015")};
        console.log(option.value);
        await market.connect(owner).newSale(1, option.value);

        let gooPrice = Number(ethers.parseEther("0.0000015"));
        let fees = gooPrice*2/100
        gooPrice = gooPrice + fees;
        option.value = BigInt(gooPrice);
        console.log(option.value);
        try {
            await market.connect(secondOwner).buyProduct(1, 1, option);
        } catch (error) {
            console.log(error);
        }
    })
})