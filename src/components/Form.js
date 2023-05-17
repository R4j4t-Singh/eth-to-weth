import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, abi } from "./constants";
import "../App.css";

export default function Form() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [ethaddress, setEthaddress] = useState("");
  const [ethAmount, setethAmount] = useState("");
  const [data, setData] = useState([]);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    console.log(data);
    if(data.length > 0)
      localStorage.setItem("data", JSON.stringify(data));
    else if(JSON.parse(localStorage.getItem("data")))
      setData(JSON.parse(localStorage.getItem("data")));
  }, [data])


  setInterval(metamask, 3000);

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const add = await signer.getAddress();
      setEthaddress(add);
      setConnected(true);
      console.log("address" + add);
    } else alert("Install Metamask");
  }

  const mint = async () => {

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("address" + ethaddress);

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transactionResponse = await contract.deposit({
        value: ethers.utils.parseEther(ethAmount),
      });
      await transactionResponse.wait();

      storeData();
    } else alert("Install Metamask");
  };

  function storeData() {
    let flag = 0;

    data.forEach(function(item){
      if(item.ethaddress === ethaddress){
        item.ethAmount = Number(ethAmount) + Number(item.ethAmount);
        item.email = email;
        item.name = name;
        flag = 1 ;
      }
      console.log(item.ethAmount);
    })

    if(flag){
      setData([...data]);  
      return;
    }

      const newData = {
        name: name,
        email: email,
        ethaddress: ethaddress,
        ethAmount: ethAmount,
      };
      console.log(newData);
      setData((prevstate) => [...prevstate, newData]);
  }

  function metamask() {
    
    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.selectedAddress !== null) {
        setEthaddress(window.ethereum.selectedAddress);
        setConnected(true);
      }
      else {
        setEthaddress("");
        setConnected(false);
      }
    }
  }


  return (
    <div className="container">
      <div className="form" >
        <div className="header">
          <h1>
            Mint <span style={{ color: "#7FD970" }}>WETH</span><br/>ERC20
          </h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input placeholder="Ethereum Address" value={ethaddress} readOnly />
        <br />
        <input
          type="number"
          placeholder="Amount ETH"
          value={ethAmount}
          onChange={(e) => setethAmount(e.target.value)}
        />
        <br />
        {connected?
        <button onClick={mint}>Mint WETH</button>
        :
        <button onClick={connect}>Connect</button>
        }
      </div>

      <div className="datatable">
      <h2 ><span style={{color:"#7FD970"}}>{data.length}</span> Minters</h2>
        <table className="table">
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>#{data.indexOf(item) + 1}</td>
                <td>{item.name}</td>
                <td>
                  {item.email.slice(0, 4)}*****{item.email.slice(-13)}
                </td>
                <td>
                  {item.ethaddress.slice(0, 3)}...{item.ethaddress.slice(-4)}
                </td>
                <td>{item.ethAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
