import Web3 from 'web3';
let web3;

    //код выполняется на сервере или пользователь не установил MetaMask
    const provider = new Web3.providers.HttpProvider(
	'https://mainnet.infura.io/v3/afcda55307d94908b3384fdbe4704002'
//        'https://rinkeby.infura.io/V4TdOxWqFxt4ebK2hBam' 
    );
    web3 = new Web3(provider);

export default web3;

