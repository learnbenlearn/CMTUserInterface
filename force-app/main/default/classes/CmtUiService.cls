/**
 * @description       : 
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 05-21-2022
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
    public static Map<String, CmtDataWrapper> getCMTRecordsSingleCall(List<String> cmts) {
        if(cmts.size() > 100) {
            throw new AuraHandledException('To avoid violating governor limits, this method cannot' +
                ' be called on a list of more than 100 Custom Metadata Types.');
        }

        Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();

        List<Schema.DescribeSObjectResult> cmtDescribes = new List<Schema.DescribeSobjectResult>();

        for(String cmt : cmts) {
            cmtDescribes.add(globalDescribeMap.get(cmt.toLowerCase() + '__mdt').getDescribe());
        }

        Map<String, CmtDataWrapper> cmtRecordMap = new Map<String, CmtDataWrapper>();

        for(Schema.DescribeSObjectResult cmt : cmtDescribes) {
            Map<String, Schema.SObjectField> cmtFields = cmt.fields.getMap();
            List<String> fieldsToQuery = new List<String>();

            Schema.DescribeFieldResult tempFieldResult;

            for(String cmtField : cmtFields.keySet()) {
                tempFieldResult = cmtFields.get(cmtField).getDescribe();

                if(tempFieldResult.isCustom()) {
                    fieldsToQuery.add(tempFieldResult.getName());
                }
            }

            String queryString = 'SELECT MasterLabel, DeveloperName, ' + 
                String.join(fieldsToQuery, ', ') + ' FROM ' + cmt.getName();
            List<sObject> cmtRecords = Database.query(queryString);
            Map<String, sObject> cmtNameRecordMap = new Map<String, sObject>();

            for(sObject cmtRecord : cmtRecords) {
                cmtNameRecordMap.put(String.valueOf(cmtRecord.get('DeveloperName')), cmtRecord);
            }

            CmtDataWrapper tempWrapper = new CmtDataWrapper(cmtNameRecordMap, fieldsToQuery);
            cmtRecordMap.put(cmt.getName(), tempWrapper);
        }
        
        return cmtRecordMap;
    }
}
