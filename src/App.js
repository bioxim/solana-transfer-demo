import React, { useState, useEffect } from "react";
import WalletSender from "./components/WalletSender";
import { Connection, PublicKey, clusterApiUrl, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";


function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const connectWallet = async () => {
    const provider = window.solana;
    if (provider?.isPhantom) {
      try {
        const resp = await provider.connect();
        setWalletAddress(resp.publicKey.toString());
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    } else {
      alert("Phantom wallet not found");
    }
  };

  const getBalance = async () => {
    if (!walletAddress) return;
    const pubkey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubkey);
    setBalance(balance / 1e9);
  };

  useEffect(() => {
    getBalance();
  }, [walletAddress]);

  const sendSol = async (recipient, amount) => {
    try {
      const provider = window.solana;
      const fromPubkey = new PublicKey(walletAddress);
      const toPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * 1e9;

      const transaction = new window.solanaWeb3.Transaction().add(
        window.solanaWeb3.SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      transaction.feePayer = fromPubkey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signed = await provider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signed.signature, "confirmed");
      await getBalance();

      alert(`✅ Transaction sent!
https://explorer.solana.com/tx/${signed.signature}?cluster=devnet`);
    } catch (err) {
      console.error(err);
      alert("Error sending SOL: " + err.message);
    }
  };

  const sendToken = async (recipient, amount) => {
    const sendToken = async (recipient, amount) => {
      try {
        const provider = window.solana;
        const fromPubkey = new PublicKey(walletAddress);
        const toPubkey = new PublicKey(recipient);
    
        const tokenMintAddress = new PublicKey("HPMrB43LBUnzVNfyeaVZC28kau19MHmxdepTnLqCKopx"); 
        const mint = tokenMintAddress;
    
        const fromTokenAccount = await getAssociatedTokenAddress(mint, fromPubkey);
        const toTokenAccount = await getAssociatedTokenAddress(mint, toPubkey);
    
        const instructions = [];
    
        // Si el destinatario no tiene cuenta asociada, creamos una
        const toAccountInfo = await connection.getAccountInfo(toTokenAccount);
        if (!toAccountInfo) {
          instructions.push(
            createAssociatedTokenAccountInstruction(
              fromPubkey,
              toTokenAccount,
              toPubkey,
              mint
            )
          );
        }
    
        instructions.push(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromPubkey,
            parseFloat(amount) * 1e6 // ⚠️ Asegurate de usar los decimales correctos (1e6 si son 6)
          )
        );
    
        const transaction = new Transaction().add(...instructions);
        transaction.feePayer = fromPubkey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
    
        const signed = await provider.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signed.signature, "confirmed");
    
        alert(`✅ Token sent!
    https://explorer.solana.com/tx/${signed.signature}?cluster=devnet`);
      } catch (err) {
        console.error(err);
        alert("Error sending token: " + err.message);
      }
    };
    
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Solana Transfer Demo</h2>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p><strong>Wallet:</strong> {walletAddress}</p>
          <p><strong>Balance:</strong> {balance} SOL</p>
          {/* Aquí insertamos el componente */}
          <WalletSender sendSol={sendSol} sendToken={sendToken} />
        </div>
      )}
    </div>
  );
}

export default App;
