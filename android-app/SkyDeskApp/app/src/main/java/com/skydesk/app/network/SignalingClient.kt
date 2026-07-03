package com.skydesk.app.network

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import org.json.JSONObject
import java.net.URI

data class IncomingRequest(
    val fromId: String,
    val sessionId: String
)

object SignalingClient {
    private const val TAG = "SignalingClient"

    // Emulator: 10.0.2.2  |  Real device: use LAN IP of PC
    var serverUrl: String = "http://10.0.2.2:4000"

    private var socket: Socket? = null

    // ── State flows ──────────────────────────────────────────────────────────
    private val _connected = MutableStateFlow(false)
    val connected: StateFlow<Boolean> = _connected

    private val _myDeviceId = MutableStateFlow("")
    val myDeviceId: StateFlow<String> = _myDeviceId

    private val _incomingRequest = MutableStateFlow<IncomingRequest?>(null)
    val incomingRequest: StateFlow<IncomingRequest?> = _incomingRequest

    private val _sessionActive = MutableStateFlow(false)
    val sessionActive: StateFlow<Boolean> = _sessionActive

    // ── Connect ───────────────────────────────────────────────────────────────
    fun connect(deviceId: String) {
        try {
            val opts = IO.Options().apply {
                transports = arrayOf("websocket", "polling")
                reconnection = true
                reconnectionAttempts = 5
                reconnectionDelay = 2000
            }
            socket = IO.socket(URI.create(serverUrl), opts)

            socket?.apply {
                on(Socket.EVENT_CONNECT) {
                    Log.d(TAG, "✅ Socket connected: id=${socket?.id()}")
                    _connected.value = true
                    // Register this device
                    val payload = JSONObject().apply {
                        put("deviceId", deviceId)
                        put("remoteDeskId", deviceId)
                        put("platform", "android")
                        put("version", "1.0.0")
                    }
                    emit("device:register", payload)
                }

                on("device:registered") { args ->
                    val data = args?.getOrNull(0) as? JSONObject
                    val id = data?.optString("deviceId", deviceId) ?: deviceId
                    _myDeviceId.value = id
                    Log.d(TAG, "✅ Registered as: $id")
                }

                on("connect:request") { args ->
                    val data = args?.getOrNull(0) as? JSONObject ?: return@on
                    val fromId = data.optString("fromId", "")
                    val sessionId = data.optString("sessionId", "")
                    Log.d(TAG, "📲 Incoming request from $fromId session=$sessionId")
                    _incomingRequest.value = IncomingRequest(fromId, sessionId)
                }

                on("session:started") { args ->
                    val data = args?.getOrNull(0) as? JSONObject
                    Log.d(TAG, "🎉 Session started: ${data.toString()}")
                    _sessionActive.value = true
                    _incomingRequest.value = null
                }

                on("session:ended") { _ ->
                    Log.d(TAG, "🔴 Session ended")
                    _sessionActive.value = false
                }

                on(Socket.EVENT_DISCONNECT) { args ->
                    Log.d(TAG, "⚠️ Disconnected: ${args?.getOrNull(0)}")
                    _connected.value = false
                    _sessionActive.value = false
                }

                on(Socket.EVENT_CONNECT_ERROR) { args ->
                    Log.e(TAG, "❌ Connection error: ${args?.getOrNull(0)}")
                }

                connect()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Socket init error: ${e.message}", e)
        }
    }

    // ── Connect to remote host ────────────────────────────────────────────────
    fun connectToRemote(remoteId: String) {
        val payload = JSONObject().apply {
            put("targetId", remoteId)
            put("fromId", _myDeviceId.value)
        }
        socket?.emit("connect:request", payload)
        Log.d(TAG, "📡 Emitted connect:request to $remoteId")
    }

    // ── Accept incoming request ───────────────────────────────────────────────
    fun acceptRequest(sessionId: String) {
        val payload = JSONObject().apply {
            put("sessionId", sessionId)
            put("accepted", true)
        }
        socket?.emit("connect:response", payload)
    }

    // ── Reject incoming request ───────────────────────────────────────────────
    fun rejectRequest(sessionId: String) {
        val payload = JSONObject().apply {
            put("sessionId", sessionId)
            put("accepted", false)
        }
        socket?.emit("connect:response", payload)
        _incomingRequest.value = null
    }

    // ── End session ───────────────────────────────────────────────────────────
    fun endSession() {
        socket?.emit("session:end", JSONObject())
        _sessionActive.value = false
    }

    // ── Disconnect ────────────────────────────────────────────────────────────
    fun disconnect() {
        socket?.disconnect()
        socket?.off()
        socket = null
        _connected.value = false
        _sessionActive.value = false
    }

    fun isConnected(): Boolean = socket?.connected() == true
}
