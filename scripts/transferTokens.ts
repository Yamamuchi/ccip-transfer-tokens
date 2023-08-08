// scripts/transferTokens.ts

import { ethers, network } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const ccipSenderAddress = `0x5A9270cB079f93bf51B3F5E30dC2B2a09155F7f0`;
  const receiver = `0xA21B8cF5C9A5ED69b18FFB9e55d13c96A5741C16`;
  const ccipBnMAddress = `0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4`;
  const amount = 100n;
  const destinationChainSelector = ethers.BigNumber.from("16015286601757825753");

  const ccipTokenSenderFactory = await ethers.getContractFactory("CCIPTokenSender");
  const ccipTokenSender = await ccipTokenSenderFactory.attach(ccipSenderAddress);
  
  const whitelistTx = await ccipTokenSender.whitelistChain(
      destinationChainSelector
  );
  
  console.log(`Whitelisted Sepolia, transaction hash: ${whitelistTx.hash}`);

  const transferTx = await ccipTokenSender.transferTokens(
      destinationChainSelector, 
      receiver,
      ccipBnMAddress,
      amount
  );

  console.log(`Tokens sent, transaction hash: ${transferTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});