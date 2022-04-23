/**
 * @description       : Wrapper for custom metadata type records and custom fields to encapsulate
 *                      data returned by CmtUiService.getCMTRecordsSingleCall().
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 04-23-2022
 * @last modified by  : Ben Learn
**/
public with sharing class CmtDataWrapper {
    @AuraEnabled
    public Map<String, sObject> cmtNameRecordMap;
    
    @AuraEnabled
    public List<String> cmtCustomFields;

    public CmtDataWrapper(Map<String, sObject> cmtNameRecordMap, List<String> cmtCustomFields) {
        this.cmtNameRecordMap = cmtNameRecordMap;
        this.cmtCustomFields = cmtCustomFields;
    }
}
