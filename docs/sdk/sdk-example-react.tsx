import { useEffect, useState } from "react";
import { RemoteDeskClient } from "@remotedesk/sdk";

export function useRemoteDesk() {
  const [client] = useState(() => new RemoteDeskClient({
    apiUrl: process.env.REACT_APP_API_URL!,
    socketUrl: process.env.REACT_APP_SOCKET_URL!,
  }));
  const [connected, setConnected] = useState(false);
  const [deskId, setDeskId] = useState<string | null>(null);
  
  useEffect(() => {
    return () => client.disconnect();
  }, [client]);
  
  const login = async (email: string, password: string) => {
    const result = await client.login(email, password);
    setDeskId(result.deskId);
    client.connect();
    setConnected(true);
    return result;
  };
  
  return { client, connected, deskId, login };
}
