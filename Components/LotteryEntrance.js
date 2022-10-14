import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { contractAddress, abi } from "../constants/index";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  async function updateUi() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const playersFromCall = (await getNumberOfPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(playersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      //try to read from the contract
      updateUi();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotications(tx);
    updateUi();
  };

  const handleNewNotications = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 rounded-lg p-2 mb-2 text-white shadow-xl"
        onClick={async () => {
          await enterRaffle({
            onSuccess: handleSuccess,
            onError: (e) => {
              console.log(e);
            },
          });
        }}
        disabled={isFetching || isLoading}
      >
        {isLoading || isFetching ? (
          <div className="animate-spin h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
            <div>Enter Raffle</div>
        )}
      </button>
      {raffleAddress ? (
        <div>
          <p>
            Raffle EntranceFee : {ethers.utils.formatEther(entranceFee)} ETH
          </p>
          <p>Number of Players : {numPlayers}</p>
          <p>Recent Winner : {recentWinner}</p>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}

export default LotteryEntrance;
