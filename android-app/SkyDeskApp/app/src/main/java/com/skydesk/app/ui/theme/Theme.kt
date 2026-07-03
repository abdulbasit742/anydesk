package com.skydesk.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SkyDeskColors = darkColorScheme(
    primary = Color(0xFF00B4FF),
    onPrimary = Color(0xFF001F2A),
    primaryContainer = Color(0xFF003547),
    onPrimaryContainer = Color(0xFFBAE8FF),
    secondary = Color(0xFF4FC3F7),
    onSecondary = Color(0xFF00344A),
    background = Color(0xFF0A0F1E),
    onBackground = Color(0xFFE0E8F0),
    surface = Color(0xFF0F1626),
    onSurface = Color(0xFFE0E8F0),
    surfaceVariant = Color(0xFF1A2438),
    onSurfaceVariant = Color(0xFFB0BDD0),
    outline = Color(0xFF2A3A54),
    error = Color(0xFFFF5370),
)

@Composable
fun SkyDeskTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SkyDeskColors,
        content = content
    )
}
