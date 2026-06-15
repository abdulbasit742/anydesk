# Native input safety model

The generated shell keeps native input execution disabled by default through `NoopInputExecutor`. Host-side permission must be enabled per session, emergency stop closes the gate immediately, and each normalized viewer event is validated and rate-limited before execution. Platform executors remain disabled reference shells until reviewed.
