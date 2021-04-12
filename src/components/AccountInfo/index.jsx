import React, { useEffect, useState } from "react";
import { PageHeader, Button } from "antd";
import "./style.scss";
import { useArbTokenBridge } from "token-bridge-sdk";
import { utils } from "ethers";
import { toast, ToastContainer  } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function AccountInfo({handleLogout, privKey, bridgeDetails}) {
  const [privateKeyHidden, setPkeyVisiblity] = useState(false);

  const bridge = useArbTokenBridge(
      bridgeDetails, false
  ) 
    
  const {
    walletAddress,
    balances,
  } = bridge;
  console.log("bridge", bridge)

  useEffect(()=>{
      window.setTimeout(async()=>{
        await balances.update()
      }, 3000);
  },[])

  async function depositEthToArbitrum(){
    try {
      toast.info("deposit request initiated. waiting for confirmation");
      const receipt = await bridge.eth.deposit("0.01");
      console.log("reciept", receipt);
      toast.success("Eth depostited to arbitrum bridge wallet")
      refreshBalances();
    } catch (error) {
      console.log("error", error.reason);
      toast.error("Error while depositing eth to arbitrum:"+  error.reason);
    }
  }

  async function withdrawEthToArbitrum(){
    try {
      toast.info("Withdrawal request initiated, waiting for confirmation");
      const receipt = await bridge.eth.withdraw("0.01");
      console.log("reciept", receipt);
      toast.success("Eth withdrawn request sent from arbitrum bridge wallet")
      refreshBalances();
    } catch (error) {
      console.log("error", error);
      alert("Error while withdrawing eth from arbitrum:"+ error.reason);
    } 
  }


  async function refreshBalances(){
    await balances.update()
    toast.success("Balance refreshed successfully");
  }


  return (
      <div>
          <ToastContainer/>
          <PageHeader
              className="site-page-header"
              title="Openlogin x Arbitrum"
              extra={[
                  <Button key="1" type="primary" onClick={handleLogout}>
                  Logout
                  </Button>,
              ]}
          />
          <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
              Get some L1 (ethereum) testnet eth from  <a href="https://faucet.kovan.network">kovan faucet</a> before depositing eth to L2(arbitrum) testnet.
              
              <div style={{margin:20}}>
                Wallet address: <i>{walletAddress}</i>
              </div>
              <div style={{margin:20}}>
                Eth chain Balance: <i>{(utils.formatEther(balances.eth.balance)) || 0}</i>
              </div>
              <div style={{margin:20}}>
                Arb chain Balance: <i>{(utils.formatEther(balances.eth.arbChainBalance)) || 0}</i>
              </div>
              <hr/>
              <span>Private key:</span>
              {
                !privateKeyHidden ? 
                <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
                  <span style={{margin: 20}}>{"********************************"}</span>
                  <button onClick={()=>{setPkeyVisiblity(true)}}>Show Private Key</button>
                </div>:
                <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
                 <span style={{margin: 20}}>{(privKey)}</span>
                  <button onClick={()=>{setPkeyVisiblity(false)}}>Hide Private Key</button>
                </div>
              }
            


            
          </div>
          <div style={{margin:20}}>
              <button onClick={depositEthToArbitrum}>
                  Deposit 0.01 eth to arbitrum chain
              </button>

              <button onClick={withdrawEthToArbitrum}>
                  Withdraw 0.01 eth from arbitrum
              </button>
              
              <button onClick={refreshBalances}>
                  Refresh balances
              </button> 
            </div>
            Withdrawals from l2(arbitrum) to l1(ethereum) takes 24 hours roughly on kovan4 testnet.
            You can check your l2 transaction here: <a href="https://explorer.arbitrum.io">Arbitrum testnet block explorer</a>
          </div>
      
          
    </div>
  )
}

export default AccountInfo;