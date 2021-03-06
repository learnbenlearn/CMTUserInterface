/**
 * @description       : Class implementing the Metadata.DeployCallback interface for use in methods
 *                      in CmtUiService that perform operations on custom metadata records.
 * @author            : Ben Learn
 * @group             : 
 * @last modified on  : 03-29-2022
 * @last modified by  : Ben Learn
**/
public class CmtDeploymentCallback implements Metadata.DeployCallback {
    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) {
        CMT_Deploy_Event__e cmtDeployEvent = new CMT_Deploy_Event__e();

        if(result.status == Metadata.DeployStatus.SUCCEEDED) {
            cmtDeployEvent.Successfully_Deployed__c = true;
        } else {
            cmtDeployEvent.Successfully_Deployed__c = false;
            cmtDeployEvent.Error_Message__c = result.errorStatusCode + ': ' + result.errorMessage;
        }

        EventBus.publish(cmtDeployEvent);
    }
}
