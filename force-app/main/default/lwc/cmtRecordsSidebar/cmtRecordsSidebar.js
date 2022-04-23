import { LightningElement, api } from 'lwc';

export default class CmtRecordsSidebar extends LightningElement {
    _cmtRecordsByName;
    cmtNameLabelMap;
    displaySidebar;

    get cmtRecordsByName() {
        return this._cmtRecordsByName;
    }

    @api set cmtRecordsByName(value) {
        if(value) {
            this._cmtRecordsByName = value;
            console.log(this._cmtRecordsByName);
            this.cmtNameLabelMap = [];
            for(let cmt of this._cmtRecordsByName) {
                this.cmtNameLabelMap.push({cmt: this._cmtRecordsByName[cmt].MasterLabel});
            }

            this.displaySidebar = true;
            console.log(this.cmtNameLabelMap);
        }
    }
}