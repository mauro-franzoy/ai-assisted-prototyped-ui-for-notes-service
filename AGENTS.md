# Git Commit Guidelines

Whenever you create a Git commit, always append a `Co-authored-by` trailer at the end of the commit message attributing the commit to your specific agent identity:

```text
Co-authored-by: <Agent Name> <<agent-identifier>>
```

### Examples
- When operating as Antigravity: `Co-authored-by: Antigravity <antigravity@google.com>`
- When operating as another assistant/agent: use that respective agent's name and identifier.

# Testing Guidelines

Whenever you introduce a code change or new feature, always include or update corresponding automated tests if feasible and considered good practice for that specific case. Verify that all tests pass before completing your work.
