export const CONTRACT_ADDRESS = "0xf367A28B1705b220e23d140A48cDD89f496bC185" as const;

export const CONTRACT_ABI = [
  { inputs: [], name: "FundAmountTooLow", type: "error" },
  { inputs: [], name: "NativeTransferFailed", type: "error" },
  { inputs: [], name: "ZeroRecipient", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "sender", type: "address" },
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "AgentFunded",
    type: "event",
  },
  {
    inputs: [],
    name: "MIN_FUND",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address payable", name: "recipient", type: "address" }],
    name: "fundAgent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
] as const;
