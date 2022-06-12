import { LightningElement, api } from 'lwc';

export default class RecordFormField extends LightningElement {
    @api customField;
    comboboxComponent;
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
                break;
            case 'Text Area':
                this.textAreaComponent = true;
        }
    }

    handleChange(event) {
        console.log(event.detail.value);
    }

    @api checkValidity() {
        let componentName;

        if(this.comboboxComponent) {
            componentName = 'lightning-combobox';
        } else if(this.textAreaComponent) {
            componentName = 'lightning-textarea';
        } else {
            componentName = 'lightning-input';
        }

        return this.template.querySelector(componentName).validity.valid;
    }
}