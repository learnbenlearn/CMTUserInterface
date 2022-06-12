import { LightningElement, api } from 'lwc';

export default class RecordFormField extends LightningElement {
    @api customField;
    comboboxComponent;
    componentName;
    inputComponent;
    inputDecimalComponent;
    inputNumberComponent;
    inputPhoneComponent;
    inputTextComponent;
    @api readOnly;
    textAreaComponent;

    connectedCallback() {
        switch(this.customField.componentType) {
            case 'Input Decimal Component':
               this.inputDecimalComponent = true;
               break;
            case 'Input Number Component':
                this.inputNumberComponent = true;
                break;
            case 'Input Text Component':
                this.inputTextComponent = true;
                break;
            case 'Input Phone Component':
                this.inputPhoneComponent = true;
                break;
            case 'Input Component':
                this.inputComponent = true;
                break;
            case 'Combobox':
                this.comboboxComponent = true;
                this.componentName = 'lightning-combobox';
                break;
            case 'Text Area':
                this.textAreaComponent = true;
                this.componentName = 'lightning-textarea';
        }

        this.componentName = this.componentName ?? 'lightning-input';
    }

    handleChange(event) {
        console.log(event.detail.value);
    }

    @api checkValidity() {
        return this.template.querySelector(this.componentName).validity.valid;
    }

    @api getValue() {
        let value = this.template.querySelector(this.componentName).value;

        if(value) {
            let fieldValue = {
                field: this.customField.developerName,
                value: this.template.querySelector(this.componentName).value
            }
    
            return fieldValue;
        }
    }
}