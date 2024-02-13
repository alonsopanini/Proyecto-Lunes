import { LightningElement, api } from 'lwc';
import getContacts from '@salesforce/apex/lightningTableController.getContacts';
import createContact from '@salesforce/apex/lightningTableController.createContact';
import updateContact from '@salesforce/apex/lightningTableController.updateContact';
import deleteContact from '@salesforce/apex/lightningTableController.deleteContact';

export default class SampleLightningTable0902 extends LightningElement {
    
    isUpdate
    isCreateContact

    //Variables
    recordData = {
        Id : null,
        FirstName : '',
        LastName : '',
        Email : '',
        Phone : ''
    };
    displayModal=false;
    rowFields={};
    data=[];
    lstContacts = [];
    contactToUpdate;
    contactToDelete;
    title;
    FirstName;
    LastName;
    Email;
    Phone;
    @api record;

    //Obtain our data to show it on the table

    async obtainContacts() {
        try {
            const contacts = await getContacts();
            this.lstContacts = contacts;
        }

        catch (error) {
            console.error(error);
        }
    };

    async connectedCallback() {
            await this.obtainContacts();
        }



    actions = [
        {
            label: 'Edit',
            name: 'edit',
        },

        {
            label: 'Delete',
            name: 'delete'
        }

    ];

    columns = [
        {
            label: 'Name',
            fieldName: 'FirstName'
        },

        {
            label: 'Last Name',
            fieldName: 'LastName'
        },

        {
            label: 'Email',
            fieldName: 'Email'
        },

        {
            label: 'Phone',
            fieldName: 'Phone'
        },

        {
            type: "action",
            typeAttributes: { rowActions: this.actions }
        }
    ];

    handleCancel(){
        this.displayModal= false;
    };

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const rowId = event.detail.row;
        const name = event.detail.row.FirstName;

        switch (actionName) {
            case 'edit':
                this.title = 'Edit Records';
                this.record = rowId;
                this.handleOpenModal();
                this.handleEdit(rowId);
                break;
            case 'delete':
                this.handleDelete(rowId.Id); 
                break;
                
        }
    };

    handleEdit(row){
        this.recordData = row;
        console.log('recordData: ',this.recordData)
    }


    handleOpenModal() {
        this.displayModal = true;

    };

    handleOpenModalNewContact() {
        this.isCreateContact = true
        this.displayModal = true;
        this.title= 'New Contact';
        this.recordData = {
            Id : null,
            FirstName : '',
            LastName : '',
            Email : '',
            Phone : ''
        };
    };

    handleCloseModal(event) {
        this.displayModal= false;
    };

    async handleUpdate(event){
        const data = event.detail;
        const updated= await updateContact({Id: data.Id, FirstName: data.FirstName, LastName: data.LastName, Email: data.Email, Phone: data.Phone});
        console.log("updated:", updated);
        this.displayModal =false;
        this.lstContacts = this.lstContacts.map(contact => {
            if(contact.Id == updated.Id){
                return updated;
            }
            return contact;
        });
        //this.lstContacts = [...this.lstContacts, created];
        }

    async handleCreate(event){
        const data = event.detail;
        try {
            const created= await createContact({FirstName: data.FirstName, LastName: data.LastName, Email: data.Email, Phone: data.Phone});
            console.log("created:", created);
            this.displayModal =false;
            this.isCreateContact =false;
            this.lstContacts = [...this.lstContacts, created];
        } catch(e){
            console.log(e)
        }
        }


    async handleDelete (deletedId){
        try{
            const objectIndex = this.lstContacts.findIndex((item)=>item.Id == deletedId)
            await deleteContact({contactId: deletedId});
            this.deleteId(deletedId)
        }
        catch(error){
            console.error(error);
        }
    } 

    deleteId(Id){
        const data2 = this.lstContacts.filter(record => record.Id != Id);
        this.lstContacts = data2;
    }

}
