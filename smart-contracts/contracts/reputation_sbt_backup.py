"""
Ellora Reputation Soulbound Token (SBT) Contract

This contract manages reputation tokens that cannot be transferred:
- Mint SBTs when jobs are completed successfully
- Track user reputation on-chain
- Enable dispute resolution juror selection
- Follow ARC-71 standard for NFTs with transfer restrictions
"""

from pyteal import (
    Bytes, Int, Seq, Assert, App, Txn, Global, Btoi, Or, If, And,
    Subroutine, TealType, compileTeal, Mode, Cond
)

def reputation_sbt_contract():
    """
    Soulbound Token contract for Ellora reputation system
    
    Local State (per user):
    - total_sbt_count: Total number of SBTs owned
    - positive_rating: Sum of positive ratings received
    - negative_rating: Sum of negative ratings received
    - last_earned: Timestamp of last SBT earned
    - juror_eligible: Whether user can serve as dispute juror
    
    Global State:
    - total_supply: Total SBTs minted
    - platform_address: Address authorized to mint SBTs
    """
    
    # Local state keys
    sbt_count_key = Bytes("sbt_count")
    positive_rating_key = Bytes("positive")
    negative_rating_key = Bytes("negative")
    last_earned_key = Bytes("last_earned")
    juror_eligible_key = Bytes("juror_eligible")
    
    # Global state keys
    total_supply_key = Bytes("total_supply")
    platform_address_key = Bytes("platform_addr")
    
    # Methods
    method_mint_sbt = Bytes("mint_sbt")
    method_update_rating = Bytes("update_rating")
    method_check_eligibility = Bytes("check_eligibility")
    method_get_reputation = Bytes("get_reputation")
    
    @Subroutine(TealType.uint64)
    def is_platform():
        return Txn.sender() == App.globalGet(platform_address_key)
    
    @Subroutine(TealType.uint64)
    def calculate_reputation_score(address):
        """Calculate overall reputation score for an address"""
        positive = App.localGet(address, positive_rating_key)
        negative = App.localGet(address, negative_rating_key)
        total_jobs = App.localGet(address, sbt_count_key)
        
        # Reputation score = (positive - negative) / total_jobs * 100
        # Minimum score is 0, maximum is 100
        return If(total_jobs > Int(0),
            If((positive - negative) * Int(100) / total_jobs > Int(0),
                (positive - negative) * Int(100) / total_jobs,
                Int(0)
            ),
            Int(50)  # Default score for new users
        )
    
    # Mint SBT - Called by platform when job is completed
    mint_sbt = Seq([
        Assert(is_platform()),
        
        # Get recipient address from arguments
        recipient := Txn.application_args[1],
        rating := Btoi(Txn.application_args[2]),  # Rating 1-5
        
        # Opt recipient into app if not already
        If(App.localGet(recipient, sbt_count_key) == Int(0))
        .Then(Seq([
            App.localPut(recipient, sbt_count_key, Int(0)),
            App.localPut(recipient, positive_rating_key, Int(0)),
            App.localPut(recipient, negative_rating_key, Int(0)),
            App.localPut(recipient, juror_eligible_key, Int(0)),
        ])),
        
        # Increment SBT count
        App.localPut(recipient, sbt_count_key, 
                    App.localGet(recipient, sbt_count_key) + Int(1)),
        
        # Update ratings
        If(rating >= Int(4))  # 4-5 star rating is positive
        .Then(App.localPut(recipient, positive_rating_key,
                          App.localGet(recipient, positive_rating_key) + Int(1)))
        .ElseIf(rating <= Int(2))  # 1-2 star rating is negative
        .Then(App.localPut(recipient, negative_rating_key,
                          App.localGet(recipient, negative_rating_key) + Int(1))),
        
        # Update timestamp
        App.localPut(recipient, last_earned_key, Global.latest_timestamp()),
        
        # Check if user is eligible to be a juror (10+ SBTs, good rating)
        If(And(
            App.localGet(recipient, sbt_count_key) >= Int(10),
            calculate_reputation_score(recipient) >= Int(70)
        ))
        .Then(App.localPut(recipient, juror_eligible_key, Int(1))),
        
        # Increment global supply
        App.globalPut(total_supply_key, App.globalGet(total_supply_key) + Int(1)),
        
        Int(1)
    ])
    
    # Update Rating - Called by platform after dispute resolution
    update_rating = Seq([
        Assert(is_platform()),
        
        recipient := Txn.application_args[1],
        rating_change := Btoi(Txn.application_args[2]),  # +1 or -1
        
        If(rating_change == Int(1))
        .Then(App.localPut(recipient, positive_rating_key,
                          App.localGet(recipient, positive_rating_key) + Int(1)))
        .Else(App.localPut(recipient, negative_rating_key,
                          App.localGet(recipient, negative_rating_key) + Int(1))),
        
        # Update juror eligibility
        If(And(
            App.localGet(recipient, sbt_count_key) >= Int(10),
            calculate_reputation_score(recipient) >= Int(70)
        ))
        .Then(App.localPut(recipient, juror_eligible_key, Int(1)))
        .Else(App.localPut(recipient, juror_eligible_key, Int(0))),
        
        Int(1)
    ])
    
    # Check Eligibility - Read-only method to check if user can be juror
    check_eligibility = Seq([
        user := Txn.application_args[1],
        
        # Return juror eligibility status
        App.localGet(user, juror_eligible_key)
    ])
    
    # Get Reputation - Read-only method to get user's reputation data
    get_reputation = Seq([
        user := Txn.application_args[1],
        
        # Return reputation score
        calculate_reputation_score(user)
    ])
    
    # Main contract logic
    program = Cond(
        # App creation - set platform address
        [Txn.application_id() == Int(0), Seq([
            App.globalPut(platform_address_key, Txn.sender()),
            App.globalPut(total_supply_key, Int(0)),
            Int(1)
        ])],
        
        [Txn.application_args[0] == method_mint_sbt, mint_sbt],
        [Txn.application_args[0] == method_update_rating, update_rating],
        [Txn.application_args[0] == method_check_eligibility, check_eligibility],
        [Txn.application_args[0] == method_get_reputation, get_reputation],
        
        # Opt-in always succeeds
        [Txn.on_completion() == Int(1), Int(1)],
    )
    
    return program

def clear_state_program():
    """Clear state program - always approve"""
    return Int(1)

if __name__ == "__main__":
    # Compile the contract
    approval_program = reputation_sbt_contract()
    clear_program = clear_state_program()
    
    # Print compiled TEAL
    print("=== SBT APPROVAL PROGRAM ===")
    print(compileTeal(approval_program, Mode.Application, version=8))
    print("\n=== SBT CLEAR STATE PROGRAM ===")
    print(compileTeal(clear_program, Mode.Application, version=8)) 