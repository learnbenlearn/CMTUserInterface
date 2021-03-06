import { LightningElement, api } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import saveCMT from '@salesforce/apex/CmtUiService.saveCMT';

const INPUT_TYPES = {
    'BOOLEAN': 'checkbox',
    'DATE': 'date',
    'DATETIME': 'datetime',
    'EMAIL': 'email',
    'DOUBLE': 'number',
    'PERCENT': 'number',
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
                customField.type = INPUT_TYPES[customFieldDescribeResult.DataType];

                switch(customFieldDescribeResult.DataType) {
                    case 'DOUBLE':
                        customField.formatter = 'decimal';
                    case 'PERCENT':
                        customField.formatter = customField.formatter ?? 'percent';

                        if(customFieldDescribeResult.DecimalPlaces) {
                            customField.componentType = 'Input Decimal Component';
                            let stepString = '0.';
                            for(let a = 1; a < customFieldDescribeResult.DecimalPlaces; a++) {
                                stepString += '0';
                            }
                            stepString += '1';

                            customField.step = stepString;
                        } else if ((customField.formatter === 'percent') && !customField.step) {
                            customField.componentType = 'Input Decimal Component';
                            customField.step = '0.01';
                        } else {
                            customField.componentType = 'Input Number Component';
                        }
                        break;
                    case 'STRING':
                        customField.componentType = 'Input Text Component';
                        break;
                    case 'PHONE':
                        customField.componentType = 'Input Phone Component';
                        customField.pattern = '\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{4}';
                        customField.messageWhenPatternMismatch = 'Please input a phone number in the format (123) 456-7890.'
                        break;
                    default:
                        customField.componentType = 'Input Component';
                }

            } else if(customFieldDescribeResult.DataType === 'PICKLIST') {
                customField.componentType = 'Combobox';
                customField.options = customFieldDescribeResult.PicklistValues;
            } else if(customFieldDescribeResult.DataType === 'TEXTAREA') {
                customField.componentType = 'Text Area';
            }

            if(customFieldDescribeResult.MaxLength) {
                customField.maxLength = customFieldDescribeResult.MaxLength;
            }

            if(customFieldDescribeResult.DecimalPlaces) {
                customField.decimalPlaces = customFieldDescribeResult.DecimalPlaces;
            }
            
            customField.developerName = customFieldDescribeResult.DeveloperName;
            customField.label = customFieldDescribeResult.MasterLabel;
            customField.value = this.record[customFieldDescribeResult.DeveloperName];
            customField.required = customFieldDescribeResult.Required ?? false;
            this.customFields.push(customField);
        }

        this.displayCustomFields = true;
    }

    handleEdit() {
        this.readOnly = false;
    }

    async handleSave() {
        let fieldComponents = [
            ... this.template.querySelectorAll('lightning-input'), 
            ... this.template.querySelectorAll('c-record-form-field')
        ];

        let invalidFields = [];
        let validFields = [];
        
        for(let fieldComponent of fieldComponents) {
            if(!fieldComponent.checkValidity()) {
                if(fieldComponent.customField) {
                    invalidFields.push(fieldComponent.customField.label);
                } else {
                    invalidFields.push(fieldComponent.label);
                }
            } else {
                if(fieldComponent.customField && fieldComponent.getValue()) {
                    validFields.push(fieldComponent.getValue());
                } else if(!fieldComponent.customField) {
                    validFields.push({
                        field: fieldComponent.name,
                        value: fieldComponent.value
                    })
                }
            }
        }

        if(invalidFields.length > 0) {
            this.fireInvalidToast(this.getInvalidMessageString(invalidFields));
        } else {
            try {
                await saveCMT({fieldValues: validFields});
            } catch(err) {

            }
            // do save things   
        }
        // do something with this.readOnly
    }

    getInvalidMessageString(invalidFields) {
        let invalidMessageString = 'Please fix the ';

        switch(invalidFields.length) {
            case 1:
                invalidMessageString += invalidFields[0] + ' field.';
                break;
            case 2:
                invalidMessageString += invalidFields.join(' and ');
                invalidMessageString += ' fields.';
                break;
            default:
                invalidMessageString = invalidFields.join(', ');
                let lastSpaceIndex = invalidMessageString.lastIndexOf(' ');
                invalidMessageString = invalidMessageString.substring(0, lastSpaceIndex) + ' and ' +
                    invalidMessageString.substring(lastSpaceIndex + 1) + ' fields.';
        }

        return invalidMessageString;
    }

    fireInvalidToast(errorMessage) {
        const showToastEvent = new ShowToastEvent({
            title: 'Record Not Saved',
            message: errorMessage,
            variant: 'error'
        });

        this.dispatchEvent(showToastEvent);
    }

}
