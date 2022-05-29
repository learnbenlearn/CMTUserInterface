import { LightningElement, api } from 'lwc';

export default class RecordFormField extends LightningElement {
    @api customField;
    comboboxComponent;
    inputComponent;
    inputRichTextComponent;
    numberInputComponent;
    @api readOnly;

    connectedCallback() {
        switch(this.customField.componentType) {
            case 'Input':
                if(this.customField.formatter) {
                    this.numberInputComponent = true;
                } else {
                    this.inputComponent = true;
                }
                break;

            case 'Combobox':
                this.comboboxComponent = true;
                break;
            case 'Input Rich Text':
                this.inputRichTextComponent = true;
        }
    }

    handleChange(event) {

    }
}