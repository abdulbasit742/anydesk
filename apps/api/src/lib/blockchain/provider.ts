import { ethers } from "ethers";
import { env } from "../../config/env.js";

// For demo purposes, using a mock provider if no RPC URL is provided
export const getProvider = () => {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "https://rpc-amoy.polygon.technology";
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getWallet = (privateKey: string) => {
  return new ethers.Wallet(privateKey, getProvider());
};
