package com.skydesk.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.skydesk.app.network.SignalingClient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onBack: () -> Unit) {
    var serverUrl by remember { mutableStateOf(SignalingClient.serverUrl) }
    var editingServer by remember { mutableStateOf(false) }
    var notificationsEnabled by remember { mutableStateOf(true) }
    var autoConnectEnabled by remember { mutableStateOf(false) }
    var unattendedAccessEnabled by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item { Spacer(Modifier.height(4.dp)) }

            // ── Network ──────────────────────────────────────────────────────
            item { SettingsSectionHeader("Network") }
            item {
                SettingsCard {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Signaling Server", fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface)
                        if (editingServer) {
                            OutlinedTextField(
                                value = serverUrl,
                                onValueChange = { serverUrl = it },
                                modifier = Modifier.fillMaxWidth(),
                                label = { Text("Server URL") },
                                placeholder = { Text("http://10.0.2.2:4000") },
                                singleLine = true,
                                shape = RoundedCornerShape(8.dp)
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = {
                                        SignalingClient.serverUrl = serverUrl
                                        editingServer = false
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B4FF)),
                                    modifier = Modifier.weight(1f)
                                ) { Text("Save & Reconnect") }
                                OutlinedButton(
                                    onClick = {
                                        serverUrl = SignalingClient.serverUrl
                                        editingServer = false
                                    },
                                    modifier = Modifier.weight(1f)
                                ) { Text("Cancel") }
                            }
                        } else {
                            Row(
                                Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(SignalingClient.serverUrl, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                TextButton(onClick = { editingServer = true }) { Text("Edit") }
                            }
                        }

                        Text(
                            "Emulator: http://10.0.2.2:4000\nReal phone: http://<PC-LAN-IP>:4000",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // ── Access ───────────────────────────────────────────────────────
            item { SettingsSectionHeader("Access") }
            item {
                SettingsCard {
                    Column {
                        SettingsToggleRow(
                            icon = Icons.Default.Notifications,
                            title = "Connection Notifications",
                            subtitle = "Notify when someone requests access",
                            checked = notificationsEnabled,
                            onToggle = { notificationsEnabled = it }
                        )
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        SettingsToggleRow(
                            icon = Icons.Default.LockOpen,
                            title = "Unattended Access",
                            subtitle = "Allow connections without approval",
                            checked = unattendedAccessEnabled,
                            onToggle = { unattendedAccessEnabled = it }
                        )
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        SettingsToggleRow(
                            icon = Icons.Default.Autorenew,
                            title = "Auto-Reconnect",
                            subtitle = "Reconnect to last session on start",
                            checked = autoConnectEnabled,
                            onToggle = { autoConnectEnabled = it }
                        )
                    }
                }
            }

            // ── About ────────────────────────────────────────────────────────
            item { SettingsSectionHeader("About") }
            item {
                SettingsCard {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        SettingsInfoRow("App", "SkyDesk")
                        SettingsInfoRow("Version", "1.0.0")
                        SettingsInfoRow("Protocol", "Socket.IO / WebRTC")
                        SettingsInfoRow("Server Port", "4000")
                    }
                }
            }

            item { Spacer(Modifier.height(24.dp)) }
        }
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        title.uppercase(),
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        color = MaterialTheme.colorScheme.primary,
        letterSpacing = 1.5.sp,
        modifier = Modifier.padding(horizontal = 4.dp, vertical = 4.dp)
    )
}

@Composable
fun SettingsCard(content: @Composable () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) { content() }
}

@Composable
fun SettingsToggleRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    onToggle: (Boolean) -> Unit
) {
    Row(
        Modifier.fillMaxWidth().padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(22.dp))
        Column(Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface, fontSize = 14.sp)
            Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(
            checked = checked,
            onCheckedChange = onToggle,
            colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = Color(0xFF00B4FF))
        )
    }
}

@Composable
fun SettingsInfoRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
        Text(value, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface, fontSize = 13.sp)
    }
}
