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

# Spell Check Guidelines

Whenever you change or add content, always perform a spell check to ensure all text, comments, labels, and documentation are spelled correctly.

# Permission Guidelines

All agents must ask for permission before executing any change to the codebase. This includes but is not limited to:
- Modifying existing code
- Adding new features or functionality
- Updating tests
- Changing configuration files
- Modifying documentation
- Performing web searches
- Executing any command or step

Always seek explicit user approval before making any changes or performing any actions to ensure alignment with project goals and prevent unintended modifications.

