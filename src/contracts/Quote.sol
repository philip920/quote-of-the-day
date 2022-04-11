pragma solidity 0.5.0;

contract Quote {
    string quoteHash;

    // Write function
    function set(string memory _quoteHash) public {
        quoteHash = _quoteHash;
    }

    // Read function
    function get() public view returns (string memory) {
      return quoteHash;
    }
}
