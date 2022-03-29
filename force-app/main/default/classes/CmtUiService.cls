/**
 * @description       : 
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 03-26-2022
 * @last modified by  : Ben Learn
**/
public with sharing class CmtUiService {
    @AuraEnabled(cacheable=true)
    public static List<String> getCMTs() {
        List<CMT__mdt> cmts = [SELECT MasterLabel FROM CMT__mdt];

        List<String> cmtNames = new List<String>();

        for(CMT__mdt cmt : cmts) {
            cmtNames.add(cmt.MasterLabel);
        }

        return cmtNames;
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
            if(customMetadataType != 'cmt') {
                Metadata.CustomMetadata cmtInstance = new Metadata.CustomMetadata();
                String cmtPartialName = String.valueOf(sObjectMap.get(customMetadataType));
                cmtPartialName = cmtPartialName.substring(0, cmtPartialName.length() - 5);

                cmtInstance.fullName = 'CMT__mdt.' + cmtPartialName;
                cmtInstance.label = cmtPartialName.replace('_', ' ');
                setupContainer.addMetadata(cmtInstance);
            }
        }

        Metadata.Operations.enqueueDeployment(setupContainer, new CMTDeployCallback());
    }
}
