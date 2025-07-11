// GitHub Auto-Sync Script
// This script can be used to automatically sync portfolio data with GitHub

class GitHubSync {
    constructor(repoOwner, repoName, token) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.token = token;
        this.apiBase = 'https://api.github.com';
    }

    async updatePortfolioFile(data) {
        try {
            // Get current file SHA
            const fileUrl = `${this.apiBase}/repos/${this.repoOwner}/${this.repoName}/contents/data/portfolio.json`;
            
            const getCurrentFile = await fetch(fileUrl, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            let sha = null;
            if (getCurrentFile.ok) {
                const currentFile = await getCurrentFile.json();
                sha = currentFile.sha;
            }

            // Update file
            const content = btoa(JSON.stringify(data, null, 2));
            const updatePayload = {
                message: 'Update portfolio data from admin panel',
                content: content,
                ...(sha && { sha })
            };

            const updateResponse = await fetch(fileUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            if (updateResponse.ok) {
                console.log('Portfolio data synced to GitHub successfully!');
                return true;
            } else {
                console.error('Failed to sync to GitHub:', await updateResponse.text());
                return false;
            }
        } catch (error) {
            console.error('GitHub sync error:', error);
            return false;
        }
    }
}

// Usage example:
// const githubSync = new GitHubSync('your-username', 'your-repo', 'your-token');
// githubSync.updatePortfolioFile(portfolioData);

// Export for use in admin panel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubSync;
} else {
    window.GitHubSync = GitHubSync;
}
