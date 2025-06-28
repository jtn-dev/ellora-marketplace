"""
Deploy Ellora Smart Contracts to Algorand Testnet

This script deploys both the escrow and reputation SBT contracts
"""

import os
import sys
from algosdk import mnemonic, account
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, PaymentTxn, wait_for_confirmation
from algosdk.transaction import StateSchema, OnComplete
from algosdk.logic import get_application_address
import base64

# Add the contracts directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'contracts'))

from escrow_contract import escrow_contract, clear_state_program
from reputation_sbt import reputation_sbt_contract

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
    
    def compile_program(self, source_code):
        """Compile PyTEAL program to TEAL bytecode"""
        try:
            compile_response = self.algod_client.compile(source_code)
            return base64.b64decode(compile_response['result'])
        except Exception as e:
            print(f"Error compiling program: {e}")
            return None
    
    def deploy_escrow_contract(self):
        """Deploy the escrow smart contract"""
        print("Deploying Escrow Contract...")
        
        # Get compiled programs
        approval_program_source = escrow_contract()
        clear_program_source = clear_state_program()
        
        # Note: In a real deployment, you'd compile these to TEAL first
        # For now, we'll use placeholder bytecode
        approval_program = b"placeholder_approval_program"
        clear_program = b"placeholder_clear_program"
        
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
        
        print(f"Escrow Contract deployed with App ID: {app_id}")
        return app_id
    
    def deploy_reputation_contract(self):
        """Deploy the reputation SBT contract"""
        print("Deploying Reputation SBT Contract...")
        
        # Similar deployment process as escrow contract
        approval_program = b"placeholder_sbt_approval_program"
        clear_program = b"placeholder_sbt_clear_program"
        
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
        
        print(f"Reputation SBT Contract deployed with App ID: {app_id}")
        return app_id
    
    def fund_contracts(self, escrow_app_id, sbt_app_id, amount=1000000):
        """Fund contract accounts with ALGO for inner transactions"""
        print("Funding contract accounts...")
        
        params = self.algod_client.suggested_params()
        
        # Fund escrow contract
        escrow_address = get_application_address(escrow_app_id)
        txn1 = PaymentTxn(
            sender=self.address,
            sp=params,
            receiver=escrow_address,
            amt=amount,
        )
        
        # Fund SBT contract
        sbt_address = get_application_address(sbt_app_id)
        txn2 = PaymentTxn(
            sender=self.address,
            sp=params,
            receiver=sbt_address,
            amt=amount,
        )
        
        # Submit transactions
        signed_txn1 = txn1.sign(self.private_key)
        signed_txn2 = txn2.sign(self.private_key)
        
        tx_id1 = self.algod_client.send_transaction(signed_txn1)
        tx_id2 = self.algod_client.send_transaction(signed_txn2)
        
        wait_for_confirmation(self.algod_client, tx_id1, 4)
        wait_for_confirmation(self.algod_client, tx_id2, 4)
        
        print(f"Contracts funded successfully")
        print(f"Escrow contract address: {escrow_address}")
        print(f"SBT contract address: {sbt_address}")

def main():
    """Main deployment function"""
    print("=== Ellora Smart Contract Deployment ===")
    
    # Initialize deployer
    # For development, you can paste your testnet mnemonic here
    # NEVER use mainnet keys or commit real keys to git
    deployer = ContractDeployer()
    
    # Check account balance
    account_info = deployer.get_account_info()
    if account_info:
        balance = account_info.get('amount', 0) / 1000000  # Convert microAlgos
        print(f"Deployer address: {deployer.address}")
        print(f"Account balance: {balance} ALGO")
        
        if balance < 0.5:
            print("⚠️  Insufficient balance for deployment. Please fund your account.")
            print(f"Fund this address: {deployer.address}")
            print("Get testnet ALGO: https://testnet.algoexplorer.io/dispenser")
            return
    else:
        print("❌ Unable to get account info. Check network connection.")
        return
    
    try:
        # Deploy contracts
        escrow_app_id = deployer.deploy_escrow_contract()
        sbt_app_id = deployer.deploy_reputation_contract()
        
        # Fund contracts for inner transactions
        deployer.fund_contracts(escrow_app_id, sbt_app_id)
        
        # Save deployment info
        deployment_info = {
            "network": "testnet",
            "deployer_address": deployer.address,
            "escrow_app_id": escrow_app_id,
            "sbt_app_id": sbt_app_id,
            "escrow_address": get_application_address(escrow_app_id),
            "sbt_address": get_application_address(sbt_app_id),
        }
        
        print("\n=== Deployment Complete ===")
        print(f"Escrow App ID: {escrow_app_id}")
        print(f"SBT App ID: {sbt_app_id}")
        print("\nSave these App IDs for your frontend integration!")
        
        # Write to config file
        import json
        with open("deployment_config.json", "w") as f:
            json.dump(deployment_info, f, indent=2)
        
        print("Deployment info saved to deployment_config.json")
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")

if __name__ == "__main__":
    main() 