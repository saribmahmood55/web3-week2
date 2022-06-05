// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const getBalance = async (address) => {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

const printBalances = async (addresses) => {
    let index = 0;
    for(const address of addresses) {
        console.log(`Address (${index}) balance: `, await getBalance(address))
        index += 1;
    }
}

const printMemos = async (memos) => {
    for(const memo of memos) {
        const timestamp = memo.timestamp;
        const name = memo.name;
        const message = memo.message;
        const tipperAddress = memo.from;
        console.log(`At ${timestamp}, ${name} (${tipperAddress}) said: "${message}"`);
    }
}

async function main() {
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("==start==");
    await printBalances(addresses);

    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyCoffee("Hasan", "Enjoy :)", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Sam", "Get a coffee", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Smith", "Did you enjoy it", tip);

    console.log("== bought coffee ==")
    await printBalances(addresses)

    await buyMeACoffee.connect(owner).withdrawTips();

    console.log("== balance after tips==")
    await printBalances(addresses)

    console.log("== memos ==")
    const memos = await buyMeACoffee.getMemos();
    await printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
