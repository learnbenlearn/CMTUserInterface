/**
 * @description       : Wrapper for custom metadata type records and custom fields to encapsulate
 *                      data returned by CmtUiService.getCMTRecordsSingleCall().
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 04-15-2022
 * @last modified by  : Ben Learn
**/
public with sharing class CmtDataWrapper {
    @AuraEnabled
    public List<sObject> cmtRecords;
    
    @AuraEnabled
    public List<String> cmtCustomFields;

    public CmtDataWrapper(List<sObject> cmtRecords, List<String> cmtCustomFields) {
        this.cmtRecords = cmtRecords;
        this.cmtCustomFields = cmtCustomFields;
    }
}
