import { http, createWalletClient, createPublicClient, parseEther, encodeFunctionData } from "viem";
import { hemiPublicBitcoinKitActions, hemiPublicOpNodeActions } from "hemi-viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { config } from "./config.js";
import logger from "./logger.js";
import UNISWAP_ABI from "./uniswapAbi.js"; // Pastikan ABI Uniswap sudah disiapkan

class HemiSwapClient {
  constructor(privateKey) {
    this.parameters = { chain: sepolia, transport: http() };
    this.account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      account: this.account,
      ...this.parameters,
    });
    this.publicClient = createPublicClient(this.parameters)
      .extend(hemiPublicOpNodeActions())
      .extend(hemiPublicBitcoinKitActions());
  }

  async swapEthToDai(transactionCount, delayMs) {
    const { address } = this.account;
    const ethAmount = parseEther(config.ETH_AMOUNT);

    for (let i = 0; i < transactionCount; i++) {
      try {
        const balance = await this.publicClient.getBalance({ address });
        const gasPrice = await this.publicClient.getGasPrice();
        const totalCost = BigInt(100000) * BigInt(gasPrice) + BigInt(ethAmount.toString());

        if (balance < totalCost) {
          logger.error(`Saldo tidak cukup untuk swap ke-${i + 1}`);
          break;
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 menit
        const swapData = encodeFunctionData({
          abi: UNISWAP_ABI,
          functionName: "swapExactETHForTokens",
          args: [
            0, // Minimal DAI yang diterima (0 = ambil semua yang tersedia)
            [config.WETH_CONTRACT, config.DAI_CONTRACT],
            address,
            deadline,
          ],
        });

        const tx = await this.walletClient.sendTransaction({
          to: config.ROUTER_CONTRACT,
          data: swapData,
          value: ethAmount,
        });

        logger.info(`Swap ke-${i + 1} berhasil! Tx Hash: ${tx}`);

        if (i < transactionCount - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        logger.error(`Error pada swap ke-${i + 1}: ${error.message}`);
        break;
      }
    }
  }
}

export default HemiSwapClient;
