import { DeployFunction } from "hardhat-deploy/dist/types";
import { devlopmentChains } from "../config";
import { network } from "hardhat";

const main: DeployFunction = async ({
    getNamedAccounts,
    deployments,
    // getChainId,
    // getUnnamedAccounts,
  })=>{
    
    if(devlopmentChains.includes(network.name)){
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
    } else {
      console.log("env is not local,mock contarct is skipped!");
    }
}
export default main;
main.tags = ["destchain","all"];