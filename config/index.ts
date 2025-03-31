const DECIMAL = 8;
const INITIAL_ASNWER  = 300000000000
const LOCK_TIME = 180;
const CONFIRMATIONS = 5;
const devlopmentChains = [
    'hardhat',
    'local'
]

type Config<t extends string | number | symbol, u> = {
    [networkId in t]: u;
};
const networkConfig: Config<number,any> = {
    11155111:{
        ethUsdDateFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
        link: "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    },
    80002:{
        ethUsdDateFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        router: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
        link: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904"
    }
}



export {
    DECIMAL,
    INITIAL_ASNWER,
    devlopmentChains,
    networkConfig,
    LOCK_TIME,
    CONFIRMATIONS
}