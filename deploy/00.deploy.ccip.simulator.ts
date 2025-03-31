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

      log("deploying CCIPLocalSimulator contarct")
      await deploy("CCIPLocalSimulator",{
        contract: "CCIPLocalSimulator",
        from: firstAccount,
        args: [],
        log: true
      });
      log(" CCIPLocalSimulator contarct deployed successfully!")
    } else {
      console.log("env is not local,mock contarct is skipped!");
    }
}
export default main;
main.tags = ["test","all"];