# Go SDK Example

```go
package main

import (
    'fmt'
    'github.com/remotedesk/sdk-go'
)

func main() {
    client := remotedesk.NewClient(
        'https://api.remotedesk.io/v1',
    )
    client.Login('user@example.com', 'password')
    fmt.Println('Desk ID:', client.GetDeskID())
}
```
