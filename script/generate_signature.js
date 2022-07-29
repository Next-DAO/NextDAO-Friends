const dotenv = require("dotenv");
const { ethers } = require("ethers");

dotenv.config();

if (!process.env.SIGNER_PRIVATE_KEY || !process.env.INFURA_PROJECT_ID) {
  console.error(
    "Please set SIGNER_PRIVATE_KEY and INFURA_PROJECT_ID environment variables."
  );
  process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const signerWallet = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY,
  provider
);

const generateToken = async (tokenId, walletAddress) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address"],
      [tokenId, walletAddress.substr(2)]
    )
  );

  const message = ethers.utils.arrayify(hash);
  const signature = await signerWallet.signMessage(message);
  return { signature };
};

const wallet = "0xE8161C68C6c83f36c5eb44f9BB67f2Ad8CDd321d";
const tokenIds = [];

const main = async () => {
  for (let tokenId of tokenIds) {
    const { signature } = await generateToken(tokenId, wallet);
    console.log("====== Signature ======");
    console.log("Token Id: ", tokenId);
    console.log("Signature: ", signature);
  }
};

main();
