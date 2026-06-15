# WebRTC Quality Monitoring

## Components
- **StatsCollector**: Collects getStats() from RTCPeerConnection
- **BitrateEstimator**: Tracks bitrate trends
- **PacketLossEstimator**: Monitors packet loss severity
- **RttEstimator**: Latency monitoring with jitter
- **FpsEstimator**: Frame rate smoothness detection
- **QualityScorer**: Composite 0-100 quality score
- **QualityDashboard**: React component with charts
- **QualityWarningBanner**: Alert banner for poor quality

## Quality Score Weights
- Packet Loss: 35%
- Bitrate: 25%
- Latency: 25%
- FPS: 15%

## Score Labels
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- 20-39: Poor
- 0-19: Critical
