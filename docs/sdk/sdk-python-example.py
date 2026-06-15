# Python SDK Example

```python
from remotedesk import Client

client = Client(
    api_url='https://api.remotedesk.io/v1',
    socket_url='wss://api.remotedesk.io/signaling'
)

client.login('user@example.com', 'password')
print(f'Desk ID: {client.desk_id}')
```
