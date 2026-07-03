package com.skydesk.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.skydesk.app.ui.screens.HomeScreen
import com.skydesk.app.ui.screens.SessionScreen
import com.skydesk.app.ui.screens.SettingsScreen
import com.skydesk.app.ui.theme.SkyDeskTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SkyDeskTheme {
                SkyDeskApp()
            }
        }
    }
}

@Composable
fun SkyDeskApp() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onConnectClick = { remoteId ->
                    navController.navigate("session/$remoteId")
                },
                onSettingsClick = {
                    navController.navigate("settings")
                }
            )
        }
        composable("session/{remoteId}") { backStack ->
            val remoteId = backStack.arguments?.getString("remoteId") ?: ""
            SessionScreen(
                remoteId = remoteId,
                onBack = { navController.popBackStack() }
            )
        }
        composable("settings") {
            SettingsScreen(onBack = { navController.popBackStack() })
        }
    }
}
