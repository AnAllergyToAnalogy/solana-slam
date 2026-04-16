use anchor_lang::prelude::*;

declare_id!("53EfrvZxz7r8VRQQQx3Lkfxk8w5UFz4znVQJiCkTtSGx");

#[program]
pub mod slam_example {
    use super::*;

    pub fn create_my_account(ctx: Context<CreateMyAccount>) -> Result<()> {
        let signer = &mut ctx.accounts.signer;
        let my_account = &mut ctx.accounts.my_account;
        let clock: Clock = Clock::get()?;

        my_account.some_public_key = signer.key();
        my_account.update_time = clock.unix_timestamp;

        Ok(())
    }

    pub fn update_account(ctx: Context<UpdateAccount>, new_bool: bool, new_key: Pubkey, new_u64: u64) -> Result<()> {
        let account_to_update = &mut ctx.accounts.account_to_update;
        let clock: Clock = Clock::get()?;
        
        if account_to_update.some_bool == new_bool {
            return err!(Errors::BoolMatch);
        }
        account_to_update.some_bool = new_bool;
        account_to_update.some_public_key = new_key;
        account_to_update.some_u64 = new_u64;
        account_to_update.update_time = clock.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMyAccount <'info>{
    #[account(
        init,
        seeds = [
            b"me".as_ref(),
            signer.key().as_ref()
        ],
        bump,
        payer = signer,
        space = MyAccountType::INIT_SPACE + 16
    )]
    pub my_account: Account<'info, MyAccountType>,

    #[account(mut)]
    pub signer: Signer<'info>,    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAccount <'info>{
    #[account(mut)]
    pub account_to_update: Account<'info, MyAccountType>,

    #[account(mut)]
    pub signer: Signer<'info>,    
    pub system_program: Program<'info, System>,
}


#[account]
#[derive(InitSpace)] 
pub struct MyAccountType {
    pub update_time:        i64,
    pub some_bool:          bool,
    pub some_public_key:    Pubkey,
    pub some_u64:           u64,
}


#[error_code]
pub enum Errors {    
    #[msg("Bool Must Not Match")]
    BoolMatch,
}