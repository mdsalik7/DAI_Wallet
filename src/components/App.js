import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'


class App extends Component {
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non Ethereum Browser Detected. Install Metamask Extension')
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account : accounts[0]}) //setting state for account
    const daiTokenAddress = "0xa6C9278329Ed00b3A9a2caf04447b0F559C7A52a" //replace dai address here
    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({daiTokenMock : daiTokenMock}) // ES6 Syntax - this.setState({daiTokenMock})
    console.log(this.state.daiTokenMock)
    const balance = await daiTokenMock.methods.balanceOf(this.state.account).call()
    console.log(balance.toString())
    console.log(web3.utils.fromWei(balance.toString(), 'Ether'))
    this.setState({balance : web3.utils.fromWei(balance.toString(), 'Ether')})
    const transactions = await daiTokenMock.getPastEvents('Transfer', {fromBlock : 0, toBlock : 'latest', filter : {from : this.state.account}})
    this.setState({ transactions: transactions }) //setting state for transaction
    console.log(transactions)
  }

  transfer(recipient, amount){
    this.state.daiTokenMock.methods.transfer(recipient, amount).send({from : this.state.account})
  }

  constructor(props) {
    super(props);
    this.state = { 
      account : '',
      daiTokenMock : null,
      balance : 0,
      transactions : []
     };

     this.transfer = this.transfer.bind(this)
  }



  render() {
    return (
      
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            DAI WALLET
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style = {{width : "450px"}}>
                <a
                  href="https://makerdao.com/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} width="400" />
                </a>
                  <h1>BALANCE : {this.state.balance} DAI</h1>
                  <form onSubmit = {(event) => {
                      //Todo Handle Submit
                      event.preventDefault() //Dont want the page to refresh
                      const recipient = this.recipient.value
                      const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                      console.log(recipient, amount)
                      this.transfer(recipient,amount)
                  }}>
                    <div className="form-group mr-sm-2">
                      <input
                        id="recipient"
                        type="text"
                        ref={(input) => {this.recipient = input}} //We have used ref, whatever we put in input will be stored in {(input)}
                        className="form-control"
                        placeholder="Recipient Address"/>
                    </div>
                    <div className="form-group mr-sm-2">
                      <input
                        id="amount"
                        type="text"
                        ref={(input) => {this.amount = input}} //We have used ref, whatever we put in input will be stored in {(input)}
                        className="form-control"
                        placeholder="Amount"/>
                    </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                  </form>
                  {/* Table for Recipient and Amount */}
                  <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.transactions.map((tx, key) => {
                      return (
                        <tr key={key} >
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )
                    }) }
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
