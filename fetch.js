
const searchItem = document.createElement("div");
searchItem.classList.add('search-item');
const repos = document.querySelector('.repos');
const search = document.querySelector('.search');
const results = document.querySelector('.results');

function appendReposItem (name, owner, stars) {
    const reposItem = document.createElement("div");
    reposItem.classList.add('repos-item');
    reposItem.innerHTML = `<div><p>Name: <span class="name">${name}</span></p><p>Owner: <span class="owner">${owner}</span></p><p>Stars: <span class="stars">${stars}</span></p></div><div class="close"></div>`;
    repos.append(reposItem);
}

function appendSearchItem (name) {
    const resultsItem = document.createElement("div");
    resultsItem.classList.add('search-item');
    resultsItem.innerHTML = `${name}`;
    results.append(resultsItem);
}

function clearSearchItems () {
    results.innerHTML = '';
}

function clearReposItems () {
    repos.innerHTML = '';
}
