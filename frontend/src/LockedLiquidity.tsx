// filepath: c:\Users\user\OneDrive\Desktop\depoly\my-app\aptos-fullstack-project\frontend\src\LockedLiquidity.tsx
import React, { useState } from "react";
import { AptosClient } from "aptos";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const MODULE_ADDRESS = process.env.REACT_APP_MODULE_ADDRESS || "0x30393672cbf4d6b3dacd2e70ded2499e415de204993c31911eea179dfd641e3f";
const client = new AptosClient(NODE_URL);

const LockedLiquidity: React.FC = () => {
  const [lockAmount, setLockAmount] = useState<number>(0);
  const [remainingLiquidity, setRemainingLiquidity] = useState<string>("--");
  const [loading, setLoading] = useState<boolean>(false);
  const wallet = new PetraWallet();

  const connectWallet = async () => {
    try {
      if (!wallet) {
        alert("Wallet not found. Please install Petra Wallet.");
        return;
      }
      const response = await wallet.connect();
      console.log("Connected account:", response.address);
      alert(`Wallet connected: ${response.address}`);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const lockLiquidity = async () => {
    if (lockAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::LockedLiquidity::lock_liquidity`,
        type_arguments: [],
        arguments: [lockAmount],
      };
      const transaction = await wallet.signAndSubmitTransaction(payload);
      await client.waitForTransaction(transaction.hash);
      alert("Liquidity Locked Successfully!");
    } catch (error) {
      console.error("Error locking liquidity:", error);
      alert("Failed to lock liquidity.");
    } finally {
      setLoading(false);
    }
  };

  const withdrawLiquidity = async () => {
    try {
      setLoading(true);
      const account = await wallet.account();
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::LockedLiquidity::withdraw`,
        type_arguments: [],
        arguments: [],
      };
      const transaction = await wallet.signAndSubmitTransaction(payload);
      await client.waitForTransaction(transaction.hash);
      alert("Liquidity Withdrawn Successfully!");
    } catch (error) {
      console.error("Error withdrawing liquidity:", error);
      alert("Failed to withdraw liquidity.");
    } finally {
      setLoading(false);
    }
  };

  const checkLiquidity = async () => {
    try {
      setLoading(true);
      const account = await wallet.account();
      const resource = await client.getAccountResource(
        account.address,
        `${MODULE_ADDRESS}::LockedLiquidity::LiquidityPool`
      );

      if (!resource) {
        setRemainingLiquidity("0 APT");
        alert("No liquidity pool found for this account.");
        return;
      }

      const data = resource.data as { total_locked: string };
      setRemainingLiquidity(data.total_locked + " APT");
    } catch (error) {
      console.error("Error checking liquidity:", error);
      alert("Failed to check liquidity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="root">
      <h1>Locked Liquidity Management</h1>

      {loading && <p>Loading...</p>}

      <section id="connect-wallet">
        <h2>Connect Wallet</h2>
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </section>

      <section id="lock-liquidity">
        <h2>Lock Liquidity</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lockLiquidity();
          }}
        >
          <label htmlFor="lock-amount">Amount to Lock:</label>
          <input
            type="number"
            id="lock-amount"
            name="lock-amount"
            value={lockAmount}
            onChange={(e) => setLockAmount(Number(e.target.value))}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Locking..." : "Lock Liquidity"}
          </button>
        </form>
      </section>

      <section id="withdraw-liquidity">
        <h2>Withdraw Liquidity</h2>
        <button onClick={withdrawLiquidity} disabled={loading}>
          {loading ? "Withdrawing..." : "Withdraw 10%"}
        </button>
      </section>

      <section id="check-liquidity">
        <h2>Check Remaining Liquidity</h2>
        <button onClick={checkLiquidity} disabled={loading}>
          {loading ? "Checking..." : "Check Liquidity"}
        </button>
        <p id="remaining-liquidity">Remaining Liquidity: {remainingLiquidity}</p>
      </section>
    </div>
  );
};

export default LockedLiquidity;