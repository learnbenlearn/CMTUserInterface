/**
 * @description       : Wrapper for custom metadata type records and describe information to encapsulate data for cmtUiContainer.
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 05-29-2022
 * @last modified by  : Ben Learn
**/
public with sharing class CustomMetadataTypeWrapper {
    @AuraEnabled
    public Map<String, sObject> recordMap;
    
    @AuraEnabled
    public List<Map<String, Object>> customFieldDescribeResults;

    public CustomMetadataTypeWrapper(Map<String, sObject> recordMap, List<Map<String, Object>> customFieldDescribeResults) {
        this.recordMap = recordMap;
        this.customFieldDescribeResults = customFieldDescribeResults;
    }
}
