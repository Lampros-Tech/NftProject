
import './App.css';
import {useState } from "react";
import { Buffer } from "buffer";
import Decimal from "../node_modules/@zoralabs/core/dist/utils/Decimal";
import { create } from "ipfs-http-client";
import { MediaFactory } from "../node_modules/@zoralabs/core/dist/typechain/MediaFactory";
import { ethers } from "ethers";
import StoreNft from "./artifacts/contracts/Lock.sol/StoreNft.json";




const zora_contract_address = "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7";
const local_contract_address ="0xBfC07d5D44f5822874EfFC093450820DDF50FEa2";


function App() {

  const [TokenIds, setTokenIds] = useState([]);
  // const [Tokendata, setTokendata] = useState([]);




  const getId = () =>{
    return new Promise((resolve,reject) =>{
        media.on("Transfer", (from, to, tokenId) => {
        resolve(parseInt(tokenId));
      });
      
    })
  }



  //for interacting with contracts
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  //interaction with zora/core contract
  const media = MediaFactory.connect(zora_contract_address, signer);









  //TAKING NFT DATA FROM FORM
  const  handleSubmit = async (e)=>{
    e.preventDefault();
    const nftimage = e.target.nftimage.files[0];
    const name = e.target.name.value;
    const desc = e.target.desc.value;

   
      //FOR NFT IMAGE
      const client = create("https://ipfs.infura.io:5001/api/v0");
      const addedimg = await client.add(nftimage);
      const imgurl = `https://ipfs.infura.io/ipfs/${addedimg.path}`;
      console.log(imgurl);

      //FOR NFT METADATA
      const metaData = {
        name: name,
        description: desc,
        image: imgurl,
      };

      const addedmetadata = await client.add(JSON.stringify(metaData));
      const metadataurl = `https://ipfs.infura.io/ipfs/${addedmetadata.path}`;

      console.log(metadataurl);




      // MINTING

      const tx = await media.mint(
        {
          tokenURI: imgurl,
          metadataURI: metadataurl,
          contentHash: Uint8Array.from(
            Buffer.from(
              "4364f97effca6cbbf2fe699d862e69a3bc8a0bcd9b987d353e29abe8e2e7bc9e",
              "hex"
            )
          ),
          metadataHash: Uint8Array.from(
            Buffer.from(
              "4364f97effca6cbbf2fe699d862e69a3bc8a0bcd9b987d353e29abe8e2e7bc9e",
              "hex"
            )
          ),
        },
        {
          prevOwner: Decimal.new(0),
          creator: Decimal.new(50),
          owner: Decimal.new(100 - 50),
        }
      );
      tx.wait();
      console.log("New piece is minted ");
      console.log(media);



      //GETTING token ID

      let tokenId = await getId();
      console.log(tokenId);





      //INTERACTING WITH LOCAL CONTRACT FOR STORING TOKEN ID
    const local = new ethers.Contract(local_contract_address, StoreNft.abi, signer);
    const add_token_id = await local.storeNftData(tokenId);
    console.log(add_token_id);

  }

  const fetch_ids = async () =>{

    const local = new ethers.Contract(local_contract_address, StoreNft.abi, provider);
    const fetch_token_id = await local.getAllNftData();
    // console.log(fetch_token_id[0]);
    
    var tokenid = [];
    for(let i=0;i<fetch_token_id.length;i++)
    {
      console.log(parseInt(fetch_token_id[i]))
      tokenid.push(parseInt(fetch_token_id[i]));

    }
    setTokenIds(tokenid);

    for(let i=0;i<tokenid.length;i++)
    {

    const tokenURI = await media.tokenURI(tokenid[i]);
    const metadataURI = await media.tokenMetadataURI(tokenid[i]);
    // const contentHash = await media.tokenContentHashes(tokenid[i]);
    // const metadataHash = await media.tokenMetadataHashes(tokenid[i]);
    
      
    console.log("Media Information for token " + tokenid[i]);
  
    console.log({ tokenURI, metadataURI});
    }
    
    

  }





  return (
    <div className="App">
        <div className="nft-container">


        <form onSubmit={handleSubmit}>

            Upload NFT Image:<input className="input-edit-profile" type="file" id="nftimage"></input>
            <br></br>
            Name:<input type="text" id="name"></input>
            <br></br>
            Description<input type="text" id="desc"></input>
            <br></br>
            <button>Submit</button>
          </form>

          <button onClick={fetch_ids}>Fetch IDs</button>
          <h1>Explore</h1>
          {/* {Tokendata} */}


           
          </div>
    </div>
  );
}

export default App;
