
const searchItem = document.createElement("div");
searchItem.classList.add('search-item');
const repos = document.querySelector('.repos');
const search = document.querySelector('.search');
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

function clearSearchInput () {
    input.value = '';
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
        items.forEach(({name, owner, stargazers_count}) => {
            appendSearchItem (name);
        })
    }
    catch (error) {
        console.log(error);
    }
}



const debouncedFetchGithub =  debounce(fetchGithub, 300);
input.addEventListener('input', (e) => {
    clearSearchItems ();
    debouncedFetchGithub();
})

