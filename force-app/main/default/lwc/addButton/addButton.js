import { LightningElement, api } from 'lwc';

export default class AddButton extends LightningElement {
   isAvailable = true;
   isSelected = false;

   assignedItem;

   @api 
   get item() {
      
   }

   set item(item) {
      if(item) {
         this.assignedItem = item;
         if(item.AvailableCopies__c > 0) {
            this.isAvailable = true;
         } else {
            this.isAvailable = false;
         }
      }
   }

   handleClick() {
      if(!this.isSelected) {
         this.addHandler();
      } else {
         this.removeHandler();
      }
      this.isSelected = !this.isSelected;
   }

   addHandler() {
      this.dispatchEvent(new CustomEvent('add', {detail: this.assignedItem}));
   }

   removeHandler() {
      this.dispatchEvent(new CustomEvent('remove', {detail: this.assignedItem}));
   }
}