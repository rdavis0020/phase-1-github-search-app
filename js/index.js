document.addEventListener("DOMContentLoaded", () => {
    const githubForm = document.querySelector("#github-form");
    const userList = document.querySelector("#user-list");
    const reposList = document.querySelector("#repos-list");
    const toggleSearchBtn = document.querySelector("#toggle-search");
    let searchType = "user"; // Default search type
  
    // Toggle search type between user and repo
    toggleSearchBtn.addEventListener("click", () => {
      if (searchType === "user") {
        searchType = "repo";
        toggleSearchBtn.textContent = "Toggle to User Search";
        githubForm.search.placeholder = "Search GitHub repositories";
      } else {
        searchType = "user";
        toggleSearchBtn.textContent = "Toggle to Repo Search";
        githubForm.search.placeholder = "Search GitHub users";
      }
    });
  
    // Handle GitHub form submission
    githubForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const searchQuery = e.target.search.value;
  
      // Clear previous results
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      if (searchType === "user") {
        searchGitHubUsers(searchQuery);
      } else {
        searchGitHubRepos(searchQuery);
      }
    });
  
    // Fetch and display GitHub users
    function searchGitHubUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(data => {
        let usersHTML = data.items.map(user => {
          return `
            <li>
              <h3>${user.login}</h3>
              <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50"/>
              <p><a href="${user.html_url}" target="_blank">View Profile</a></p>
              <button class="view-repos" data-username="${user.login}">View Repos</button>
            </li>
          `;
        }).join('');
        userList.innerHTML = usersHTML;
  
        // Add event listeners to 'View Repos' buttons
        document.querySelectorAll(".view-repos").forEach(button => {
          button.addEventListener("click", (e) => {
            const username = e.target.dataset.username;
            fetchUserRepos(username);
          });
        });
      })
      .catch(error => console.error('Error fetching GitHub users:', error));
    }
  
    // Fetch and display repositories for a user
    function fetchUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(repos => {
        let reposHTML = repos.map(repo => {
          return `
            <li>
              <h3>${repo.name}</h3>
              <p>${repo.description || "No description provided"}</p>
              <p><a href="${repo.html_url}" target="_blank">View Repo</a></p>
            </li>
          `;
        }).join('');
        reposList.innerHTML = reposHTML;
      })
      .catch(error => console.error('Error fetching user repositories:', error));
    }
  
    // Fetch and display GitHub repositories based on search query
    function searchGitHubRepos(query) {
      fetch(`https://api.github.com/search/repositories?q=${query}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(data => {
        let reposHTML = data.items.map(repo => {
          return `
            <li>
              <h3>${repo.name}</h3>
              <p>${repo.description || "No description provided"}</p>
              <p><a href="${repo.html_url}" target="_blank">View Repo</a></p>
            </li>
          `;
        }).join('');
        reposList.innerHTML = reposHTML;
      })
      .catch(error => console.error('Error fetching GitHub repositories:', error));
    }
  });