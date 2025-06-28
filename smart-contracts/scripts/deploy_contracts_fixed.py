"""
Deploy Ellora Smart Contracts to Algorand Testnet

This script deploys both the escrow and reputation SBT contracts
"""

import os
import sys
import ssl
import certifi
from algosdk import mnemonic, account
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, PaymentTxn, wait_for_confirmation
from algosdk.transaction import StateSchema, OnComplete
from algosdk.logic import get_application_address
import base64
from pyteal import compileTeal, Mode

# Fix SSL certificate issues on macOS
ssl._create_default_https_context = ssl._create_unverified_context

# Add the contracts directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'contracts'))

from escrow_contract import escrow_contract, clear_state_program  # type: ignore
from reputation_sbt import reputation_sbt_contract, clear_state_program as sbt_clear_program  # type: ignore

# Algorand testnet configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

class ContractDeployer:
    def __init__(self, private_key=None, mnemonic_phrase=None):
        """Initialize deployer with account credentials"""
        self.algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
        
        if private_key:
            self.private_key = private_key
            self.address = account.address_from_private_key(private_key)
        elif mnemonic_phrase:
            self.private_key = mnemonic.to_private_key(mnemonic_phrase)
            self.address = account.address_from_private_key(self.private_key)
        else:
            # Generate new account if none provided
            self.private_key, self.address = account.generate_account()
            print(f"Generated new account: {self.address}")
            print(f"Mnemonic: {mnemonic.from_private_key(self.private_key)}")
            print("Please fund this account with testnet ALGO before deployment")
    
    def get_account_info(self):
        """Get account information including balance"""
        try:
            account_info = self.algod_client.account_info(self.address)
            return account_info
        except Exception as e:
            print(f"Error getting account info: {e}")
            return None
    
    def compile_pyteal_program(self, pyteal_program):
        """Compile PyTEAL program to bytecode"""
        try:
            # Compile PyTEAL to TEAL
            teal_source = compileTeal(pyteal_program, Mode.Application, version=8)
            
            # Compile TEAL to bytecode
            compile_response = self.algod_client.compile(teal_source)
            return base64.b64decode(compile_response['result'])
        except Exception as e:
            print(f"Error compiling program: {e}")
            return None
    
    def deploy_escrow_contract(self):
        """Deploy the escrow smart contract"""
        print("🚀 Deploying Escrow Contract...")
        
        # Compile programs
        approval_program = self.compile_pyteal_program(escrow_contract())
        clear_program = self.compile_pyteal_program(clear_state_program())
        
        if not approval_program or not clear_program:
            print("❌ Failed to compile escrow contract")
            return None
        
        # Define state schema
        global_schema = StateSchema(num_uints=10, num_byte_slices=10)
        local_schema = StateSchema(num_uints=5, num_byte_slices=5)
        
        # Get suggested parameters
        params = self.algod_client.suggested_params()
        
        # Create application transaction
        txn = ApplicationCreateTxn(
            sender=self.address,
            sp=params,
            on_complete=OnComplete.NoOpOC,
            approval_program=approval_program,
            clear_program=clear_program,
            global_schema=global_schema,
            local_schema=local_schema,
        )
        
        # Sign and submit transaction
        signed_txn = txn.sign(self.private_key)
        tx_id = self.algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(self.algod_client, tx_id, 4)
        app_id = confirmed_txn["application-index"]
        
        print(f"✅ Escrow Contract deployed with App ID: {app_id}")
        return app_id
    
    def deploy_reputation_contract(self):
        """Deploy the reputation SBT contract"""
        print("🏆 Deploying Reputation SBT Contract...")
        
        # Compile programs
        approval_program = self.compile_pyteal_program(reputation_sbt_contract())
        clear_program = self.compile_pyteal_program(sbt_clear_program())
        
        if not approval_program or not clear_program:
            print("❌ Failed to compile reputation contract")
            return None
        
        global_schema = StateSchema(num_uints=5, num_byte_slices=5)
        local_schema = StateSchema(num_uints=10, num_byte_slices=5)
        
        params = self.algod_client.suggested_params()
        
        txn = ApplicationCreateTxn(
            sender=self.address,
            sp=params,
            on_complete=OnComplete.NoOpOC,
            approval_program=approval_program,
            clear_program=clear_program,
            global_schema=global_schema,
            local_schema=local_schema,
        )
        
        signed_txn = txn.sign(self.private_key)
        tx_id = self.algod_client.send_transaction(signed_txn)
        
        confirmed_txn = wait_for_confirmation(self.algod_client, tx_id, 4)
        app_id = confirmed_txn["application-index"]
        
        print(f"✅ Reputation SBT Contract deployed with App ID: {app_id}")
        return app_id

    def fund_contracts(self, escrow_app_id, sbt_app_id, amount=1000000):
        """Fund contract accounts with ALGO for inner transactions"""
        print("💰 Funding contract accounts...")
        
        params = self.algod_client.suggested_params()
        
        # Fund escrow contract
        escrow_address = get_application_address(escrow_app_id)
        txn1 = PaymentTxn(
            sender=self.address,
            sp=params,
            receiver=escrow_address,
            amt=amount,
        )
        
        # Submit transaction
        signed_txn1 = txn1.sign(self.private_key)
        tx_id1 = self.algod_client.send_transaction(signed_txn1)
        wait_for_confirmation(self.algod_client, tx_id1, 4)
        
        print(f"✅ Contracts funded successfully")
        print(f"🔗 Escrow contract address: {escrow_address}")

