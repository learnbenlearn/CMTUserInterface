import { LightningElement, api } from 'lwc';

export default class CmtRecordsSidebar extends LightningElement {
    displaySidebar;
    @api labelKeyName;
    options;
    @api valueKeyName;

    get sidebarOptions() {
        return this.options;
    }

    @api set sidebarOptions(value) {
        if(value) {
            this.options = [];
            for(let sidebarOption in value) {
                this.options.push({
                    'label': value[sidebarOption][this.labelKeyName],
                    'value': value[sidebarOption][this.valueKeyName]
                });
            }

            this.displaySidebar = true;
        }
    }

    handleSelect(event) {
        const selectedOptionValue = event.detail.name;
        const optionSelectedEvent = new CustomEvent('optionselected', {
            detail: selectedOptionValue
        });
        this.dispatchEvent(optionSelectedEvent);
    }
}