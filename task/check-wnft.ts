import { task } from "hardhat/config"
import { MyToken, WrappedMyToken } from "../typechain-types"

task("check-wnft")
    .addParam("tokenid", "tokenid to check")
    .setAction(async(taskArgs, {getNamedAccounts,ethers}) => {

        const tokenId = taskArgs.tokenid
        const {firstAccount} = await getNamedAccounts()
        const wnft: WrappedMyToken= await ethers.getContract("WrappedNFT", firstAccount)
        console.log("checking status of ERC-721")
        const totalSupply = await wnft.totalSupply()
        console.log(`there are ${totalSupply} tokens under the collection`)
        const owner = await wnft.ownerOf(tokenId)
        console.log(`TokenId: ${tokenId}, Owner is ${owner}`)

        for(let tokenId = 0; tokenId < totalSupply; tokenId++) {
            const owner = await wnft.ownerOf(tokenId)
            console.log(`TokenId: ${tokenId}, Owner is ${owner}`)
        }

})

module.exports = {}