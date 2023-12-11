
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
    reposItem.innerHTML = `<div><p>Name: <span class="name">${name}</span></p><p>Owner: <span class="owner">${owner}</span></p><p>Stars: <span class="stars">${stars}</span></p></div><button class="close"></button>`;

    if (repos.querySelector(`[data-name="${name}"]`)) {
        return;
    }

    repos.append(reposItem);
}

function appendSearchItem (name, owner, stars) {
    const resultsItem = document.createElement("li");
    resultsItem.classList.add('search-item');
    resultsItem.innerHTML = `${name}`;
    resultsItem.dataset.name = name ?? '';
    resultsItem.dataset.owner = owner?.login ?? '';
    resultsItem.dataset.stars = stars ?? '';
    results.append(resultsItem);
}

function clearSearchItems () {
    results.innerHTML = '';
    input.value = '';
}

function clearReposItems () {
    repos.innerHTML = '';
}

function clearSearchInput () {
    input.value = '';
}

async function fetchGithub () {
    try {
        let text = input.value.trim();
        if (!text.length) {
            clearSearchItems();
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
        }else if (items.length === 0) {
            return;
        }
        clearSearchItems();
        items.forEach(({name, owner, stargazers_count}) => {
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
    clearSearchItems();
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

