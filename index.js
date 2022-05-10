const restaurantData = [
    {
        id: 1,
        name: 'Dominos',
        img: '',
        rating: 4.6,
        eta: 25,
        tags: ['American'],
        location: 'kadubeesanahalli'
    },
    {
        id: 2,
        name: 'Mc Donalds',
        img: '',
        rating: 4.8,
        eta: 15,
        tags: ['American', 'Italian'],
        location: 'Bellandur'
    },
    {
        id: 3,
        name: 'Madurai Meenakshi',
        img: '',
        rating: 4.7,
        eta: 10,
        tags: ['South Indian'],
        location: 'Bellandur'
    },
    {
        id: 4,
        name: 'Adyar Anantha Bhavan',
        img: '',
        rating: 5,
        eta: 40,
        tags: ['South Indian'],
        location: 'Marathahalli'
    },
    {
        id: 5,
        name: 'Chianti',
        img: '',
        rating: 4.9,
        eta: 30,
        tags: ['Italian', 'North Indian'],
        location: 'Sarjapur'
    },
    {
        id: 6,
        name: 'Nasi and Me',
        img: '',
        rating: 4.7,
        eta: 25,
        tags: ['American', 'Italian'],
        location: 'Bellandur'
    },
    {
        id: 7,
        name: 'Thalaserry',
        img: '',
        rating: 4.2,
        eta: 10,
        tags: ['North Indian', 'South Indian'],
        location: 'Bellandur'
    }
]

let filteredData = restaurantData;
let filtersApplied = ['American', 'Italian', 'North Indian', 'South Indian'];

const getData = () => {
 return filteredData;
}

const getCard = (restaurant) => {
    const getFavouriteRestaurants = getFavourites();
    if (restaurant) {
        const card = `<div class="restaurant-card">
            <div class="bookmark 
                ${getFavouriteRestaurants.includes(restaurant.id.toString()) ? 'marked': 'unmarked'}"
                id="${restaurant.id}">
            </div>
            <div>${restaurant.name}</div>
            <div>${restaurant.rating}</div>
            <div>${restaurant.location}</div>
            <div>${restaurant.eta}</div>
            <div>${restaurant.tags.join(', ')}</div>
        </div>`
        return card;
    } else {
        const card = `<div class="restaurant-card dummy-card">
           
        </div>`
        return card;
    }
    
}

const renderCardContainer = (data) => {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';
    const dummyCards = 4 - (data.length % 4);
    data.forEach(d => {
        const card = getCard(d);
        cardContainer.innerHTML += card;
    });
    for(let i=0; i<dummyCards; i++) {
        const card = getCard();
        cardContainer.innerHTML += card;
    }
}

const getFilterElement = (tag) => {
    const filterCheckbox = `<input type="checkbox" name="${tag}" value="${tag}" checked>
    <label for="${tag}">${tag}</label>`;
    return filterCheckbox;
}

const renderFilters = (tags) => {
    const filterContainer = document.querySelector('.filter-container');
    tags.forEach(tag => {
        filterContainer.innerHTML += getFilterElement(tag)
    });
}

const renderView = (data) => {
    const container = document.querySelector('.container');
    renderCardContainer(data);
    addSearchListener();
    addSortListener();
    addMarkFavouriteListener();
    renderFilters(getTags());
    addCheckboxListener();
    
}

const getTags = () => {
    return restaurantData.reduce((acc, data) => {
        data.tags.forEach(tag => {
            if (!acc.includes(tag)) {
                acc.push(tag);
            }
        });
        return acc;
    }, []);
}

const addSearchListener = () => {
    const searchBox = document.querySelector('.search-box');
    searchBox.addEventListener('keypress', _.debounce(searchRestaurants, 300));
}

const addSortListener = () => {
    document.querySelector('.sort-by').addEventListener('change', function (ev) {
        sortBy(ev.target.value);
    })
}

const addMarkFavouriteListener = () => {
    document.querySelector('.card-container').addEventListener('click', function (ev) {
        if (ev.target.className.includes('bookmark')) {
            markFavourite(ev.target.id, ev.target);
        }
    });
    document.querySelector('#filter-fav').addEventListener('click', filterFavourites);
}

const addCheckboxListener = () => {
    const filterCheckbox = document.querySelector('.filter-container');
    filterCheckbox.addEventListener('change', function(ev) {
        if (ev.target.type === 'checkbox') {
            const filter = ev.target.value;
            if (ev.target.checked) {
                filtersApplied.push(filter);
            } else {
                filtersApplied = filtersApplied.filter(fl => fl !== filter);
            }
            filterRestaurants(filtersApplied);
        }
    });
}

const searchRestaurants = () => {
    const query = document.querySelector('.search-box').value;
    let searchResults;
    if (query) {
        searchResults = filteredData.filter(restaurant => {
            return restaurant.name.toLowerCase().includes(query.toLowerCase());
        });
    } else {
        searchResults = restaurantData;
    }
    filteredData = searchResults;
    renderCardContainer(searchResults);
}

const sortBy = (label) => {
    const sortedResults = _.sortBy(filteredData, label);
    renderCardContainer(sortedResults);
}

const filterBy = (label, appliedFilters) => {
    return restaurantData.filter(r => {
        if (label === 'tags') {
            return _.intersection(r.tags, appliedFilters).length;
        } else if (label === 'fav') {
            return getFavourites().includes(r.id.toString());
        }
    });
}

const filterRestaurants = (appliedFilters) => {
    const results = filterBy('tags', appliedFilters);
    filteredData = results;
    renderCardContainer(results);
}

const markFavourite = (restaurantId, targetEl) => {
    const exisitingFavouriteRestaurants = getFavourites();
    if(exisitingFavouriteRestaurants.includes(restaurantId)) {
        removeFavourite(restaurantId);
        targetEl.className = 'bookmark unmarked'
    } else {
        addFavourite(restaurantId);
        targetEl.className = 'bookmark marked'
    }
}

const getFavourites = () => {
    return JSON.parse(localStorage.getItem('favouriteRestaurants')) || [];
}

const addFavourite = (restaurantId) => {
    const favourites = getFavourites();
    favourites.push(restaurantId);
    localStorage.setItem('favouriteRestaurants', JSON.stringify(favourites));
}

const removeFavourite = (restaurantId) => {
    const favourites = getFavourites();
    const updatedFavourites = favourites.filter(favourite => favourite !== restaurantId);
    localStorage.setItem('favouriteRestaurants', JSON.stringify(updatedFavourites));
}

const filterFavourites = () => {
    renderCardContainer(filterBy('fav'));
}

renderView(getData());