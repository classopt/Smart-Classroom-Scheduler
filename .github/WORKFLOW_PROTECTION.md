# Workflow and Branch Protection Setup

## Overview
This document explains the GitHub workflows and branch protection rules that prevent premature merging of pull requests.

## 🛡️ Branch Protection Rules

### Main Branch Protection
The `main` branch is protected with the following rules:

#### 🔒 **Merge Requirements**
- **Pull Request Reviews**: At least 1 approving review required
- **Up-to-date Approvals**: Reviews must be up-to-date with latest changes
- **Dismiss Stale Reviews**: Automatically dismiss reviews when new commits are pushed
- **Admin Restrictions**: Even admins must follow these rules
- **Linear History**: No merge commits allowed (only fast-forward or squash merges)

#### 🧪 **Required Status Checks**
All of the following checks must pass before merging:

1. **Frontend Tests**
   - Unit tests pass
   - Build succeeds
   - Linting checks pass

2. **Backend Tests**
   - Python tests pass
   - Code quality checks pass

3. **Code Quality Checks**
   - No large files (>5MB)
   - No secrets detected
   - Package audit passes
   - Configuration files validated

4. **PR Validation**
   - PR description ≥ 50 characters
   - PR title follows conventional commit format

5. **Merge Protection**
   - All previous checks passed
   - Ready for merge review

#### 👥 **Push Restrictions**
- Only `maintainers` and `core-team` can push to main
- Force pushes are disabled
- Branch deletion is disabled

## 🔄 GitHub Workflow

### PR Checks and Validation (`.github/workflows/pr-checks.yml`)

This workflow runs on every pull request to the main branch and includes:

#### Jobs:
1. **Frontend Tests** - Runs tests, build, and linting for the frontend
2. **Backend Tests** - Runs tests and quality checks for the backend
3. **Code Quality** - Checks for large files, secrets, and dependencies
4. **PR Validation** - Validates PR title and description format
5. **Merge Protection** - Final check that all requirements are met

#### Triggers:
- Pull request opened
- Pull request synchronized (new commits pushed)
- Pull request reopened

## 🚀 How to Merge a PR

### Step-by-Step Process:

1. **Create Pull Request**
   - Follow conventional commit format for title
   - Provide detailed description (≥50 characters)
   - Link to relevant issues

2. **Wait for Checks**
   - All automated tests must pass
   - Code quality checks must pass
   - PR validation must pass

3. **Code Review**
   - At least one team member must approve
   - Review must be up-to-date with latest changes
   - Address any review comments

4. **Resolve Conflicts**
   - Ensure no merge conflicts
   - Rebase if necessary

5. **Merge**
   - Only after all checks pass
   - Only with required approvals
   - Use squash merge for clean history

## 🛠️ Setup Instructions

### Automatic Setup (Recommended)
```bash
# Install dependencies
npm install @octokit/rest

# Set GitHub token
export GITHUB_TOKEN=your_github_token

# Run setup script
node .github/scripts/setup-branch-protection.js
```

### Manual Setup
1. Go to repository settings
2. Navigate to "Branches"
3. Click "Add rule" for main branch
4. Configure the settings as described above

## 📋 Required Check List

Before a PR can be merged, ensure:

- [ ] All automated tests pass
- [ ] Code quality checks pass
- [ ] No merge conflicts
- [ ] At least 1 approval from team member
- [ ] PR description is detailed
- [ ] PR title follows conventional format
- [ ] All conversations resolved

## 🔧 Troubleshooting

### Common Issues:

1. **"Required status check failed"**
   - Check the Actions tab for failed jobs
   - Fix the failing tests or code quality issues
   - Push new commits to trigger re-run

2. **"PR title format invalid"**
   - Use format: `feat(scope): description`
   - Examples: `feat(frontend): add login page`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **"Branch protection rule violation"**
   - Ensure you have required approvals
   - Check for stale reviews
   - Resolve any merge conflicts

### Emergency Override:
In case of emergency, repository admins can temporarily disable branch protection settings.

## 📞 Support

For questions about the workflow or branch protection:
- Check this documentation first
- Review the GitHub Actions logs
- Contact the maintainers team

---

**Note**: These protections ensure code quality and maintainability of the Smart Classroom Scheduling System.
