# TURN Server Deployment Guide

This guide provides instructions for deploying and configuring a TURN (Traversal Using Relays around NAT) server for RemoteDesk. A TURN server is essential for WebRTC connections to work reliably across different network topologies, especially when clients are behind NATs or firewalls.

## Recommended TURN Server Software

We recommend using [coturn](https://github.com/coturn/coturn) as it is a robust, open-source TURN server solution.

## Prerequisites

-   A Linux server (e.g., Ubuntu, CentOS) with a public IP address.
-   Root or sudo access to the server.
-   Ports 3478 (UDP and TCP) and a range of UDP ports (e.g., 49152-65535) open in your firewall.

## Installation (Ubuntu/Debian)

1.  **Update package list:**
    ```bash
    sudo apt update
    ```
2.  **Install coturn:**
    ```bash
    sudo apt install coturn
    ```

## Configuration

Edit the coturn configuration file, typically located at `/etc/coturn/turnserver.conf`.

1.  **Backup the original configuration:**
    ```bash
    sudo cp /etc/coturn/turnserver.conf /etc/coturn/turnserver.conf.bak
    ```
2.  **Edit the configuration file:**
    ```bash
    sudo nano /etc/coturn/turnserver.conf
    ```

    Add or uncomment and modify the following lines:

    ```ini
    # Listening IP addresses (your server's public IP)
    listening-ip=<YOUR_PUBLIC_IP_ADDRESS>
    relay-ip=<YOUR_PUBLIC_IP_ADDRESS>

    # External IP address (if behind NAT, otherwise same as listening-ip)
    external-ip=<YOUR_PUBLIC_IP_ADDRESS>

    # Listening port (default is 3478)
    listening-port=3478

    # Min and Max UDP relay ports
    min-port=49152
    max-port=65535

    # Realm (your domain name)
    realm=remotedesk.com

    # Static user for authentication (replace with strong credentials)
    static-auth-secret=<YOUR_TURN_SECRET>
    # Or use a long-term credential mechanism
    # lt-cred-mech
    # user=username:password

    # Enable verbose logging (optional, for debugging)
    # verbose

    # Enable fingerprint and use-candidate attributes
    fingerprint
    use-auth-secret
    ```

    **Important:** Replace `<YOUR_PUBLIC_IP_ADDRESS>` with your server's actual public IP address and `<YOUR_TURN_SECRET>` with a strong, randomly generated secret.

## Enable and Start coturn

1.  **Enable coturn service:**
    Edit `/etc/default/coturn` and uncomment `TURNSERVER_ENABLED=1`.
    ```bash
    sudo nano /etc/default/coturn
    ```
    Change `TURNSERVER_ENABLED=0` to `TURNSERVER_ENABLED=1`.

2.  **Restart coturn service:**
    ```bash
    sudo systemctl restart coturn
    ```
3.  **Check status:**
    ```bash
    sudo systemctl status coturn
    ```
    Ensure it's running without errors.

## Firewall Configuration

Open the necessary ports in your server's firewall. For `ufw` (Uncomplicated Firewall):

```bash
sudo ufw allow 3478/udp
sudo ufw allow 3478/tcp
sudo ufw allow 49152:65535/udp
sudo ufw reload
```

## Testing

Use a WebRTC Trickle ICE tool (e.g., [https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/)) to test your TURN server. Enter your TURN server URL (e.g., `turn:<YOUR_PUBLIC_IP_ADDRESS>:3478`) and the `static-auth-secret` as the credential. You should see `srflx` and `relay` candidates successfully generated.
