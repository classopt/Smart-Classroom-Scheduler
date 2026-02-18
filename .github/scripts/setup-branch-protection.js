#!/usr/bin/env node

/**
 * Setup Branch Protection Rules
 * This script configures branch protection for the main branch
 */

const { Octokit } = require('@octokit/rest');

async function setupBranchProtection() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  const owner = process.env.GITHUB_REPOSITORY_OWNER || 'classopt';
  const repo = process.env.GITHUB_REPOSITORY_NAME || 'Smart-Classroom-Scheduler';

  try {
    console.log('🔒 Setting up branch protection for main branch...');

    // Get branch protection settings
    const protection = await octokit.rest.repos.updateBranchProtection({
      owner,
      repo,
      branch: 'main',
      required_status_checks: {
        strict: true,
        contexts: [
          'PR Checks and Validation / Frontend Tests',
          'PR Checks and Validation / Backend Tests',
          'PR Checks and Validation / Code Quality Checks',
          'PR Checks and Validation / PR Validation',
          'PR Checks and Validation / Merge Protection'
        ]
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true,
        require_up_to_date_approvals: true,
        require_code_owner_reviews: false
      },
      restrictions: {
        users: [],
        teams: ['maintainers', 'core-team']
      },
      required_conversation_resolution: true,
      require_linear_history: true,
      allow_force_pushes: false,
      allow_deletions: false
    });

    console.log('✅ Branch protection rules configured successfully!');
    console.log('📋 Protection rules:');
    console.log('  - Require PR reviews (1 approval)');
    console.log('  - Dismiss stale reviews');
    console.log('  - Require up-to-date approvals');
    console.log('  - Enforce admin restrictions');
    console.log('  - Require conversation resolution');
    console.log('  - Require linear history');
    console.log('  - Restrict pushes to maintainers/core-team');
    console.log('  - Prevent force pushes');
    console.log('  - Prevent branch deletion');

  } catch (error) {
    console.error('❌ Failed to setup branch protection:', error.message);
    
    if (error.status === 403) {
      console.log('💡 Note: You need admin permissions to set up branch protection');
      console.log('💡 Please run this script as a repository admin or set up branch protection manually in GitHub settings');
    }
    
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupBranchProtection();
}

module.exports = { setupBranchProtection };
