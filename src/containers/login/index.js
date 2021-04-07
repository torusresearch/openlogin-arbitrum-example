import React, { useEffect, useState } from "react";
import OpenLogin from "openlogin";
import AccountInfo  from "../../components/AccountInfo";
import { useArbTokenBridge } from "token-bridge-sdk";
import { Bridge } from "arb-ts";
import  * as ethers from "ethers";
const ethProvider = ethers.providers.getDefaultProvider("https://kovan.infura.io/v3/65982ef7e3f24b3586823483ebdc99e0");
const arbProvider = new ethers.providers.JsonRpcProvider("https://kovan4.arbitrum.io/rpc");

function Login() {
  const [loading, setLoading] = useState(false);
  const [openlogin, setSdk] = useState(undefined);
  const [bridgeDetails, setArbitrumBridge] = useState(null);
  const [walletInfo, setUserAccountInfo] = useState(null);
  useEffect(() => {
    setLoading(true);
    async function initializeOpenlogin() {
      const sdkInstance = new OpenLogin({
        clientId: "YOUR_PROJECT_ID", // your project id
        network: "testnet",
      });
      await sdkInstance.init();
      if (sdkInstance.privKey) {
        const privateKey = sdkInstance.privKey;
        createArbitrumBridge();
      }
      setSdk(sdkInstance);
      setLoading(false);
    }
    initializeOpenlogin();
  }, []);

  async function createArbitrumBridge(privateKey){
    const ethSigner = new ethers.Wallet(privateKey, ethProvider);
    const arbSigner = new ethers.Wallet(privateKey, arbProvider);
    const bridgeInstance = new Bridge("0xC0250Ed5Da98696386F13bE7DE31c1B54a854098","0xC0250Ed5Da98696386F13bE7DE31c1B54a854098", ethSigner, arbSigner);
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
              bridgeDetails={bridgeDetails}
              handleLogout={handleLogout}
              loading={loading}
              privKey={openlogin?.privKey}
              walletInfo={walletInfo}
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
