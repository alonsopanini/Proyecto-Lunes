public with sharing class lightningTableController {

    //This method allows us to get the Contacts from Salesforce and return them in our table

    @AuraEnabled (cacheable=true)

    public static List<Contact> getContacts() {
        try{
            List<Contact> lstContacts = [SELECT Id, FirstName, LastName, Email, Phone
            FROM Contact];
    
            return lstContacts;

        }

        catch(Exception e){
            system.debug(e.getMessage());
            throw e;
        }
    }

    // This method allow us to CREATE A NEW CONTACT and insert them in our table with a modal in the Create Contact button
    @AuraEnabled 

    public static Contact createContact(String FirstName, String LastName, String Email, String Phone) {
        try{

            Contact newContact = new Contact();
            newContact.FirstName = FirstName;
            newContact.LastName = LastName;
            newContact.Email = Email;
            newContact.Phone = Phone;

            insert newContact;
            return newContact;

        }

        catch(Exception e){
            system.debug(e.getMessage());
            throw e;
        }
    }


    //This method allows us to update existing contacts in our table, in the row action 'Edit' button
    @AuraEnabled
    public static Contact updateContact(String Id, String FirstName, String LastName, String Email, String Phone) {
        try {
            Contact contactToUpdate = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE Id = :Id LIMIT 1];
            if(contactToUpdate != null) {
                contactToUpdate.FirstName = FirstName;
                contactToUpdate.LastName = LastName;
                contactToUpdate.Email = Email;
                contactToUpdate.Phone = Phone;
                update contactToUpdate;
            }
            return contactToUpdate;
        } 

        catch(Exception e){
            system.debug(e.getMessage());
            throw e;
        }
    }

    //This method allows us to delete existing contacts in our table in the row action button 'Delete'
    @AuraEnabled
    public static void deleteContact(String contactId) {
        try {
            Contact contactToDelete = [SELECT Id FROM Contact WHERE Id = :contactId LIMIT 1];
            if(contactToDelete != null) {
                delete contactToDelete;
            }
        } 
        
        catch(Exception e){
            system.debug(e.getMessage());
            throw e;
        }
    }
}