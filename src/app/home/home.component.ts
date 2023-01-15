import { Component, OnInit , OnChanges} from '@angular/core';
import { ethers } from "ethers"
import MarketplaceAbi from '../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../app/contractsData/Marketplace-address.json'
import NFTAbi from '../../app/contractsData/NFT.json'
import NFTAddress from '../../app/contractsData/NFT-address.json'
import { ContractService } from '../services/contract.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PanierService } from '../services/panier.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { PanierComponent } from '../panier/panier.component';
import { panier } from '../panier.model';
import { FavoriteService } from '../services/favorite.service';

import { resourceLimits } from 'worker_threads';
import { Favorite } from '../favorite.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  account:any = null
  loading:any = true
  result:any
  nft:any = {}
  isFavorite:boolean = false
  marketplace:any = {}
  provider:any;
  items:any=[]
  connected:any=false
  panierlist: panier[] = [];
  favlist: Favorite[] = [];
  list: Favorite[] = [];
  
 

  constructor(private contractService:ContractService,private _snackBar: MatSnackBar,private panierService:PanierService,private dialog: MatDialog ,private favService:FavoriteService) {
    this.loadMarketplaceItems()
   }


  ngOnInit(): void {
    this.contractService.message$.subscribe(message => {
      this.loadMarketplaceItems()
    });
    this._getFav();
  }
  async buyMarketItem(item:any) {
    if(this.contractService.connected==true){
      await (await this.marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
      this.panierService.deletenftsold(item.itemId._hex).subscribe((response)=>{
        console.log("delete nft sold from panier")
      
    
      });
     console.log(item.itemId._hex)
      this.loadMarketplaceItems()
      console.log("connected")
    }else{
      this._snackBar.open("il faut se connecter", "OK");
      console.log("not connected")
    }
    // await (await this.marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    // this.loadMarketplaceItems()
  }

 
  async AddToPanier(item:any) {
    if(this.contractService.connected==true){
       //window.ethereum : Connecting Metamask to frontend
    //fetch the accounts listed in our metamask wallet
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    //first account is the account connected
    // this.dataService.setAccount(accounts[0])

    this.account =accounts[0];
    
      let payload = {
        iduser: this.account ,
        idNFT: item.itemId._hex,
      };
      console.log(payload)

      this.panierService.addToCart(payload).subscribe((response)=>{
        // this.products=response.produits;
        console.log(response);
        console.log("AddToPanier")

      });
      this._snackBar.open("NFT ajouté au panier avec succés", "OK");
      
      

    }else{
      this._snackBar.open("il faut se connecter", "OK");
      console.log("not connected")
    }

    // await (await this.marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    // this.loadMarketplaceItems()
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

 

  async AddToFavorite(nft:any) {
    if(this.contractService.connected==true){
     
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
 

    this.account =accounts[0];
    
      let payload = {
        iduser: this.account ,
        idNFT: nft.itemId._hex,
        favorit:this.isFavorite
      };
      console.log(payload)
     
     
        this.favService.addFavorit(payload).subscribe((response)=>{
          this.isFavorite = true;
       });
    
    }else{
      this._snackBar.open("il faut se connecter", "OK");
      console.log("not connected")
    }
  
  }


  // async removeFromFavorite(nft:any) {
  //   if(this.contractService.connected==true){
     
  //   const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
 

  //   this.account =accounts[0];
    
  //     let payload = {
  //       iduser: this.account ,
  //       idNFT: nft.itemId._hex,
  //       favorit:this.isFavorite
  //     };
     
  //     for(let i = 0; i < this.favlist.length; i++)
  //     {
   
  //       console.log("je suis id liste : "+this.favlist[i].idNFT);
        
  //     if(this.favlist[i].idNFT==nft)
  //     {
   
  //       console.log("je suis panier"+this.favlist[i].id)
  //       console.log(this.favlist[i]);
  //       this.favService.Unfavorit(this.favlist[i].id).subscribe((response)=>{
  //         this.isFavorite = false;

         
  //         console.log("deleted")
        
      
  //       });
  //     } 
  //   }
    
  //   }else{
  //     this._snackBar.open("il faut se connecter", "OK");
  //     console.log("not connected")
  //   }
  // }

  async deleteFav(nftid:any ) {
   
  //   console.log("je suis id en param : "+nftid);
  //   console.log("je suis LON : "+this.favlist.length);

  //   for(let i = 0; i < this.favlist.length; i++)
  //   {
 
  //     console.log("je suis id liste : "+this.favlist[i].idNFT);
      
  //   if(this.favlist[i].idNFT==nftid)
  //   {
 
  //     console.log("je suis panier"+this.favlist[i].id)
  //     console.log("id fav" +this.favlist[i].id);
  //     this.favService.Unfavorit(this.favlist[i].id).subscribe((response)=>{
       
  //       this.isFavorite = false;
  //       console.log("deleted");
        
    
  //     });
  //     this._getFav();
  //   }
  //   }
  }

  async loadMarketplaceItems ()  {
    if(this.contractService.signer==null){
    // Get deployed copies of contracts(load a contract using ethers.js in an Angular application without connecting to MetaMask)
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    // const provider = new ethers.providers.Web3Provider((window as any).ethereum )
    //version ethers 5.5.4
    const marketplace =await new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, provider)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft =await new ethers.Contract(NFTAddress.address, NFTAbi.abi, provider)
    this.nft=nft
    console.log(this.nft)
    }else{
      const marketplace =await new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, this.contractService.signer)
      this.marketplace=marketplace
      console.log("load")
      console.log(this.marketplace)
      const nft = await new ethers.Contract(NFTAddress.address, NFTAbi.abi, this.contractService.signer)
      this.nft=nft
      console.log("connected")
    }
    const itemCount = await (this.marketplace as any).itemCount()
    let items = []
    console.log(itemCount)
    for (let i = 1; i <= itemCount; i++) {
      const item = await (this.marketplace as any).items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await (this.nft as any).tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await (this.marketplace as any).getTotalPrice(item.itemId)
       
       
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        

        })
      }
    }
    this.loading=false
    this.items=items
  }
  formatEther(price:any){
    return ethers.utils.formatEther(price)
  }


  


 
}
