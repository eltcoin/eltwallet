import bip39 from 'bip39'
import crypto from 'crypto'

import hdkey from 'ethereumjs-wallet/hdkey';
import ethUtil from 'ethereumjs-util';

genAddressByBip39() {
    //  'seed'
    var randomBytes = crypto.randomBytes(16) // 128 bits is enough

    //  12 word phrase
    var words = randomBytes.toString('hex');
    //var mnemonic = bip39.entropyToMnemonic(words) ///create wallet
    
    ///restore wallet    
    var mnemonic = "obscure elder salt inform fly best peasant sad boring wood slab fox";
    //test output with above input to address: 0x23841505563cbbb6e4ac1afc00c720e07aa4bd31
    //test private key with above words: 0x8d3fa24f7c30692db385055176aa34d055d6a0a6a1e030a26ef6fc8b0363ae26

    var is_valid = bip39.validateMnemonic(mnemonic)
    if(! is_valid){
      console.log('Recalling this')      
      recall_counts ++
      if(recall_counts > 10 )
      {
        console.log('Recovery words are not valid')
        return;
      }
      //this.genAddressByBip39()
    }
    console.log("--------BIP39---------")
    console.log("BIP39 : ", mnemonic)
    console.log("BIP39 Validation is : ", is_valid)

    var seed = bip39.mnemonicToSeed(mnemonic)
    var walletEth = hdkey.fromMasterSeed(seed) //hdWallet    
    const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)
    const hdwallet_deriv = acct.getWallet()
    
    const privateKey = hdwallet_deriv.getPrivateKey()
    const publicKey = ethUtil.privateToPublic(privateKey)
    var Ethaddress = ethUtil.publicToAddress(publicKey)
    console.log("--------ETH---------")
    console.log("ETH Address :", '0x' + Ethaddress.toString('hex'));
    console.log("ETH Private : ", '0x' + privateKey.toString('hex'))
    this.setState({     
      eth: '0x' + Ethaddress.toString('hex'),
      // privateKey: WIF,
      privateEth: '0x' + privateKey.toString('hex'),
      bip39: mnemonic
    })
  }
