import { LightningElement, api } from 'lwc';

export default class CmtRecordsSidebar extends LightningElement {
    _cmtRecordsByName;
    cmtRecordNameLabelMap;
    displaySidebar;

    get cmtRecordsByName() {
        return this._cmtRecordsByName;
    }

    @api set cmtRecordsByName(value) {
        if(value) {
            this._cmtRecordsByName = value;
            this.cmtRecordNameLabelMap = [];

            for(let cmtRecordName in this._cmtRecordsByName) {
                this.cmtRecordNameLabelMap.push({
                    'developerName': cmtRecordName,
                    'label': this._cmtRecordsByName[cmtRecordName].MasterLabel
                });
            }

            this.displaySidebar = true;
        }
    }

    handleSelect(event) {
        const selectedCmtRecordName = event.detail.name;
        const recordSelectedEvent = new CustomEvent('recordselected', {
            detail: selectedCmtRecordName
        });
        this.dispatchEvent(recordSelectedEvent);
    }
}