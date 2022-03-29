import { LightningElement } from 'lwc';

import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CmtUiSetup extends LightningElement {
    platformEventChannel = '/event/CMT_Deploy_Event__e';
    setDebugFlag = true;
    subscription;
    
    async connectedCallback() {
        let empEnabled = await isEmpEnabled;
        if(empEnabled) {
            this.subscribeToChannel();
            this.registerErrorListener();
        }
    }

    disconnectedCallback() {
        if(this.subscription) {
            unsubscribe(this.subscription, () => {});
        }
    }

    async subscribeToChannel() {
        const messageCallback = (message) => {
            if(message.Successfully_Deployed__c) {
                this.dispatchEvent(new ShowToastEvent({
                    message: 'Retrieving new custom metadata records.',
                    title: 'Success',
                    variant: 'success'
                }));

                const cmtRefreshEvent = new CustomEvent('refreshcmtrecords');
                this.dispatchEvent(cmtRefreshEvent);
            } else {
                this.dispatchEvent(new ShowToastEvent({
                    message: message.Error_Message__c,
                    title: 'Error',
                    variant: 'error'
                }));
            }
        }

        this.subscription = await subscribe(this.platformEventChannel, -1, messageCallback);
    }

    registerErrorListener() {
        onError(error => {
            console.error(error);
        });
    }

    handleCMTSetup() {
        const cmtSetupEvent = new CustomEvent('setupcmtrecords');
        this.dispatchEvent(cmtSetupEvent);
    }
}