import React, { useEffect, useState } from 'react';
import { create } from 'ipfs-http-client';
import Web3 from 'web3';
import Quote from '../abis/Quote.json'
import './App.css';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const App = () => {

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [quote, setQuote] = useState('');
  const [newQuote, setNewQuote] = useState('');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use metamask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId()
    const networkData = Quote.networks[networkId]

    if (networkData) {
      // fetch contract
      const abi = Quote.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)

      setContract(contract)

      const quoteHash = await contract.methods.get().call()
      const url = `https://ipfs.infura.io/ipfs/${quoteHash}`
      fetch(url)
        .then(response => response.json())
        .then(data => setQuote({ text: data.text, author: data.author }))
        .catch((error) => {
          console.error('Error fetching:', error);
        });

    } else {
      window.alert('smart contract not deployed to detected network!')
    }
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const onQuoteSubmit = async (event) => {
    event.preventDefault()
    console.log('submitting the form...')
    try {
      const quoteCid = await ipfs.add(JSON.stringify(newQuote))
      const quoteHash = quoteCid.path
      await contract.methods.set(quoteHash).send({ from: account })
    } catch (error) {
      console.log('Error uploading quote: ', error)
    }
  }

  return (
    <div>
      <nav className="navbar p-2">
        <h4>Quote of the Day</h4>
        <h5>{account}</h5>
      </nav>
      <main>
        <div>
          <div className="mx-auto text-center">
            {quote.text && quote.text.length > 0 &&
              <h1 className="mb-3" >"{quote.text}"</h1>
            }
            {quote.author && quote.author.length > 0 &&
              <h4 className="mb-5" >- {quote.author}</h4>
            }
            <h5>Change Quote:</h5>
            <form onSubmit={onQuoteSubmit} >
              <div className="mb-3">
                <input type="text" placeholder='Quote...' onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })} />
              </div>
              <div className="mb-3">
                <input type="text" placeholder='Author...' onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })} />
              </div>
              <div>
                <input type="submit" />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


export default App;
