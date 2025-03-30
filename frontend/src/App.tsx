import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
export const aptos = new Aptos(aptosConfig);
export const moduleAddress = "0x2b8c4e2ecb3fb2b05485333a05838f06117143a647445a2922d935b9cf3bb8fe";

function App() {
  const [totalLocked, setTotalLocked] = useState<number>(0);
  const [newTask, setNewTask] = useState<string>("");
  const { account, signAndSubmitTransaction } = useWallet();
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const fetchLiquidityPool = async () => {
    if (!account) return;
    try {
      const liquidityPoolResource = await aptos.getAccountResource({
        accountAddress: moduleAddress,
        resourceType: `${moduleAddress}::LockedLiquidity::LiquidityPool`,
      });

      const totalLocked = (liquidityPoolResource as any).data.total_locked;
      setTotalLocked(parseInt(totalLocked));
    } catch (e) {
      console.error("Failed to fetch liquidity pool:", e);
    }
  };

  const lockLiquidity = async (amount: number) => {
    if (!account) return;
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::LockedLiquidity::lock_liquidity`,
        functionArguments: [amount.toString()],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      fetchLiquidityPool();
    } catch (error) {
      console.error("Failed to lock liquidity:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const withdrawLiquidity = async () => {
    if (!account) return;
    setTransactionInProgress(true);

    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::LockedLiquidity::withdraw`,
        functionArguments: [],
      },
    };

    try {
      const response = await signAndSubmitTransaction(transaction);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      fetchLiquidityPool();
    } catch (error) {
      console.error("Failed to withdraw liquidity:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchLiquidityPool();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Liquidity Pool</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
        <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
          <Col span={8} offset={8}>
            <h1>Liquidity Pool</h1>
            <p>Total Locked: {totalLocked} APT</p>
            <Input.Group compact>
              <Input
                type="number"
                placeholder="Amount to lock"
                onChange={(e) => setNewTask(e.target.value)}
                style={{ width: "calc(100% - 60px)" }}
              />
              <Button
                onClick={() => lockLiquidity(parseInt(newTask))}
                type="primary"
                style={{ height: "40px", backgroundColor: "#FF0000" }}
              >
                Lock
              </Button>
            </Input.Group>
            <Button
              onClick={withdrawLiquidity}
              type="primary"
              style={{ marginTop: "20px", backgroundColor: "#FF0000" }}
            >
              Withdraw 10%
            </Button>
          </Col>
        </Row>
      </Spin>
    </>
  );
}

export default App;