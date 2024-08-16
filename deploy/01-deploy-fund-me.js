// kako smo prije radili
// import
// main function
// calling of main function

const { address } = require("bitcoinjs-lib")
const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
// function deployFunc() {
// 	console.log("Hi")
// 	const { getNamedAccounts, deployments } = hre

// }
// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log, get } = deployments
	const { deployer } = await getNamedAccounts()
	const chainId = network.config.chainId
	// when going for localhost or hardhat we want to use a mock

	// const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
	let ethUsdPriceFeedAddress
	if (developmentChains.includes(network.name)) {
		const ethAggregator = await get("MockV3Aggregator")
		ethUsdPriceFeedAddress = ethAggregator.address
	} else {
		ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
	}
	const args = [ethUsdPriceFeedAddress]
	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: args, //put price feed address
		log: true,
		waitConfrimations: network.config.blockConfirmations || 1,
	})
	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		await verify(fundMe.address, args)
	}
	log("---------------------------------------")
}

module.exports.tags = ["all", "fundme"]
