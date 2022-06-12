// Write your anonymous apex in this file and run the Execute Anonymous Apex command to run the code from your org.
Schema.DescribeFieldResult phoneFieldResult = Schema.SObjectType.Example_CMT__mdt.fields.Phone__c;

System.debug(phoneFieldResult.isNillable());
System.debug(phoneFieldResult.isCreateable());
System.debug(phoneFieldResult.isDefaultedOnCreate());
System.debug(!phoneFieldResult.isNillable() && phoneFieldResult.isCreateable() && !phoneFieldResult.isDefaultedOnCreate());