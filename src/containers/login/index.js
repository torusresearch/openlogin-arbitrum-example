import React, { useEffect, useState } from "react";
import OpenLogin from "openlogin";
import AccountInfo  from "../../components/AccountInfo";
import { Bridge } from "arb-ts";
import  * as ethers from "ethers";

import "./style.scss";

const kovan4_testnet_config = {
  ethRPC: "https://kovan.infura.io/v3/65982ef7e3f24b3586823483ebdc99e0",
  arbRPC: 'https://kovan4.arbitrum.io/rpc',  
  erc20BridgeAddress: '0x2948ac43e4AfF448f6af0F7a11F18Bb6062dd271',
  arbTokenBridgeAddress: '0x64b92d4f02cE1b4BDE2D16B6eAEe521E27f28e07',
};

const ethProvider = ethers.providers.getDefaultProvider(kovan4_testnet_config.ethRPC);
const arbProvider = new ethers.providers.JsonRpcProvider(kovan4_testnet_config.arbRPC);


function Login() {
  const [loading, setLoading] = useState(false);
  const [openlogin, setSdk] = useState(undefined);
  const [bridgeInstance, setArbitrumBridge] = useState(null);
  useEffect(() => {
    setLoading(true);
    async function initializeOpenlogin() {
      const sdkInstance = new OpenLogin({
        clientId: "BL06YSvMaMDKFD4KY_-UDo5UxlYrdNkOQ2YG08OgmSYE15Xj7RURlD-UtP74RzRsoyUAyDUT1K8FK9USa6Xxsvs", // your project id
        network: "testnet",
        originData: {
          "https://arbitrum-openlogin.herokuapp.com" : "MEUCIQCZziiTseA67Wckk8WlH-DN7g7O2i0mRw8bUKHpIfcVJQIgYdT65i9FllLjtNMd-PWRmD95feagDCMpd6g0hzYlF5M"
        }
      });
      await sdkInstance.init();
      if (sdkInstance.privKey) {
        const privateKey = sdkInstance.privKey;
        createArbitrumBridge(privateKey);
      }
      setSdk(sdkInstance);
      setLoading(false);
    }
    initializeOpenlogin();
  }, []);

  async function createArbitrumBridge(privateKey){
    const ethSigner = new ethers.Wallet(privateKey, ethProvider);
    const arbSigner = new ethers.Wallet(privateKey, arbProvider);
    const bridgeInstance = new Bridge(kovan4_testnet_config.erc20BridgeAddress,kovan4_testnet_config.arbTokenBridgeAddress, ethSigner, arbSigner);
    setArbitrumBridge(bridgeInstance);
  }


  async function handleLogin() {
    setLoading(true)
    try {
      const privKey = await openlogin.login({
        loginProvider: "google",
        redirectUrl: `${window.origin}`,
      });
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    await openlogin.logout();
    setLoading(false)
  };
  return (
    <>
    {
    loading ?
      <div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
              <h1>....loading</h1>
          </div>
      </div> :
      <div>
        {
          (openlogin && openlogin.privKey) ?
            <AccountInfo
              bridgeDetails={bridgeInstance}
              handleLogout={handleLogout}
              loading={loading}
              privKey={openlogin?.privKey}
            /> :
            <div className="loginContainer">
                <h1 style={{ textAlign: "center" }}>Openlogin x Arbitrum</h1>
                <div onClick={handleLogin} className="btn">
                  Login
                </div>
            </div>
        }

      </div>
    }
    </>
  );
}

export default Login;
