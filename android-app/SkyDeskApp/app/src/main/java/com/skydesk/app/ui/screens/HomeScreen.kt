package com.skydesk.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.skydesk.app.network.SignalingClient
import kotlinx.coroutines.launch
import java.util.UUID

data class RecentSession(val id: String, val alias: String, val lastSeen: String, val isFavorite: Boolean)

private val recentSessions = listOf(
    RecentSession("SKY-192837", "Home PC", "Today 08:32", true),
    RecentSession("SKY-748291", "Office Laptop", "Yesterday 14:15", true),
    RecentSession("SKY-003847", "Friend's Mac", "Jun 20, 2026", false),
    RecentSession("SKY-991122", "Dev Server", "Jun 18, 2026", false),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onConnectClick: (String) -> Unit,
    onSettingsClick: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val keyboard = LocalSoftwareKeyboardController.current

    // Unique device ID for this installation
    val deviceId = remember { "SKY-" + UUID.randomUUID().toString().takeLast(6).uppercase() }

    val connected by SignalingClient.connected.collectAsState()
    val myId by SignalingClient.myDeviceId.collectAsState()
    val incomingRequest by SignalingClient.incomingRequest.collectAsState()

    var remoteAddress by remember { mutableStateOf("") }
    var showAccountDialog by remember { mutableStateOf(false) }
    var showFileDialog by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableIntStateOf(0) }

    // Auto-connect to signaling server
    LaunchedEffect(Unit) {
        SignalingClient.connect(deviceId)
    }

    // Incoming request dialog
    if (incomingRequest != null) {
        val req = incomingRequest!!
        AlertDialog(
            onDismissRequest = {},
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            title = {
                Text("Incoming Connection", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            },
            text = {
                Column {
                    Text("Device ID: ${req.fromId}", color = MaterialTheme.colorScheme.onSurface)
                    Text("Wants to connect to your screen.", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
                }
            },
            confirmButton = {
                Button(
                    onClick = { SignalingClient.acceptRequest(req.sessionId) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B4FF))
                ) { Text("Accept") }
            },
            dismissButton = {
                OutlinedButton(onClick = { SignalingClient.rejectRequest(req.sessionId) }) {
                    Text("Reject", color = Color(0xFFFF5370))
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        // SkyDesk logo dot
                        Box(
                            Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Brush.linearGradient(listOf(Color(0xFF00B4FF), Color(0xFF0066CC)))),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Monitor, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                        }
                        Text("SkyDesk", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Color.White)
                    }
                },
                actions = {
                    // Connection status indicator
                    Box(
                        Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(if (connected) Color(0xFF00E676) else Color(0xFFFF5370))
                    )
                    Spacer(Modifier.width(4.dp))
                    IconButton(onClick = { showAccountDialog = true }) {
                        Icon(Icons.Default.Person, contentDescription = "Account", tint = Color.White)
                    }
                    IconButton(onClick = onSettingsClick) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ── Your SkyDesk ID ──────────────────────────────────────────────
            item {
                Spacer(Modifier.height(8.dp))
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .background(
                                Brush.horizontalGradient(
                                    listOf(Color(0xFF001E3C), Color(0xFF003566))
                                )
                            )
                            .padding(20.dp)
                    ) {
                        Column {
                            Text("Your SkyDesk ID", color = Color(0xFF90CAF9), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = if (myId.isNotEmpty()) myId else deviceId,
                                color = Color.White,
                                fontSize = 32.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 3.sp
                            )
                            Spacer(Modifier.height(8.dp))
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Box(
                                    Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(if (connected) Color(0xFF00E676) else Color(0xFFFF5370))
                                )
                                Text(
                                    text = if (connected) "Ready to receive connections" else "Connecting to server...",
                                    color = if (connected) Color(0xFF00E676) else Color(0xFFFF5370),
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                }
            }

            // ── Connect to remote ────────────────────────────────────────────
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Connect to Remote Device", fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface, fontSize = 15.sp)
                        OutlinedTextField(
                            value = remoteAddress,
                            onValueChange = { remoteAddress = it },
                            modifier = Modifier.fillMaxWidth(),
                            placeholder = { Text("Enter SkyDesk ID or address", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp) },
                            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                            trailingIcon = {
                                if (remoteAddress.isNotEmpty()) {
                                    IconButton(onClick = { remoteAddress = "" }) {
                                        Icon(Icons.Default.Close, contentDescription = "Clear", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }
                            },
                            singleLine = true,
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                                unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Go),
                            keyboardActions = KeyboardActions(onGo = {
                                keyboard?.hide()
                                if (remoteAddress.isNotEmpty()) {
                                    coroutineScope.launch { SignalingClient.connectToRemote(remoteAddress.trim()) }
                                    onConnectClick(remoteAddress.trim())
                                }
                            })
                        )
                        Button(
                            onClick = {
                                keyboard?.hide()
                                if (remoteAddress.isNotEmpty()) {
                                    coroutineScope.launch { SignalingClient.connectToRemote(remoteAddress.trim()) }
                                    onConnectClick(remoteAddress.trim())
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            enabled = remoteAddress.isNotEmpty(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B4FF)),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.ConnectWithoutContact, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Connect", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // ── Quick actions ────────────────────────────────────────────────
            item {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    QuickActionCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.FolderOpen,
                        label = "File Transfer",
                        color = Color(0xFF7C4DFF),
                        onClick = { showFileDialog = true }
                    )
                    QuickActionCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.History,
                        label = "Session History",
                        color = Color(0xFF00BFA5),
                        onClick = { selectedTab = 1 }
                    )
                    QuickActionCard(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Wifi,
                        label = "Network",
                        color = Color(0xFFFF6D00),
                        onClick = {}
                    )
                }
            }

            // ── Tabs: Recent / Favorites ─────────────────────────────────────
            item {
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clip(RoundedCornerShape(12.dp))
                ) {
                    Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Recent") })
                    Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Favorites") })
                }
            }

            val displayed = if (selectedTab == 0) recentSessions else recentSessions.filter { it.isFavorite }
            items(displayed) { session ->
                SessionCard(
                    session = session,
                    onClick = {
                        coroutineScope.launch { SignalingClient.connectToRemote(session.id) }
                        onConnectClick(session.id)
                    }
                )
            }

            item { Spacer(Modifier.height(24.dp)) }
        }
    }

    // Account dialog
    if (showAccountDialog) {
        AlertDialog(
            onDismissRequest = { showAccountDialog = false },
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            title = { Text("Account", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Signed in as: demo@skydesk.io", fontSize = 14.sp)
                    Text("Plan: Free", fontSize = 14.sp)
                    Text("Devices: 1 / 3", fontSize = 14.sp)
                }
            },
            confirmButton = {
                TextButton(onClick = { showAccountDialog = false }) { Text("Close") }
            }
        )
    }

    // File transfer dialog
    if (showFileDialog) {
        AlertDialog(
            onDismissRequest = { showFileDialog = false },
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            title = { Text("File Transfer", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("No active session. Connect to a remote device first.", fontSize = 14.sp)
                }
            },
            confirmButton = {
                TextButton(onClick = { showFileDialog = false }) { Text("OK") }
            }
        )
    }
}

@Composable
fun QuickActionCard(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    color: Color,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            Modifier.padding(12.dp).fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = label, tint = color, modifier = Modifier.size(22.dp))
            }
            Text(label, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
    }
}

@Composable
fun SessionCard(session: RecentSession, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(Color(0xFF00B4FF).copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Computer, contentDescription = null, tint = Color(0xFF00B4FF))
            }
            Column(Modifier.weight(1f)) {
                Text(session.alias, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface)
                Text(session.id, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, letterSpacing = 1.sp)
                Text(session.lastSeen, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            if (session.isFavorite) {
                Icon(Icons.Default.Star, contentDescription = "Favorite", tint = Color(0xFFFFD600), modifier = Modifier.size(18.dp))
            }
            Icon(Icons.Default.ChevronRight, contentDescription = "Connect", tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
