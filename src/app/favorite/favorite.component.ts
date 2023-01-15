import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { Favorite } from '../favorite.model';
import { ContractService } from '../services/contract.service';
import { FavoriteService } from '../services/favorite.service';
import MarketplaceAbi from '../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../app/contractsData/Marketplace-address.json'
import NFTAbi from '../../app/contractsData/NFT.json'
import NFTAddress from '../../app/contractsData/NFT-address.json'
import { totalmem } from 'os';
import { formatEther } from 'ethers/lib/utils';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  account:any = null

  favlist: Favorite[] = [];
  marketplace:any = {}
  loading:any = true
  nft:any = {}
  items:any=[]
  price:any;
  total: any= 0;

  constructor(private dialog: MatDialog,private contractService:ContractService,private favService:FavoriteService) {}
  openDialog() {
    const dialogRef = this.dialog.open(FavoriteComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngOnInit(): void {
    this._getFav();
  }
  formatEther(price:any){
    return ethers.utils.formatEther(price)
  }
  async _getFav() {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    this.account =accounts[0];

    this.favService. getFavorit( this.account).subscribe((response:any)=>{
      this.favlist=response;
      console.log("res");
      console.log(response);
    })

    const marketplace =await new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, this.contractService.signer)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft = await new ethers.Contract(NFTAddress.address, NFTAbi.abi, this.contractService.signer)
    this.nft=nft
    console.log("connected")

    const itemCount = await (this.marketplace as any).itemCount()
    let items = []

    console.log("///////////////////////////")
    console.log(itemCount)
    console.log(this.favlist.length)
    console.log("///////////////////////////")

    for (let j = 0; j < this.favlist.length ; j++){
    for (let i = 1; i <= itemCount; i++) {

console.log(this.favlist[j].idNFT)

      const item = await (this.marketplace as any).items(i)
      if(item.itemId._hex==this.favlist[j].idNFT){
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await (this.nft as any).tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        var totalPrice = await (this.marketplace as any).getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
       
    
      }}
    }}
    this.loading=false
    this.items=items
  
    }

    async deleteFav(nftid:any ) {
      console.log("je suis id en param : "+nftid);
      for(let i = 0; i < this.favlist.length; i++)
      {
   
        console.log("je suis id liste : "+this.favlist[i].idNFT);
        
      if(this.favlist[i].idNFT==nftid)
      {
   
        console.log("je suis panier"+this.favlist[i].id)
        console.log(this.favlist[i]);
        this.favService.Unfavorit(this.favlist[i].id).subscribe((response)=>{
         
          console.log("deleted")
          
      
        });
        this._getFav();
      }
      }
        
        }



 async Buypanier(){
  for(let i = 0; i < this.items.length; i++){
    await (await this.marketplace.purchaseItem(this.items[i].itemId, { value: this.items[i].totalPrice })).wait()
    this.favService.deleteAfterSold(this.favlist[i].idNFT).subscribe((response)=>{
      console.log("deleted")
      console.log(this.favlist[i].idNFT)
  
    });
    
  }
  this._getFav();
    }


    getTotal = () =>{
      var total = 0;
      for(var i = 0; i <this.items.length; i++){
        
          total += +(this.items[i].totalPrice);

      }
      return (total/1000000000000000000);
  }


}


