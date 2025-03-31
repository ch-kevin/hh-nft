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

    log("deploying wnft(WrappedMyToken) contarct")
    await deploy("WrappedMyToken",{
      contract: "WrappedMyToken",
      from: firstAccount,
      args: ["WrappedMyToken","WMTT"],
      log: true
    });
    log(" WrappedMyToken contarct deployed successfully!")
}
export default main;
main.tags = ["destchain","all"];