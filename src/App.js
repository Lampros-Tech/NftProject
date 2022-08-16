
import './App.css';
import {useState } from "react";
import { Buffer } from "buffer";
import Decimal from "../node_modules/@zoralabs/core/dist/utils/Decimal";
// import { create } from "ipfs-http-client";
import { MediaFactory } from "../node_modules/@zoralabs/core/dist/typechain/MediaFactory";
import { ethers } from "ethers";
import { NFTStorage, File} from "nft.storage";
import axios from "axios";

import StoreNft from "./artifacts/contracts/Lock.sol/StoreNft.json";




const zora_contract_address = "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7";
const local_contract_address ="0x95651D7C5f9b1A42D0a891274FF9db31F6deCb7d";



function App() {

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQyRGJGMDUxNUM2MTc2ZjE3MDExZTUyNDM4Q0JjNTQ3YzY4RTllZTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTc5ODExMzU4OCwibmFtZSI6Ik5GVCJ9.jJhUz3RHVCZBJO-F3c9opVIqd4sSfIQhPRZLlN7ASIE";
  const client = new NFTStorage({ token: token });


  const [Tokendata, setTokendata] = useState([]);
  




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

  //  console.log(nftimage);

   const f = new File([nftimage], "abc.jpg", { type: "image/gif" });
      
   
   
  //  FOR NFT IMAGE
      // const client = create("https://ipfs.infura.io:5001/api/v0");
      // const addedimg = await client.add(nftimage);
      // const imgurl = `https://ipfs.infura.io/ipfs/${addedimg.path}`;
      // console.log(imgurl);

      //FOR NFT METADATA
      const metaData = {
        name: name,
        description: desc,
        image: f,
      };

      // const addedmetadata = await client.add(JSON.stringify(metaData));
      // const metadataurl = `https://ipfs.infura.io/ipfs/${addedmetadata.path}`;

      // console.log(metadataurl);
      // https://ipfs.io/ipfs/bafybeiga7yfv2xg6yrmud3qgcrqwwsblr3erfclglsqtqovxr2el6nvrnq/abc.jpg
      const metadata = await client.store(metaData);
      const fronturl = metadata.data.image.href;
      const finalurl = fronturl.slice(7);
      console.log(finalurl);

      const imgurl = "https://ipfs.io/ipfs/"+finalurl;
      console.log(imgurl);





      // MINTING

      const tx = await media.mint(
        {
          tokenURI: imgurl,
          metadataURI: metadata.url,
          contentHash: Uint8Array.from(
            Buffer.from(
              "b2fde41578daa33388beedc742b5cb0fb4c9f5539ba91819cb7f4de27b5ea6ef",
              "hex"
            )
          ),
          metadataHash: Uint8Array.from(
            Buffer.from(
              "b2fde41578daa33388beedc742b5cb0fb4c9f5539ba91819cb7f4de27b5ea6ef",
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
    await local.storeNftData(tokenId);
    console.log("token id "+tokenId +" stored in contract");

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
    

    var tokendata=[];

    
    for(let i=0;i<tokenid.length;i++)
    {
    
    const tokenURI = await media.tokenURI(tokenid[i]);
    const metadataURI = await media.tokenMetadataURI(tokenid[i]);

      const metaurl = metadataURI.slice(7);
      const finalmetadataurl = "https://ipfs.io/ipfs/"+metaurl
      // console.log(finalmetadataurl);
      await axios.get(finalmetadataurl).then((response) => {
      // console.log(response.data, "The data is");
      const name = response.data.name;
      const desc = response.data.description;
      // console.log({name,desc});
      tokendata.push({tokenURI,metadataURI,name, desc });
      // console.log(response.data.image);  
       });

    

    }
    console.log(tokendata);

    setTokendata(...Tokendata,tokendata);
    
  }



  console.log(Tokendata);
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

          <button onClick={fetch_ids}>Fetch NFTs</button>
          <h1>Explore</h1>
          {Tokendata.map(item =>(
            <div className="nftImageBox">
                  <img className="nftImage" src={item.tokenURI} alt="NFT"></img>
                  Name:  {item.name}<br></br>
                  Description:  {item.desc}<br></br>
            </div>
            ))}
           
          </div>
    </div>
  );
}

export default App;
