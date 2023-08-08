// scripts/deployTokenSender.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Sender must be deployed to Avalanche Fuji`);
    return 1;
  }

  const ccipTokenAndDataSenderaddress = "0xAAe06Ffe4FAC54b891d18DC2F3674327777051B4"
  const ccipTokenAndDataReceiverAddress = "0xd1d95E645D26E701DCDB6Cfe51aD78091Ff73B5C"
  const destinationChainSelector = ethers.BigNumber.from("16015286601757825753");
  const ccipBnMAddress = "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4";
  const price = 100;

  await run("compile");

  const CCIPTokenAndDataSenderFactory = await ethers.getContractFactory("CCIPTokenAndDataSender");
  const CCIPTokenAndDataSender = await CCIPTokenAndDataSenderFactory.attach(ccipTokenAndDataSenderaddress);

  const whitelistTx = await CCIPTokenAndDataSender.whitelistChain(
      destinationChainSelector
  );

  console.log(`Whitelisted Sepolia, transaction hash: ${whitelistTx.hash}`);

  const sendTokensTx = await CCIPTokenAndDataSender.transferTokens(
    destinationChainSelector, 
    ccipTokenAndDataReceiverAddress,
    ccipBnMAddress,
    price
  );

  console.log(`Tokens sent, transaction hash: ${sendTokensTx.hash}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});