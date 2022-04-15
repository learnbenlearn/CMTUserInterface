import { LightningElement, api } from 'lwc';

export default class CmtRecordForm extends LightningElement {
    @api cmtCustomFields;
    @api cmtRecord;
}