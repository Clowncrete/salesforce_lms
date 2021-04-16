public with sharing class ItemController {
    public ItemController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItemList() {
        return [Select author__C, name, publisher__c, type__r.name from Item__c];
        /*System.debug('Records returned:' + types.size());
        System.debug('List:' + types);*/
    }

    @AuraEnabled(cacheable=true)
    public static List<Item_type__c> getItemTypes() {
        return [Select Item_Type_Id__c, name from Item_type__c];
        /*System.debug('Records returned:' + types.size());
        System.debug('List:' + types);*/
    }

    //search api here
    @AuraEnabled(cacheable=true)
    public static List<Item__c> searchItems(string searchString,string type) {
     
      List<sobject> totalInventory
          = database.query('Select a.name, a.itembarcode__c, a.author__c, a.publisher__c, a.type__r.name, a.totalcopies__c, a.availablecopies__c  from Item__c a '
                                                    + ' where a.name  like \'%'+ searchString +'%\' and a.type__r.name like \'%'+ type +'%\'' );
      return totalInventory;
  }
}
