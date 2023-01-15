import { Component, OnInit,NgZone} from '@angular/core';
import { ethers } from "ethers"
import { environment } from './../../../environments/environment';
import MarketplaceAbi from '../../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../../app/contractsData/Marketplace-address.json'
import NFTAbi from '../../../app/contractsData/NFT.json'
import NFTAddress from '../../../app/contractsData/NFT-address.json'
import { ContractService } from 'src/app/services/contract.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier.service';
import { panier } from 'src/app/panier.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon'
import { MatDialog ,MatDialogConfig} from '@angular/material/dialog';
import { PanierComponent } from '../../panier/panier.component';
import { FavoriteComponent } from 'src/app/favorite/favorite.component';
import {MatBadgeModule} from '@angular/material/badge';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  accountAdmin = environment.ACCOUNT_ADMIN
  loading:any = true
  account:any = null
  nft:any = {}
  marketplace:any = {}
  provider:any;
  openCart: boolean = false;
  items:any=[]
  adminAccount : any = 0
  panierlist: any;
  constructor(private route:Router,private ngZone: NgZone,private contractService:ContractService,private panierService:PanierService,private _snackBar: MatSnackBar,private dialog: MatDialog) {

   }



  ngOnInit(): void {
    (window as any).ethereum.on('accountsChanged', async (accounts:any) => {
      this.ngZone.run(() => {
        this.contractService.connected=false
        this.contractService.signer=null
        this.account = accounts[0];
        console.log(this.account);
        this.route.navigateByUrl('');       
      });
    });
  }



  async openDialog() {
    const dialogConfig = new MatDialogConfig();

   
    const dialogRef = this.dialog.open(PanierComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
    

  async  web3Handler ()  {
    //window.ethereum : Connecting Metamask to frontend
    //fetch the accounts listed in our metamask wallet
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    //first account is the account connected
    // this.dataService.setAccount(accounts[0])
    this.account =accounts[0];
    // console.log(accounts.length)
    console.log(this.account)
    console.log(this.accountAdmin)

    if(this.accountAdmin==this.account){
      this. adminAccount = 1;
      console.log("admin")
    }

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    
    // Signers will sign transactions for you using your private key of you account connected
    const signer = (provider as any).getSigner()
    this.loadContracts(signer)
  }

  async loadContracts (signer:any)  {
    // Get deployed copies of contracts
    this.contractService.signer=signer;
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    this.nft=nft
    this.loading=false
    this.contractService.marketplaceContract=marketplace
    this.contractService.nftContract=nft
    this.contractService.connected=true
    this.contractService.account=this.account
    this.contractService.updateConnect(true)
  }
  formatEther(price:any){
    return ethers.utils.formatEther(price)
  }


  async openDialogFav() {
    const dialogConfig = new MatDialogConfig();

   
    const dialogRef = this.dialog.open(FavoriteComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async _getCart() {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    this.account =accounts[0];

    this.panierService.getCartItems( this.account).subscribe((response:any)=>{
      this.panierlist=response;
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
    console.log(this.panierlist.length)
    console.log("///////////////////////////")

    for (let j = 0; j < this.panierlist.length ; j++){
    for (let i = 1; i <= itemCount; i++) {

console.log(this.panierlist[j].idNFT)

      const item = await (this.marketplace as any).items(i)
      if(item.itemId._hex==this.panierlist[j].idNFT){
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
          image: metadata.image
        })
      }}
    }}
    this.loading=false
    this.items=items
    }

  getNumber = () =>{
  
    var number = 0;
    for(var i = 0; i <this.items.length; i++){
      
        number += +1;
       
    }
    return (number);
}
}
