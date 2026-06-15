# Recording Policy

## Overview
Session recording is a feature that allows recording remote desktop sessions
for compliance, training, and audit purposes.

## Privacy Requirements
- Both parties must consent before recording starts
- Recording indicator must be visible during session
- Recordings are encrypted at rest
- Configurable retention period (default: 30 days)
- Watermarking support for security

## Permissions
- Host can initiate recording
- Viewer recording requires host approval
- Either party can stop recording at any time
- Consent can be withdrawn mid-session

## Technical Specs
- Format: WebM (VP9) / MP4
- Default: 720p @ 15fps
- Max duration: 2 hours per session
- Segmented every 10 minutes
- Audio recording optional

## Storage Policy
- Encrypted at rest
- Automatic deletion after retention period
- Downloadable by authorized users
- Audit log of all access

## Compliance
- GDPR: Right to erasure supported
- HIPAA: Audit trail maintained
- SOC2: Access logging enabled
