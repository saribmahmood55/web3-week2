const hre = require("hardhat");

async function main() {
    const [owner, owner1, owner2, owner3] = await hre.ethers.getSigners();

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

    console.log("== transferring owner ==")
    let ownerAddress = await buyMeACoffee.getOwner();
    console.log("Owner is before transfer :", ownerAddress);
    console.log("Transferring ownership to :", owner1.address);
    await buyMeACoffee.connect(owner).updateOwner(owner1.address);
    ownerAddress = await buyMeACoffee.getOwner();
    console.log("Owner is after transfer :", ownerAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
