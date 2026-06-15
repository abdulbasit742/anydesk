# RemoteDesk Mobile WebRTC Guide

## iOS Implementation

### Dependencies
```ruby
# Podfile
pod 'GoogleWebRTC'
pod 'Socket.IO-Client-Swift'
```

### Capture Screen (ReplayKit)
```swift
import ReplayKit
import WebRTC

class ScreenCapturer: NSObject, RPScreenRecorderDelegate {
  private let recorder = RPScreenRecorder.shared()
  
  func startCapture() {
    recorder.startCapture { sampleBuffer, bufferType, error in
      guard error == nil else { return }
      // Process sampleBuffer and feed to WebRTC
    }
  }
}
```

### Peer Connection
```swift
let config = RTCConfiguration()
config.iceServers = [
  RTCIceServer(urlStrings: ["stun:stun.remotedesk.io:3478"]),
  RTCIceServer(
    urlStrings: ["turn:turn.remotedesk.io:3478"],
    username: "user",
    credential: "pass"
  )
]

let constraints = RTCMediaConstraints(
  mandatoryConstraints: nil,
  optionalConstraints: nil
)
let peerConnection = factory.peerConnection(
  with: config,
  constraints: constraints,
  delegate: self
)
```

## Android Implementation

### Dependencies
```groovy
// build.gradle
implementation 'org.webrtc:google-webrtc:1.0.x'
implementation ('io.socket:socket.io-client:2.x') {
  exclude group: 'org.json', module: 'json'
}
```

### Capture Screen (MediaProjection)
```kotlin
class ScreenCaptureService : Service() {
  private lateinit var mediaProjection: MediaProjection
  private lateinit var videoSource: VideoSource
  
  fun startCapture(resultCode: Int, data: Intent) {
    val projectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE)
      as MediaProjectionManager
    mediaProjection = projectionManager.getMediaProjection(resultCode, data)
    
    val surfaceTextureHelper = SurfaceTextureHelper.create(
      "CaptureThread",
      eglBase.eglBaseContext
    )
    
    val capturer = ScreenCapturerAndroid(mediaProjection, handler)
    capturer.initialize(surfaceTextureHelper, applicationContext, videoSource.capturerObserver)
    capturer.startCapture(1280, 720, 30)
  }
}
```

### Adaptive Bitrate
```kotlin
// Reduce quality on cellular
val isCellular = connectivityManager.activeNetworkInfo?.type == 
  ConnectivityManager.TYPE_MOBILE

val width = if (isCellular) 640 else 1280
val height = if (isCellular) 360 else 720
val bitrate = if (isCellular) 500_000 else 2_000_000

capturer.startCapture(width, height, 30)
videoSource.adaptOutputFormat(width, height, bitrate)
```
