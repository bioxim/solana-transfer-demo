import React, { useState } from "react";

const WalletSender = ({ sendSol, sendToken }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("SOL");

  const handleSend = () => {
    if (selectedAsset === "SOL") {
      sendSol(recipient, amount);
    } else {
      sendToken(recipient, amount);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-gray-100 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Enviar fondos</h2>

      <input
        type="text"
        placeholder="Dirección destino"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <input
        type="number"
        placeholder="Cantidad"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />

      <select
        value={selectedAsset}
        onChange={(e) => setSelectedAsset(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="SOL">SOL</option>
        <option value="SNUG">SNUG</option>
      </select>

      <button
        onClick={handleSend}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded"
      >
        Enviar {selectedAsset}
      </button>
    </div>
  );
};

export default WalletSender;
