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
    displayCustomFields;
    customFields;
    @api record;
    readOnly = true;

    get customFieldDescribeResults() {
        return this.customFields;
    }

    @api set customFieldDescribeResults(value) {
        this.customFields = [];

        for(let customFieldDescribeResult of value) {
            let customField = {};

            if(Object.keys(INPUT_TYPES).indexOf(customFieldDescribeResult.DataType) != -1) {
                customField.componentType = 'Input';
                customField.isRichText = false;
                customField.type = INPUT_TYPES[customField.DataType];

                switch(customFieldDescribeResult.DataType) {
                    case 'DOUBLE':
                        customField.formatter = 'decimal';
                        break;
                    case 'PERCENT':
                        customField.formatter = 'percent';
                        break;
                }

            } else if(customFieldDescribeResult.DataType === 'PICKLIST') {
                customField.componentType = 'Combobox';
                customField.isRichText = false;
                customField.options = customFieldDescribeResult.PicklistValues;
            } else if(customFieldDescribeResult.DataType === 'TEXTAREA') {
                customField.componentType = 'Input Rich Text';
                customField.isRichText = true;
            }

            customField.developerName = customFieldDescribeResult.DeveloperName;
            customField.label = customFieldDescribeResult.MasterLabel;
            customField.value = this.record[customFieldDescribeResult.DeveloperName];
            this.customFields.push(customField);
        }

        this.displayCustomFields = true;
    }

    handleEdit() {
        this.readOnly = false;
    }
}