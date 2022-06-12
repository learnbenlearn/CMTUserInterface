// Write your anonymous apex in this file and run the Execute Anonymous Apex command to run the code from your org.
Metadata.CustomMetadata customMetadata = new Metadata.CustomMetadata();
customMetadata.label = 'test';
customMetadata.fullName = 'Example_CMT__mdt.Example';

Metadata.DeployContainer deployContainer = new Metadata.DeployContainer();
deployContainer.addMetadata(customMetadata);

Metadata.Operations.enqueueDeployment()


public class MyCallback implements Metadata.DeployCallback {
    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) {
        System.debug()
        detaiils
        errorCode
        messages
        numberComponentError@TestSetup
        static void rollbackOnError
        stateDetail
        status
        success (){
            
        }
    }
}