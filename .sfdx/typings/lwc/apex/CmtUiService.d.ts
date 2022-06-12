declare module "@salesforce/apex/CmtUiService.getCMTs" {
  export default function getCMTs(): Promise<any>;
}
declare module "@salesforce/apex/CmtUiService.setupCmtUi" {
  export default function setupCmtUi(): Promise<any>;
}
declare module "@salesforce/apex/CmtUiService.getCMTRecordsSingleCall" {
  export default function getCMTRecordsSingleCall(param: {cmts: any}): Promise<any>;
}
declare module "@salesforce/apex/CmtUiService.saveCMT" {
  export default function saveCMT(param: {fieldValues: any}): Promise<any>;
}
