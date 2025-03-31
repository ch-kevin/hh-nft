import { task } from "hardhat/config";
import { MyToken } from "../typechain-types";


task("mint-nft","检查FNT").setAction(async (taskArs,{getNamedAccounts, ethers})=>{
    const {firstAccount} = await getNamedAccounts()
    const nft:MyToken = await ethers.getContract("MyToken", firstAccount)

    console.log(`nft address is ${nft.target}`)
  
    console.log("minting NFT...")
    const mintTx = await nft.safeMint(firstAccount)
    await mintTx.wait(6)
    const tokenAmount = await nft.totalSupply()
    const tokenId = tokenAmount - 1n
    console.log(`NFT minted, tokenId is ${tokenId}`)
})

export {}