const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
beforeEach(async () =>{
  //Get list of account available in ganache test network
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data: bytecode,arguments: ['Hi there!']})
  .send({from: accounts[0], gas: '1000000' });
});

describe('Inbox', ()=>{
  it('Deploys a contract', ()=>{
    assert.ok(inbox.options.address);
  });

  it('has initial message', async () =>{
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  it('can change message', async () =>{
    await inbox.methods.setMessage('bye').send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
