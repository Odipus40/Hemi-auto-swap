import dotenv from "dotenv";
dotenv.config();

export const config = {
  PRIVATE_KEY: process.env.PRIVATE_KEY || "0xYOUR_PRIVATE_KEY",
  ETH_AMOUNT: "0.01", // Jumlah ETH per swap
  ROUTER_CONTRACT: "0xUniswapRouterTestnetAddress", // Ganti dengan alamat router Uniswap testnet
  WETH_CONTRACT: "0xWETHContractTestnetAddress",
  DAI_CONTRACT: "0xDAIContractTestnetAddress",
  DAILY_SWAP_COUNT: 5, // Jumlah swap per hari
  SWAP_DELAY_MS: 5000, // Jeda waktu antar swap dalam milidetik (5 detik)
};
