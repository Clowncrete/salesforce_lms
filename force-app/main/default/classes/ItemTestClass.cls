public with sharing class ItemTestClass {
    public ItemTestClass() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Item_type__c> getItemTypes() {
        return [Select Item_Type_Id__c, name from Item_type__c];
        /*System.debug('Records returned:' + types.size());
        System.debug('List:' + types);*/
    }
    
    public static void getItems() {
      Map<String, Schema.SObjectType> gd = 
        Schema.getGlobalDescribe(); 
        System.debug(gd);
    }
}