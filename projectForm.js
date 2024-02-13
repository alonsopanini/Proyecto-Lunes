import { LightningElement, api} from 'lwc';

export default class ProjectModal extends LightningElement {
    @api columns=[];
    @api rowFields={};
    @api title = " ";
    @api isCreateContact
    fieldValues=[];
    @api record = {
        Id : null,
        FirstName : '',
        LastName : '',
        Email : '',
        Phone : ''
    };

    dataToUpdate = {};
    dataToInsert = {};

    connectedCallback(){
        this.dataToUpdate = {...this.record};
    }

    handleSave(){
        const saveEvent = new CustomEvent('save',{
            detail: {
                Id : this.dataToUpdate.Id,
                FirstName : this.dataToUpdate.FirstName,
                LastName : this.dataToUpdate.LastName,
                Email : this.dataToUpdate.Email,
                Phone : this.dataToUpdate.Phone
            }
        });
        this.dispatchEvent(saveEvent);
    }

    handleCreate(){
        const insertEvent = new CustomEvent('insert',{
            detail: {
                FirstName : this.dataToUpdate.FirstName,
                LastName : this.dataToUpdate.LastName,
                Email : this.dataToUpdate.Email,
                Phone : this.dataToUpdate.Phone
            }
        });
        this.dispatchEvent(insertEvent);
    }

    handleCancel(){
        const cancelEvent= new CustomEvent('cancel', {});
        this.dispatchEvent(cancelEvent);

    }

    handleFieldChange(event){
        const {name, value} = event.target;
        this.dataToUpdate[name] = value;
    }


}