import { LightningElement, api } from 'lwc';

export default class ItemCard extends LightningElement {

   isBookOrMagazine = true;
   @api 
   get type() {
      
   }

   set type(type) {
      if(type === 'Book' || type === 'Magazine') {
         this.isBookOrMagazine = true;
      } else {
         this.isBookOrMagazine = false;
      }
   }
}