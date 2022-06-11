var getUserRepos = function(user) {
    // FORMAT GITHUB API URL
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // MAKE A REQUEST TO THE URL
    fetch(apiUrl)
    .then(function(response) {
       if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
       } else {
        alert("Error: GitHub user not found");
       }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
};

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // GET VALUE FROM INPUT ELEMENT
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm) {
    // CHECK IF API RETURNED ANY REPOS
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    // LOOP OVER REPOS
    for (var i = 0; i < repos.length; i++) {
        // FORMAT REPO NAME
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // CREATE A CONTAINER FOR EACH REPO
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // CREATE SPAN ELEMENT TO HOLD REPOSITORY NAME
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // APPEND TO CONTAINER
        repoEl.appendChild(titleEl);

        // CREATE A STATUS ELEMENT
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // CHECK IF CURRENT REPO HAS ISSUES OR NOT
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // APPEND TO CONTAINER
        repoEl.appendChild(statusEl);

        // APPEND CONTAINER TO THE DOM
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);