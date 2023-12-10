
const searchItem = document.createElement("div");
searchItem.classList.add('search-item');
const repos = document.querySelector('.repos');
const wrapper = document.querySelector('.wrapper');
const results = document.querySelector('.results');
const input = document.querySelector('.input');

function debounce(func, delay) {
    let timerId;

    return function() {
        const context = this;
        const args = arguments;

        clearTimeout(timerId);

        timerId = setTimeout(function() {
            func.apply(context, args);
        }, delay);
    };
}

function appendReposItem (name, owner, stars) {
    const reposItem = document.createElement("div");
    reposItem.classList.add('repos-item');
    reposItem.dataset.name = name ?? '';
    reposItem.innerHTML = `<div><p>Name: <span class="name">${name}</span></p><p>Owner: <span class="owner">${owner}</span></p><p>Stars: <span class="stars">${stars}</span></p></div><div class="close"></div>`;

    if (repos.querySelector(`[data-name="${name}"]`)) {
        return;
    }

    repos.append(reposItem);
}

function appendSearchItem (name, owner, stars) {
    const resultsItem = document.createElement("div");
    resultsItem.classList.add('search-item');
    resultsItem.innerHTML = `${name}`;
    resultsItem.dataset.name = name ?? '';
    resultsItem.dataset.owner = owner?.login ?? '';
    resultsItem.dataset.stars = stars ?? '';
    results.append(resultsItem);
}

function clearSearchItems () {
    results.innerHTML = '';
}

function clearReposItems () {
    repos.innerHTML = '';
}

function clearSearchInput () {
    input.value = '';
}

function clearAll () {
    results.querySelectorAll('.search-item').forEach((e) => {
        e.classList.remove('active');
    })
}

async function fetchGithub () {
    try {
        let text = input.value;
        if (!text.length) {
            return;
        }
        const queryString = 'q=' + encodeURIComponent(text) + '&per_page=5';
        let response = await fetch('https://api.github.com/search/repositories?' + queryString, {
            headers: {
                Accept: "application/vnd.github+json",
                //Authorization: "Bearer <YOUR-TOKEN>",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
        let {items} = await response.json();
        if(!Array.isArray(items)) {
            return;
        }
        console.log(items)
        clearSearchItems();
        items.forEach(({name, owner, stargazers_count}) => {
            // console.log();
            appendSearchItem (name, owner, stargazers_count);
        })
    }
    catch (error) {
        console.log(error);
    }
}

const debouncedFetchGithub =  debounce(fetchGithub, 300);
input.addEventListener('input', (e) => {

    debouncedFetchGithub();
})

wrapper.addEventListener('click', (e) => {
    const { target } = e;
    if (!target.matches('.search-item')) {
        return;
    }
    clearAll();
    target.classList.add('active');

    appendReposItem(target.dataset.name, target.dataset.owner, target.dataset.stars);
})

wrapper.addEventListener('click', (e) => {
    const { target } = e;
    if (!target.matches('.close')) {
        return;
    }
    let elt = target.closest('.repos-item');
    elt.remove();
})

