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
    amount: "",
    keyword: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      const transactionContract = getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      setTransactions(structuredTransactions);
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setConnectedAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      localStorage.setItem("transactionCount", transactionCount);
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
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x5208", //21000 GWEI
            value: parsedAmount._hex, // 0.0001
          },
        ],
      });

      const transactionHash = await transactionContract.addToBloackchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setLoading(true);
      // console.log("Loading", transactionHash.hash);
      await transactionHash.wait();
      setLoading(false);
      // console.log("Success", transactionHash.hash);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

      window.reload();
    } catch (e) {
      console.log("Error", e);
      throw new Error("No ethereum object...");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
    checkIfTransactionExist();
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
        transactions,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

const useTransaction = () => useContext(TransactionContext);

export { useTransaction, TransactionContextProvider };
