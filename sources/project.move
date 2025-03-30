module MyModule::LockedLiquidity {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct LiquidityPool has key, store {
        owner: address,
        total_locked: u64,
    }

    /// Lock liquidity into the contract.
    public fun lock_liquidity(owner: &signer, amount: u64) {
        let owner_addr = signer::address_of(owner);
        let deposit = coin::withdraw<AptosCoin>(owner, amount);
        coin::deposit<AptosCoin>(owner_addr, deposit);

        let pool = LiquidityPool { owner: owner_addr, total_locked: amount };
        move_to(owner, pool);
    }

    /// Withdraw liquidity gradually (e.g., 10% at a time).
    public fun withdraw(owner: &signer) acquires LiquidityPool {
        let pool = borrow_global_mut<LiquidityPool>(signer::address_of(owner));
        let withdraw_amount = pool.total_locked / 10; // Withdraw 10%
        pool.total_locked = pool.total_locked - withdraw_amount;

        // Use signer instead of address for withdrawal
        let coins = coin::withdraw<AptosCoin>(owner, withdraw_amount);
        coin::deposit<AptosCoin>(signer::address_of(owner), coins);
    }
}