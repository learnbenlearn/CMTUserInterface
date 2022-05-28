import { LightningElement, api } from 'lwc';

const INPUT_TYPES = {
    'BOOLEAN': 'checkbox',
    'DATE': 'date',
    'DATETIME': 'datetime',
    'EMAIL': 'email',
    'DOUBLE': 'number',
    'PERCENT': 'percent',
    'PHONE': 'tel',
    'STRING': 'text',
    'URL': 'url'
}

export default class CmtRecordForm extends LightningElement {  
    @api customFieldDescribe;
    fieldInputInfos;
    @api record;
    readOnly = true;

    connectedCallback() {
        this.fieldInputInfos = [];

        for(let customField of this.customFieldDescribe) {
            let fieldInputInfo = {};

            if(Object.keys(INPUT_TYPES).indexOf(customField.DataType) != -1) {
                fieldInputInfo.componentType = 'Input';
                fieldInputInfo.type = INPUT_TYPES[customField.DataType];

                switch(customField.DataType) {
                    case 'DOUBLE':
                        fieldInputInfo.formatter = 'decimal';
                        break;
                    case 'PERCENT':
                        fieldInputInfo.formatter = 'percent';
                        break;
                }

            } else if(customField.DataType === 'PICKLIST') {

            } else if(customField.DataType === 'TEXTAREA') {
                fieldInputInfo.componentType = 'Input Rich Text';
            }

            fieldInputInfo.developerName = customField.DeveloperName;
            fieldInputInfo.label = customField.MasterLabel;
            fieldInputInfo.value = this.record[customField.DeveloperName];
            this.fieldInputInfos.push(fieldInputInfo);

  /*          
Picklist	PICKLIST
            */
        }
        console.log(this.fieldInputInfos);
    }

    handleEdit() {
        this.readOnly = false;
    }
}