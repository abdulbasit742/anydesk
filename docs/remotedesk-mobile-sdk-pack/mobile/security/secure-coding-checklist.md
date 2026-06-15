# Secure Coding Checklist

- [ ] No `console.log` of tokens in production.
- [ ] No `dangerouslySetInnerHTML` equivalent in RN.
- [ ] Validate all deep link params.
- [ ] Sanitize device IDs before display.
- [ ] Use `react-native-keychain` fallback if SecureStore fails.
- [ ] ProGuard/R8 rules keep security classes.
- [ ] Disable debugger in release builds.
- [ ] Certificate pinning config ready (commented).
