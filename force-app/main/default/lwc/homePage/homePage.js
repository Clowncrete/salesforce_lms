import { LightningElement, wire, track } from 'lwc';
import getItemTypes from '@salesforce/apex/ItemController.getItemTypes';
import searchItems from '@salesforce/apex/ItemController.searchItems';
import addCheckoutItems from '@salesforce/apex/CheckoutController.addCheckoutItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class HomePage extends LightningElement {
   @track types;
   @track itemList;
   searchString = '';
   typeString = '';
   
   barcodesList = [];

   queryTerm = "";
   noRecordsFound = false;

   handleKeyUp(evt) {
      const isEnterKey = evt.keyCode === 13;
      if (isEnterKey) {
         this.queryTerm = evt.target.value;
      }
      this.searchItems(this.queryTerm);
   }

   handleKeyUpCheckOut(evt) {
      const isEnterKey = evt.keyCode === 13;
      if (isEnterKey) {
         if(evt.target.value.length === 12) {
            addCheckoutItems({barcodes: [evt.target.value]}).then(result => {
               this.showToastMessage('Message', result, 'success');
            }, error => {
               this.showToastMessage('Message', error.body.message, 'error');
            });
         }
      }
  }

   @wire(getItemTypes, {})
   getTypes({ error, data }){
      if(data){
         for(let i = 0; i < data.length; i++) {
            this.radioOptions.push({label: data[i].Name, value: data[i].Name});
         }
         this.types = data;
      } 
      else {
      }
   }

   @wire(searchItems, {
      searchString: '$searchString',
      type: '$radioValue'
   })
   search({error, data}) {
      if(data){
         this.itemList = data;
         if(this.itemList.length < 1) {
            this.noRecordsFound = true;
         }
         else {
            this.noRecordsFound = false;
         }
      } 
      else {
      }
   }

   addCheckoutItems1(){
      //this.barcodesList = [];
      for(let i = 0; i < this.data.length; i++) {
         this.barcodesList.push(this.data[i].barcode);
      }
      addCheckoutItems({barcodes: this.barcodesList}).then(result => {
         this.showToastMessage('Message', result, 'success');     
         location.reload();
      }, error => {
         this.showToastMessage('Message', error.body.message, 'error');
      });
   }
   isBookOrMagazine(type) {
      if(type === 'Book' || type === 'Magazine') {
         return true;
      } else {
         return false;
      }
   }

   searchItems(searchText) {
      this.searchString = searchText;
   }

   onCheckout() {
      this.openModal();
   }

   @track isModalOpen = false;
    openModal() {
      this.isModalOpen = true;
    }
    closeModal() {
      this.isModalOpen = false;
    }
    submitDetails() {
      this.addCheckoutItems1();
      this.isModalOpen = false;
   }

   addItem(e) {
      if(e && e.detail) {
         let alreadyAdded = this.data.find(item => {
            return item.barcode === e.detail.ItemBarCode__c;
         });
         if(!alreadyAdded) {
            this.data.push({name: e.detail.Name, barcode: e.detail.ItemBarCode__c});
         }
      }
   }

   removeItem(e) {
      if(e && e.detail) {
         this.data = this.data.filter(item => {
            return item.barcode !== e.detail.ItemBarCode__c;
         });
      }
   }

   actions = [
      { label: 'Delete', name: 'delete' },
  ];
  
  columns = [
      { label: 'Name', fieldName: 'name' },
      { label: 'Barcode', fieldName: 'barcode' },
      {
          type: 'action',
          typeAttributes: { rowActions: this.actions },
      },
  ];

   data = [];
   record = {};

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { barcode } = row;
        const index = this.findRowIndexById(barcode);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(barcode) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.barcode === barcode) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

   radioValue = '';
   @track radioOptions = [{ label: 'All', value: '' }];

   handleRadioChange(e) {
      this.radioValue = e.detail.value;
   }

   showToastMessage(title, message, variant) {
      const evt = new ShowToastEvent({
         title,
         message,
         variant
      });
      this.dispatchEvent(evt);
   }
}