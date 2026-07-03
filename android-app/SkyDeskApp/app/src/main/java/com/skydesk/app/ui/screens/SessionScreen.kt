package com.skydesk.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.skydesk.app.network.SignalingClient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SessionScreen(
    remoteId: String,
    onBack: () -> Unit
) {
    val connected by SignalingClient.connected.collectAsState()
    val sessionActive by SignalingClient.sessionActive.collectAsState()
    var connectionStatus by remember { mutableStateOf("Connecting to $remoteId...") }
    var showFileTransfer by remember { mutableStateOf(false) }

    LaunchedEffect(sessionActive) {
        connectionStatus = when {
            sessionActive -> "Session active — screen sharing"
            connected -> "Waiting for host to accept..."
            else -> "Connecting to server..."
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Remote Session", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = {
                        SignalingClient.endSession()
                        onBack()
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (sessionActive) {
                        IconButton(onClick = { showFileTransfer = !showFileTransfer }) {
                            Icon(Icons.Default.FolderOpen, contentDescription = "File Transfer", tint = Color(0xFF00B4FF))
                        }
                        IconButton(onClick = {
                            SignalingClient.endSession()
                            onBack()
                        }) {
                            Icon(Icons.Default.CallEnd, contentDescription = "End", tint = Color(0xFFFF5370))
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Remote screen placeholder
            Box(
                Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        Brush.radialGradient(listOf(Color(0xFF0A2040), Color(0xFF050D1A)))
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (sessionActive) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        Icon(
                            Icons.Default.Monitor,
                            contentDescription = null,
                            tint = Color(0xFF00B4FF),
                            modifier = Modifier.size(64.dp)
                        )
                        Text(
                            "Screen share active",
                            color = Color(0xFF00B4FF),
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            "Remote ID: $remoteId",
                            color = Color(0xFF4FC3F7),
                            fontSize = 13.sp
                        )
                        Text(
                            "(WebRTC screen frame would render here)",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 11.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        CircularProgressIndicator(color = Color(0xFF00B4FF), modifier = Modifier.size(48.dp))
                        Text(connectionStatus, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp, textAlign = TextAlign.Center)
                        Text("Remote: $remoteId", color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                    }
                }
            }

            // Session info card
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    SessionStat(label = "Latency", value = if (sessionActive) "24ms" else "—", color = Color(0xFF00E676))
                    Divider(modifier = Modifier.width(1.dp).height(40.dp), color = MaterialTheme.colorScheme.outline)
                    SessionStat(label = "Quality", value = if (sessionActive) "HD" else "—", color = Color(0xFF00B4FF))
                    Divider(modifier = Modifier.width(1.dp).height(40.dp), color = MaterialTheme.colorScheme.outline)
                    SessionStat(label = "Status", value = if (sessionActive) "Active" else "Pending", color = if (sessionActive) Color(0xFF00E676) else Color(0xFFFFD600))
                }
            }

            // File transfer panel
            if (showFileTransfer && sessionActive) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("File Transfer", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                        Text("No files in queue.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Button(
                            onClick = {},
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7C4DFF)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.Upload, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Send File")
                        }
                    }
                }
            }

            // End session button
            if (!sessionActive) {
                OutlinedButton(
                    onClick = {
                        SignalingClient.endSession()
                        onBack()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.horizontalGradient(listOf(Color(0xFFFF5370), Color(0xFFFF1744)))),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Cancel, contentDescription = null, tint = Color(0xFFFF5370))
                    Spacer(Modifier.width(8.dp))
                    Text("Cancel", color = Color(0xFFFF5370))
                }
            }
        }
    }
}

@Composable
fun SessionStat(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontWeight = FontWeight.Bold, color = color, fontSize = 18.sp)
        Text(label, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}
