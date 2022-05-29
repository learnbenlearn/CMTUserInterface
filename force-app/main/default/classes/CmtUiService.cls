/**
 * @description       : 
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 05-29-2022
 * @last modified by  : Ben Learn
**/
public with sharing class CmtUiService {
    @AuraEnabled(cacheable=true)
    public static List<CMT__mdt> getCMTs() {
        List<CMT__mdt> cmts = [SELECT MasterLabel, DeveloperName FROM CMT__mdt];

        return cmts;
    }

    @AuraEnabled
    public static void setupCmtUi() {
        Metadata.DeployContainer setupContainer = new Metadata.DeployContainer();

        Map<String, Schema.SObjectType> sObjectMap = Schema.getGlobalDescribe();
        List<String> customMetadataTypes = new List<String>();
        
        for(String sObjectName : sObjectMap.keySet()) {
            if(sObjectName.endsWith('__mdt')) {
                customMetadataTypes.add(sObjectName);
            }
        }
        
        for(String customMetadataType : customMetadataTypes) {
            if(customMetadataType != 'cmt__mdt') {
                Metadata.CustomMetadata cmtInstance = new Metadata.CustomMetadata();
                String cmtPartialName = String.valueOf(sObjectMap.get(customMetadataType));
                cmtPartialName = cmtPartialName.substring(0, cmtPartialName.length() - 5);

                cmtInstance.fullName = 'CMT__mdt.' + cmtPartialName;
                cmtInstance.label = cmtPartialName.replace('_', ' ');
                setupContainer.addMetadata(cmtInstance);
            }
        }

        Metadata.Operations.enqueueDeployment(setupContainer, new CmtDeploymentCallback());
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, CustomMetadataTypeWrapper> getCMTRecordsSingleCall(List<String> cmts) {
        if(cmts.size() > 100) {
            throw new AuraHandledException('To avoid violating governor limits, this method cannot' +
                ' be called on a list of more than 100 Custom Metadata Types.');
        }

        Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();

        List<Schema.DescribeSObjectResult> cmtDescribes = new List<Schema.DescribeSobjectResult>();

        for(String cmt : cmts) {
            cmtDescribes.add(globalDescribeMap.get(cmt.toLowerCase() + '__mdt').getDescribe());
        }

        Map<String, CustomMetadataTypeWrapper> customMetadataTypeInfos = new Map<String, CustomMetadataTypeWrapper>();

        for(Schema.DescribeSObjectResult cmt : cmtDescribes) {
            Map<String, Schema.SObjectField> cmtFields = cmt.fields.getMap();
            List<String> fieldsToQuery = new List<String>();
            List<Map<String, Object>> describeFieldResults = new List<Map<String, Object>>();

            for(String cmtField : cmtFields.keySet()) {
                Schema.DescribeFieldResult tempFieldResult = cmtFields.get(cmtField).getDescribe();

                if(tempFieldResult.isCustom()) {
                    Map<String, Object> describeFieldResult = new Map<String, Object>();
                    describeFieldResult.put('DeveloperName', tempFieldResult.getName());
                    describeFieldResult.put('MasterLabel', tempFieldResult.getLabel());
                    describeFieldResult.put('DataType', String.valueOf(tempFieldResult.getType()));

                    if(String.valueOf(tempFieldResult.getType()) == 'PICKLIST') {
                        List<Map<String, String>> tempPicklistValues = new List<Map<String, String>>();
                        List<Schema.PicklistEntry> picklistEntries = tempFieldResult.getPicklistValues();

                        for(Schema.PicklistEntry picklistEntry : picklistEntries) {
                            if(picklistEntry.isActive()) {
                                Map<String, String> tempPicklistValue = new Map<String, String>();
                                tempPicklistValue.put('label', picklistEntry.getLabel());
                                tempPicklistValue.put('value', picklistEntry.getValue());
                                tempPicklistValues.add(tempPicklistValue);
                            }
                        }

                        describeFieldResult.put('PicklistValues', tempPicklistValues);
                    }

                    describeFieldResults.add(describeFieldResult);
                    fieldsToQuery.add(tempFieldResult.getName());
                }
            }

            String queryString = 'SELECT MasterLabel, DeveloperName, ' + 
                String.join(fieldsToQuery, ', ') + ' FROM ' + cmt.getName();
            List<sObject> records = Database.query(queryString);
            Map<String, sObject> recordMap = new Map<String, sObject>();

            for(sObject record : records) {
                recordMap.put(String.valueOf(record.get('DeveloperName')), record);
            }
            CustomMetadataTypeWrapper tempWrapper = new CustomMetadataTypeWrapper(recordMap, describeFieldResults);
            customMetadataTypeInfos.put(cmt.getName(), tempWrapper);
        }
        
        return customMetadataTypeInfos;
    }
}