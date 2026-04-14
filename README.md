# SLAM Test Framework

### **S**olana, **L**iteSVM, **A**nchor, **M**ocha

An extremely opinionated test framework for writing tests in Anchor using LiteSVM and Mocha. I developed this for my own use, but have decided to publish it as the Solan dev ecosystem is generally pretty abysmal and apparently people have issues writing tests with the existing tools, and nobody benefits from poorly tested programs except for blackhats. 

The test framework uses `@solana/web3.js` in stead of `@solana/kit` even though the former is deprecated because this is what is used out of the box with Anchor. 

Haven't tested this with Anchor `1.0.0`, it was developed for `0.32.1` and earlier. 

## 


