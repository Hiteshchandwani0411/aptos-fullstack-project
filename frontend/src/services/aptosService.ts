import { AptosClient, AptosAccount, TxnBuilderTypes, BCS } from "aptos";

// Use the Aptos Devnet node URL
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

const aptosClient = new AptosClient(NODE_URL);

export const lockLiquidity = async (account: AptosAccount, amount: number): Promise<string> => {
    const payload = {
        function: 'MyModule::LockedLiquidity::lock_liquidity',
        type_arguments: [],
        arguments: [account.address().hex(), amount.toString()],
    };

    const transaction = await aptosClient.generateTransaction(account.address(), payload);
    const signedTransaction = await aptosClient.signTransaction(account, transaction);
    const response = await aptosClient.submitTransaction(signedTransaction);
    return response.hash;
};

export const withdrawLiquidity = async (account: AptosAccount): Promise<string> => {
    const payload = {
        function: 'MyModule::LockedLiquidity::withdraw',
        type_arguments: [],
        arguments: [account.address().hex()],
    };

    const transaction = await aptosClient.generateTransaction(account.address(), payload);
    const signedTransaction = await aptosClient.signTransaction(account, transaction);
    const response = await aptosClient.submitTransaction(signedTransaction);
    return response.hash;
};

export async function getAccountResources(accountAddress: string) {
    try {
        const resources = await aptosClient.getAccountResources(accountAddress);
        return resources;
    } catch (error) {
        console.error("Error fetching account resources:", error);
        throw error;
    }
}

export async function submitTransaction(payload: any, sender: string, privateKey: string) {
    try {
        // Add logic to sign and submit transactions
        console.log("Submitting transaction:", payload);
        // Example: aptosClient.submitTransaction(...)
    } catch (error) {
        console.error("Error submitting transaction:", error);
        throw error;
    }
}

export default aptosClient;