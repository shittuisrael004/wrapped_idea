import sdk from "@farcaster/frame-sdk";
import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, createConnector } from "wagmi";

frameConnector.type = "frameConnector" as const;

export function frameConnector() {
  let connected = true;

  return createConnector((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: frameConnector.type,

    async setup() {
      try {
        await this.connect({ chainId: config.chains[0].id });
      } catch (err) {
        console.warn("Farcaster connector setup failed:", err);
      }
    },

    async connect({ chainId }: { chainId?: number } = {}) {
      const provider = sdk.wallet.ethProvider;
      if (!provider) {
        throw new Error("Farcaster Frame SDK not ready");
      }

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      let currentChainId = await this.getChainId();
      if (chainId && currentChainId !== chainId) {
        const chain = await this.switchChain!({ chainId });
        currentChainId = chain.id;
      }

      connected = true;

      return {
        accounts: accounts.map((x) => getAddress(x)),
        chainId: currentChainId,
      } as any;
    },

    async disconnect() {
      connected = false;
    },

    async getAccounts() {
      if (!connected) throw new Error("Not connected");
      const provider = sdk.wallet.ethProvider;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      return accounts.map((x) => getAddress(x));
    },

    async getChainId() {
      const provider = sdk.wallet.ethProvider;
      const hexChainId = await provider.request({ method: "eth_chainId" });
      return fromHex(hexChainId, "number");
    },

    async getProvider() {
      return sdk.wallet.ethProvider;
    },

    async isAuthorized() {
      return !!sdk.wallet.ethProvider;
    },

    async switchChain({ chainId }: { chainId: number }) {
      const provider = sdk.wallet.ethProvider;
      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else config.emitter.emit("change", { accounts: accounts.map((x) => getAddress(x)) });
    },

    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },

    async onDisconnect() {
      config.emitter.emit("disconnect");
      connected = false;
    },
  }));
}