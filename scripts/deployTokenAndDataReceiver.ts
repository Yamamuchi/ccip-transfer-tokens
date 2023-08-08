// 0xD0daae2231E9CB96b94C8512223533293C3693Bf

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `ethereumSepolia`) {
    console.error(`❌ Sender must be deployed to Avalanche Fuji`);
    return 1;
  }

  const sepoliaRouterAddress = `0xD0daae2231E9CB96b94C8512223533293C3693Bf`;
  const sourceChainSelector = ethers.BigNumber.from("14767482510784806043");
  const sender = "0xA21B8cF5C9A5ED69b18FFB9e55d13c96A5741C16"
  const price = 100;
  
  await run("compile");

  const ccipTokenAndDataReceiverFactory = await ethers.getContractFactory("CCIPTokenAndDataReceiver");
  const ccipTokenAndDataReceiver = await ccipTokenAndDataReceiverFactory.deploy(sepoliaRouterAddress, price);

  await ccipTokenAndDataReceiver.deployed();

  console.log(`CCIPTokenAndDataReceiver deployed to ${ccipTokenAndDataReceiver.address}`);

  const CCIPTokenAndDataReceiverFactory = await ethers.getContractFactory("CCIPTokenAndDataReceiver");
  const CCIPTokenAndDataReceiver = await CCIPTokenAndDataReceiverFactory.attach(ccipTokenAndDataReceiver.address);

  const whitelistChainTx = await CCIPTokenAndDataReceiver.whitelistSourceChain(
    sourceChainSelector
  );

  console.log(`Whitelisted Fuji, transaction hash: ${whitelistChainTx.hash}`);

  const whitelistSenderTx = await CCIPTokenAndDataReceiver.whitelistSender(
    sender
  );

  console.log(`Whitelisted sender ${sender}, transaction hash: ${whitelistSenderTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});