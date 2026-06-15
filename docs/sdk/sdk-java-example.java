# Java SDK Example

```java
RemoteDeskClient client = new RemoteDeskClient(
    'https://api.remotedesk.io/v1'
);
client.login('user@example.com', 'password');
System.out.println('Desk ID: ' + client.getDeskId());
```
