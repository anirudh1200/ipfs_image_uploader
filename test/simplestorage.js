const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", accounts => {
  it("...should store the value 'Test String'.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    // Set value of string to 'Test String'
    await simpleStorageInstance.set('Test String', { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 'Test String', "The value 'Test String' was not stored.");
  });
});
