/* eslint-disable no-undef */
const { assert } = require('chai');

const Quote = artifacts.require("Quote");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Quote', (accounts) => {
  let quote

  before(async () => {
    quote = await Quote.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = quote.address
      assert.notEqual(address, '')
      assert.notEqual(address, 0x0)
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)

    })
  })

  describe('storage', async () => {

    it('updates the quoteHash', async () => {
      let quoteHash
      quoteHash = 'hithere'
      await quote.set(quoteHash)
      const result = await quote.get()
      assert.equal(result, quoteHash)
    })
  })
})