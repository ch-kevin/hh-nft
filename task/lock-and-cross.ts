import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { networkConfig } from "../config";
import { MyToken, NFTPoolLockAndRelease } from "../typechain-types";

task("lock-and-cross")
    .addOptionalParam("chainselecter","dest chain")
    .addOptionalParam("receiver","receiver address")
    .addParam("tokenid","token id")
    .setAction(async (taskArgs,hre:HardhatRuntimeEnvironment)=>{
        let chainselecter = taskArgs.chainselecter;
        let receiver = taskArgs.receiver;
        const tokenId = taskArgs.tokenid;
        const {firstAccount} = await hre.getNamedAccounts()

        if(taskArgs.chainselector) {
            chainselecter = taskArgs.chainselector
        } else {
            chainselecter = networkConfig[hre.network.config.chainId as number].companionChainSelector
            console.log("chainselecter is not set im command! defaulet confg networkConfig[chainId].companionChainSelector")
        }
        console.log(`chainselecter:${chainselecter}`);

        if(taskArgs.receiver) {
            receiver = taskArgs.receiver
        } else {
            receiver = (await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")).address
            console.log(`receiver is not set`);
        }

        console.log(`receiver:${receiver}`);



        /****/
        const linkTokenAddr = networkConfig[hre.network.config.chainId as number].linkToken
        const linkToken = await hre.ethers.getContractAt("LinkToken", linkTokenAddr)
        const nftPoolLockAndRelease: NFTPoolLockAndRelease = await hre.ethers.getContract("NFTPoolLockAndRelease", firstAccount)
        
        // transfer 10 LINK token from deployer to pool
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`balance before: ${balanceBefore}`)
        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, hre.ethers.parseEther("10"))
        await transferTx.wait(6)
        const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`balance after: ${balanceAfter}`)

        // approve the pool have the permision to transfer deployer's token
        const nft:MyToken = await hre.ethers.getContract("MyToken", firstAccount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        console.log("approve successfully")

        // ccip send
        console.log(`${tokenId}, ${firstAccount}, ${chainselecter}, ${receiver}`)
        const lockAndCrossTx = await nftPoolLockAndRelease
            .lockAndSendNFT(
            tokenId, 
            firstAccount, 
            chainselecter, 
            receiver
        )
        
        // provide t
        console.log(`NFT locked and crossed, transaction hash is ${lockAndCrossTx.hash}`)

    })

export{}