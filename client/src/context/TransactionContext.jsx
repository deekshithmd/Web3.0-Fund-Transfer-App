import { createContext, useContext, useEffect, useState } from "react";
import { ethers, providers } from "ethers";

import { contractABI, contractAddress } from "../utils/contants";

const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

const TransactionContextProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    addressTo: "",
    aount: "",
    keyword: "",
    message: "",
  });
  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };
  const checkIfWalletConnected = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setConnectedAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAccount(accounts[1]);
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

const useTransaction = () => useContext(TransactionContext);

export { useTransaction, TransactionContextProvider };