def main():
    """Main deployment function"""
    print("=" * 50)
    print("🚀 ELLORA SMART CONTRACT DEPLOYMENT")
    print("🌐 Network: Algorand Testnet")
    print("🎯 Target: Bolt.new Hackathon")
    print("=" * 50)
    
    # Get user mnemonic
    mnemonic_phrase = input("\n🔑 Enter your testnet account mnemonic (or press Enter to generate new): ").strip()
    
    if not mnemonic_phrase:
        deployer = ContractDeployer()
        print("\n⚠️ New account generated. Please fund it and run again.")
        print(f"🔗 Testnet Faucet: https://bank.testnet.algorand.network/")
        return
    else:
        deployer = ContractDeployer(mnemonic_phrase=mnemonic_phrase)
    
    # Check account balance
    account_info = deployer.get_account_info()
    if account_info:
        balance = account_info.get('amount', 0) / 1000000  # type: ignore
        print(f"\n📍 Deployer address: {deployer.address}")
        print(f"💰 Account balance: {balance} ALGO")
        
        if balance < 2.0:
            print(f"\n⚠️ Insufficient balance for deployment. Need at least 2 ALGO.")
            print(f"💳 Fund this address: {deployer.address}")
            print(f"🔗 Testnet Faucet: https://bank.testnet.algorand.network/")
            return
    else:
        print("❌ Unable to get account info. Check network connection.")
        return
    
    try:
        print(f"\n📜 Starting Contract Deployment...")
        
        # Deploy contracts
        escrow_app_id = deployer.deploy_escrow_contract()
        if not escrow_app_id:
            return
            
        reputation_app_id = deployer.deploy_reputation_contract()
        if not reputation_app_id:
            return
        
        # Fund escrow contract for inner transactions
        deployer.fund_contracts(escrow_app_id, reputation_app_id)
        
        # Save deployment info for hackathon submission
        deployment_info = {
            "network": "Algorand Testnet",
            "deployer_address": deployer.address,
            "escrow_contract_id": escrow_app_id,
            "reputation_contract_id": reputation_app_id,
            "escrow_address": get_application_address(escrow_app_id),
            "reputation_address": get_application_address(reputation_app_id),
            "deployment_time": str(__import__('datetime').datetime.now())
        }
        
        print("\n" + "=" * 50)
        print("🎉 DEPLOYMENT SUCCESSFUL! 🎉")
        print("=" * 50)
        print(f"🔗 Network: Algorand Testnet")
        print(f"📋 Escrow Contract ID: {escrow_app_id}")
        print(f"🏆 Reputation Contract ID: {reputation_app_id}")
        print(f"👤 Deployer: {deployer.address}")
        print("=" * 50)
        print("\n🚀 Ready for Bolt.new Hackathon Submission!")
        print(f"🔍 View contracts on AlgoExplorer:")
        print(f"   Escrow: https://testnet.algoexplorer.io/application/{escrow_app_id}")
        print(f"   Reputation: https://testnet.algoexplorer.io/application/{reputation_app_id}")
        
        # Write deployment info to file for frontend integration
        import json
        with open('../deployed_contracts.json', 'w') as f:
            json.dump(deployment_info, f, indent=2)
        print(f"\n📄 Deployment info saved to deployed_contracts.json")
        print(f"💡 Update your frontend with these contract IDs!")
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        print("Please check your account balance and network connection.")

if __name__ == "__main__":
    main()
