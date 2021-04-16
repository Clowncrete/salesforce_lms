public with sharing class CheckoutController {
    public CheckoutController() {

    }
     
    @AuraEnabled
     public static string addCheckoutItems(string[] barcodes)
     {
         
         if(barcodes.size() == 0) {
            return '';
         }
         List<item__c> itemList = [select Id, availableCopies__c, totalCopies__c  from Item__c where availablecopies__c > 0 and  Itembarcode__c in: barcodes ];
         List<checkout__c> checkedOutItems = new List<checkout__c>();
         if(itemList.size() == 0) {
            throw new IllegalArgumentException('Error: No copies of this book are available');
         }
         for(item__c anItem : itemList)
         {
            
             checkout__c checkOutItem = new checkout__c(
                 CheckoutUser__c = UserInfo.getUserId(),
             Item__c = anItem.id
             );
             checkedOutItems.add(checkOutItem);
         }
        insert checkedOutItems;
         return 'Checkout successful';
      }
}
