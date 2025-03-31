import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains } from "../config";
import { network } from "hardhat";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
    const {firstAccount} = await getNamedAccounts()
    const {deploy,log} = deployments

    log("deploying nft contarct")
    await deploy("MyToken",{
      contract: "MyToken",
      from: firstAccount,
      args: ["myToken","MTT"],
      log: true
    });
    log(" NFT contarct deployed successfully!")
  
}
export default main;
main.tags = ["sourcechain","all"];