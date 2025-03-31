import { task } from "hardhat/config";
import { MyToken } from "../typechain-types";


task("check-nft","检查FNT").setAction(async (taskArs,{getNamedAccounts, ethers})=>{
    const {firstAccount} =await getNamedAccounts()
    const nft: MyToken = await ethers.getContract("MyToken",firstAccount)
    const totalSupply = await nft.totalSupply()
    console.log(`there are ${totalSupply} tokens under the collection`)
    for(let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await nft.ownerOf(tokenId)
        console.log(`TokenId: ${tokenId}, Owner is ${owner}`)
    }
})

export {}