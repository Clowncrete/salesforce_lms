trigger item_checkout on Checkout__c (after insert, after update) {

   if(trigger.isinsert)
   {
       List<Id> itemIds = new List<Id>();
       
       for (Checkout__c a : Trigger.new) {
          itemIds.add(a.item__c);            
       }
       List<Item__c> items = [SELECT c.id, c.name, c.AvailableCopies__c, c.totalcopies__C, c.itembarcode__C FROM Item__C c
                     WHERE c.id in: itemIds ];
       for (Item__c i : items)
       {
           i.AvailableCopies__c= i.AvailableCopies__c - 1;
           update i;
       }

   }
   
   if(trigger.isupdate)
   {
       List<Id> itemIds = new List<Id>();
       
       for (Checkout__c a : Trigger.new) {
          itemIds.add(a.item__c);            
       }
       List<Item__c> items = [SELECT c.id, c.name, c.AvailableCopies__c, c.totalcopies__C, c.itembarcode__C FROM Item__C c
                     WHERE c.id in: itemIds ];
       for (Item__c i : items)
       {
           i.AvailableCopies__c= i.AvailableCopies__c + 1;
           update i;
       }

   }

}