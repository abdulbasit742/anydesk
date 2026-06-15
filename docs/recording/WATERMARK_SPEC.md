# Recording Watermark Specification

## Overview
Watermarks are overlaid on recordings for security and attribution.

## Watermark Content
- Organization name
- Timestamp (ISO 8601)
- Session ID (first 8 chars)
- User ID (hashed)

## Position
- Default: bottom-right corner
- Offset: 20px from edges
- Opacity: 30%

## Style
- Font: system sans-serif, 12px
- Color: white with 50% opacity
- Background: none
- Updates every 60 seconds

## Implementation Notes
- Watermark applied server-side post-processing
- Client-side preview uses canvas overlay
- Configurable per-organization
