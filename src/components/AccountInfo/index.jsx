import React, { useEffect, useState } from "react";
import { PageHeader, Button } from "antd";
import "./style.scss";
import { useArbTokenBridge } from "token-bridge-sdk";
import { utils } from "ethers";
function AccountInfo({handleLogout, privKey, bridgeDetails}) {
const bridge = useArbTokenBridge(
    bridgeDetails, false
) 
  
const {
  walletAddress,
  balances,
} = bridge;
 console.log("bridge", bridge)

 useEffect(()=>{
    window.setInterval(()=>{
      balances.update()
    }, 3000);
 },[])


 return (
    <div>
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
            <div style={{margin:20, maxWidth: 900, wordWrap: "break-word"}}>
               <span style={{margin: 20}}>{(privKey)}</span>
            </div>
          </div>
        </div>
  </div>
 )
}

export default AccountInfo;