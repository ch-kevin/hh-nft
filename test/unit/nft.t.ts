import { deployments, ethers, getNamedAccounts } from "hardhat"
import { CCIPLocalSimulator, MyToken, NFTPoolLockAndRelease, WrappedMyToken, NFTPoolBurnAndMint} from "../../typechain-types";
import { assert, expect } from "chai";
import { Addressable, BaseContract, BaseContractMethod, Overrides } from "ethers";

let firstAccount: string | Addressable;
let ccipsSimulator: CCIPLocalSimulator;
let nft: MyToken;
let nftPoollockAndReleace: NFTPoolLockAndRelease;
let wnft: WrappedMyToken;
let nftPoolburnAndMint: NFTPoolBurnAndMint;

let chainSelector: any | Overrides;
before(async ()=>{
    // 合约  用户;
    firstAccount = (await getNamedAccounts()).firstAccount

    await deployments.fixture(["all"])

    ccipsSimulator = await ethers.getContract("CCIPLocalSimulator",firstAccount)

    nft = await ethers.getContract("MyToken",firstAccount)

    nftPoollockAndReleace = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)

    wnft = await ethers.getContract("WrappedMyToken",firstAccount)

    nftPoolburnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount)
    
    const config = await ccipsSimulator.configuration()
    
    chainSelector = config.chainSelector_;
})

describe("source chain -> dest chain test",async ()=>{

    it("test if the nft can be minted successfully",async ()=>{
       // get nft
       await nft.safeMint(firstAccount)
       // check the owner
       const ownerOfNft = await nft.ownerOf(0)
       expect(ownerOfNft).to.equal(firstAccount)
        
    })
})

describe("source chain -> dest chain test",async ()=>{

    it("test if the nft can be locked and transferred to destchain",async ()=>{

        await ccipsSimulator.requestLinkFromFaucet(nftPoollockAndReleace.target,ethers.parseEther("10"))
        await nft.approve(nftPoollockAndReleace.target,0)
        // await nftPoollockAndReleace.lockAndSendNFT(0,firstAccount,chainSelector,nftPoolburnAndMint.target)
        // expect(await nft.ownerOf(0)).to.equal(nftPoollockAndReleace.target)
    
    })

    it("check if wnft's account is owner", 
        async function() {
            const newOwner = await wnft.ownerOf(0)
            expect(newOwner).to.equal(firstAccount)
        }
    )
})

describe("test if the nft can be burned and transferred back to sourcechain", 
    async function() {
        it("wnft can be burned", 
            async function() {
                // fund some Link tokens
                ccipsSimulator.requestLinkFromFaucet(nftPoolburnAndMint.target, ethers.parseEther("10"))
                
                // grant permission
                await wnft.approve(nftPoolburnAndMint.target, 0)

                // transfer the token
                await nftPoolburnAndMint.burnAndMint(0, firstAccount, chainSelector, nftPoollockAndReleace.target)
                const wnftTotalSupply = await wnft.totalSupply()
                expect(wnftTotalSupply).to.equal(0)
            }
        )
        it("owner of the NFT is transferred to firstAccount",
            async function() {
                const newOwner = await nft.ownerOf(0)
                expect(newOwner).to.equal(firstAccount)
            }
        )
    }
)



