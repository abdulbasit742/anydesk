# GraphQL Schema (Future)

```graphql
type Session {
  id: ID!
  host: User!
  viewer: User!
  status: SessionStatus!
  startedAt: DateTime!
  endedAt: DateTime
}

type Query {
  session(id: ID!): Session
  sessions(filter: SessionFilter): [Session!]!
}
```
