const cron = require("node-cron");
import HemiSwapClient from "./swap.js";
import { config } from "./config.js";
import logger from "./logger.js";

// Inisialisasi HemiSwapClient
const hemiClient = new HemiSwapClient(config.PRIVATE_KEY);

// **Scheduler untuk menjalankan swap setiap hari pukul 00:00**
cron.schedule("0 0 * * *", async () => {
  logger.info("Menjalankan swap otomatis harian...");
  await hemiClient.swapEthToDai(config.DAILY_SWAP_COUNT, config.SWAP_DELAY_MS);
});

// Jalankan sekali saat script pertama kali dimulai
(async () => {
  logger.info("Bot aktif! Swap pertama berjalan...");
  await hemiClient.swapEthToDai(config.DAILY_SWAP_COUNT, config.SWAP_DELAY_MS);
})();
