"""
Ellora Freelance Escrow Smart Contract

This contract manages the escrow system for freelance jobs:
- Clients deposit ALGO/USDC for a job
- Funds are held until work is completed
- Automatic release to freelancer on approval
- Dispute resolution system with juror voting
"""

from pyteal import (
    Bytes, Int, Seq, Assert, App, Txn, Global, Gtxn, TxnType, Btoi, Or, If,
    InnerTxnBuilder, TxnField, Cond, Subroutine, TealType, compileTeal, Mode
)

def escrow_contract():
    """
    Main escrow contract for Ellora freelance marketplace
    
    Global State:
    - client_address: Address of the client who posted the job
    - freelancer_address: Address of the freelancer assigned to the job
    - escrow_amount: Amount of ALGO/USDC held in escrow
    - job_status: Current status (0=Created, 1=InProgress, 2=Completed, 3=Disputed, 4=Resolved)
    - created_timestamp: When the job was created
    - deadline_timestamp: When the job should be completed
    - dispute_votes_for: Number of juror votes for freelancer
    - dispute_votes_against: Number of juror votes for client
    - total_jurors: Total number of jurors assigned
    """
    
    # Application state keys
    client_key = Bytes("client")
    freelancer_key = Bytes("freelancer")
    amount_key = Bytes("amount")
    status_key = Bytes("status")
    created_key = Bytes("created")
    deadline_key = Bytes("deadline")
    votes_for_key = Bytes("votes_for")
    votes_against_key = Bytes("votes_against")
    jurors_key = Bytes("jurors")
    
    # Job statuses
    STATUS_CREATED = Int(0)
    STATUS_IN_PROGRESS = Int(1)
    STATUS_COMPLETED = Int(2)
    STATUS_DISPUTED = Int(3)
    STATUS_RESOLVED = Int(4)
    
    # Methods
    method_create_job = Bytes("create_job")
    method_accept_job = Bytes("accept_job")
    method_complete_job = Bytes("complete_job")
    method_approve_completion = Bytes("approve_completion")
    method_raise_dispute = Bytes("raise_dispute")
    method_vote_dispute = Bytes("vote_dispute")
    method_withdraw_funds = Bytes("withdraw_funds")
    
    @Subroutine(TealType.uint64)
    def is_client():
        return Txn.sender() == App.globalGet(client_key)
    
    @Subroutine(TealType.uint64)
    def is_freelancer():
        return Txn.sender() == App.globalGet(freelancer_key)
    
    @Subroutine(TealType.uint64)
    def is_participant():
        return Or(is_client(), is_freelancer())
    
    # Create Job - Called by client with payment
    create_job = Seq([
        # Verify this is the first call (creation)
        Assert(App.globalGet(status_key) == Int(0)),
        
        # Store client address and job details
        App.globalPut(client_key, Txn.sender()),
        App.globalPut(amount_key, Txn.application_args[1]),
        App.globalPut(status_key, STATUS_CREATED),
        App.globalPut(created_key, Global.latest_timestamp()),
        App.globalPut(deadline_key, Txn.application_args[2]),
        
        # Payment must accompany this transaction
        Assert(Gtxn[1].type_enum() == TxnType.Payment),
        Assert(Gtxn[1].amount() == Btoi(Txn.application_args[1])),
        Assert(Gtxn[1].receiver() == Global.current_application_address()),
        
        Int(1)
    ])
    
    # Accept Job - Called by freelancer
    accept_job = Seq([
        Assert(App.globalGet(status_key) == STATUS_CREATED),
        Assert(App.globalGet(freelancer_key) == Bytes("")),  # No freelancer assigned yet
        
        App.globalPut(freelancer_key, Txn.sender()),
        App.globalPut(status_key, STATUS_IN_PROGRESS),
        
        Int(1)
    ])
    
    # Complete Job - Called by freelancer when work is done
    complete_job = Seq([
        Assert(App.globalGet(status_key) == STATUS_IN_PROGRESS),
        Assert(is_freelancer()),
        
        App.globalPut(status_key, STATUS_COMPLETED),
        
        Int(1)
    ])
    
    # Approve Completion - Called by client to release funds
    approve_completion = Seq([
        Assert(App.globalGet(status_key) == STATUS_COMPLETED),
        Assert(is_client()),
        
        # Transfer funds to freelancer
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(freelancer_key),
            TxnField.amount: App.globalGet(amount_key),
        }),
        InnerTxnBuilder.Submit(),
        
        App.globalPut(status_key, STATUS_RESOLVED),
        
        Int(1)
    ])
    
    # Raise Dispute - Called by either party
    raise_dispute = Seq([
        Assert(Or(
            App.globalGet(status_key) == STATUS_IN_PROGRESS,
            App.globalGet(status_key) == STATUS_COMPLETED
        )),
        Assert(is_participant()),
        
        App.globalPut(status_key, STATUS_DISPUTED),
        App.globalPut(votes_for_key, Int(0)),
        App.globalPut(votes_against_key, Int(0)),
        App.globalPut(jurors_key, Int(5)),  # 5 jurors for disputes
        
        Int(1)
    ])
    
    # Vote on Dispute - Called by authorized jurors
    vote_dispute = Seq([
        Assert(App.globalGet(status_key) == STATUS_DISPUTED),
        # TODO: Add juror authorization check (SBT verification)
        
        # vote_for_freelancer is passed as argument (1 for freelancer, 0 for client)
        If(Btoi(Txn.application_args[1]) == Int(1))
        .Then(App.globalPut(votes_for_key, App.globalGet(votes_for_key) + Int(1)))
        .Else(App.globalPut(votes_against_key, App.globalGet(votes_against_key) + Int(1))),
        
        # Check if we have enough votes to resolve
        If(App.globalGet(votes_for_key) > App.globalGet(jurors_key) / Int(2))
        .Then(Seq([
            # Majority voted for freelancer - pay them
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(freelancer_key),
                TxnField.amount: App.globalGet(amount_key),
            }),
            InnerTxnBuilder.Submit(),
            App.globalPut(status_key, STATUS_RESOLVED),
        ]))
        .ElseIf(App.globalGet(votes_against_key) > App.globalGet(jurors_key) / Int(2))
        .Then(Seq([
            # Majority voted for client - refund them
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(client_key),
                TxnField.amount: App.globalGet(amount_key),
            }),
            InnerTxnBuilder.Submit(),
            App.globalPut(status_key, STATUS_RESOLVED),
        ])),
        
        Int(1)
    ])
    
    # Main contract logic
    program = Cond(
        [Txn.application_id() == Int(0), Int(1)],  # Creation always succeeds
        
        [Txn.application_args[0] == method_create_job, create_job],
        [Txn.application_args[0] == method_accept_job, accept_job],
        [Txn.application_args[0] == method_complete_job, complete_job],
        [Txn.application_args[0] == method_approve_completion, approve_completion],
        [Txn.application_args[0] == method_raise_dispute, raise_dispute],
        [Txn.application_args[0] == method_vote_dispute, vote_dispute],
    )
    
    return program

def clear_state_program():
    """Clear state program - always approve"""
    return Int(1)

if __name__ == "__main__":
    # Compile the contract
    approval_program = escrow_contract()
    clear_program = clear_state_program()
    
    # Print compiled TEAL
    print("=== APPROVAL PROGRAM ===")
    print(compileTeal(approval_program, Mode.Application, version=8))
    print("\n=== CLEAR STATE PROGRAM ===")
    print(compileTeal(clear_program, Mode.Application, version=8)) 