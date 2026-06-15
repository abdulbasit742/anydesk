# Contributing to RemoteDesk

## Getting Started
1. Fork the repository
2. Clone your fork
3. Follow [Local Setup](LOCAL_SETUP.md)
4. Create a feature branch

## Development Workflow
```bash
# Create branch
git checkout -b feature/my-feature

# Make changes
# ...

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/my-feature

# Create PR
```

## Commit Message Convention
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### Examples
```
feat(webrtc): add ICE restart flow
fix(connection): handle busy host edge case
docs(api): update error code documentation
test(input): add rate limiter tests
```

## Pull Request Process
1. Ensure tests pass
2. Update documentation
3. Add changelog entry
4. Request review from module owner
5. Address feedback
6. Merge after approval

## Code Review Guidelines
### As Author
- Keep PRs focused and small
- Write clear description
- Link related issues
- Respond to feedback promptly

### As Reviewer
- Be constructive
- Explain reasoning
- Approve when ready
- Don't block unnecessarily

## Reporting Bugs
Use GitHub Issues with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## Feature Requests
- Check existing issues first
- Describe use case
- Explain expected behavior
- Consider implementation approach

## Community
- Discord: discord.gg/remotedesk
- Forum: community.remotedesk.io
- Dev mailing list: dev@remotedesk.io

## License
By contributing, you agree that your contributions will be licensed under the same license as the project.
