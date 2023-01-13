require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/r-IQv8Srsg-QpuMQJwvR8buzQcKHX0YY",
      accounts: [
        "3f65d94acd748b9a057eb9098360539bb0c14438194f77bc2f2c4e18dab57dad",
      ],
    },
  },
};
