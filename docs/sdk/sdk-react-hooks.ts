# React Hooks for RemoteDesk SDK

```typescript
export function useRemoteDeskAuth() {
  const [user, setUser] = useState<User | null>(null);
  const login = async (email: string, password: string) => {
    const result = await client.login(email, password);
    setUser(result.user);
  };
  return { user, login };
}

export function useRemoteDeskSession(deskId: string) {
  const [session, setSession] = useState<Session | null>(null);
  // ...
  return { session, connect, disconnect };
}
```
