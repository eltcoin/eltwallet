const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
  },
];

const availableTokens = [
  {
    contractAddress: '0x44197a4c44d6a059297caf6be4f7e172bd56caaf',
    decimals: 8,
    name: 'ELTCOIN',
    symbol: 'ELT',
  },
  {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
];

export { availableTokens, erc20Abi };
