const { ethers } = require("hardhat");


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const supply = await ethers.deployContract("DigitalMarket");
    console.log("Supply deployed to:", await supply.getAddress());
}

main().then(() => process.exit(0))