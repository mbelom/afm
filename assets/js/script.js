var selectors = {};
var classes = {};
var data = {};

// DOM REFERENCES START VVV----------------------------------------------------------------VVV

// queryFormEl is the entire form element
var queryFormEl = document.querySelector("#query-form");
// queryInputEl is the text input
var queryInputEl = document.querySelector("#query-input");
// LAYOUT: selector to create div where movie search results will be displayed
var movieContainerEl = document.querySelector("#movies-container");
// selector for movie search term
var movieSearchTerm = document.querySelector("#movie-search-term");
// for manipulating any eventual data labels on buttons
var querySearchOption = document.querySelector("#query-search-option");

// DOM REFERENCES END ^^^----------------------------------------------------------------^^^

// FUNCTION SECTION START VVV----------------------------------------------------------------VVV

// step #4:
// Create DOM elements from the JSON data acquired in `getMovieInfo` function
var displayMovies = function (movies, searchTerm) {
	// check if api search returned any results
	if (!movies) {
		movieContainerEl.textContent = "No movies found";
		return;
	}

	movieSearchTerm.textContent = searchTerm;

	// loop over api search results
	for (var i = 0; i < movies.length; i++) {
		// format how movie names are displayed as "TITLE (RELEASE YEAR)"
		// #4 inside the DOM tree
		// var movieTitle = movies[i].title;

		/* SECTION START: CREATE HTML STRUCTURE TO HOLD MOVIE RESULTS IN MATERIALIZE CSS VVV----------------------------------------------------------------VVV */

		// #1 div w/ .card
		var movieCardEl = document.createElement("div");
		movieCardEl.classList = "card small";
		console.log("movieCardEl", movieCardEl); // test

		// #2 div w/ .card-content
		var divClassCardContentEl = document.createElement("div");
		divClassCardContentEl.classList = "card-content";
		console.log("divClassCardContentEl", divClassCardContentEl); // test

		// #3 div w/ movie title
		var spanClassCardTitleEl = document.createElement("span");
		spanClassCardTitleEl.classList = "card-title";
		// #4 movieTitle will be .textContent for #3 spanClassCardTitleEl
		spanClassCardTitleEl.textContent = movies[i].title;
		// #4A to get the year of the movie
		var divClassCardTitleYearEl = document.createElement("span");
		divClassCardTitleYearEl.textContent = ` ${movies[i].description}`;

		console.log("spanClassCardTitleEl", spanClassCardTitleEl.textContent); // test
		console.log("divClassCardTitleYearEl", divClassCardTitleYearEl); // test

		// #3.1 .card-action div for holding card links in Materialize format
		// N.B. need to append *after* appending movieTitle for proper HTML order
		var divClassCardActionEl = document.createElement("div");
		divClassCardActionEl.classList = "card-action";

		// #5A  create imdb links
		var divClassCardActionImdbUrlEl = document.createElement("a");
		// #5B create <a> to nest inside <p>
		divClassCardActionImdbUrlEl.setAttribute("href", "https://www.imdb.com/title/" + movies[i].id + "/fullcredits/?ref_=tt_cl_sm");
		divClassCardActionImdbUrlEl.setAttribute("target", "_blank");
		divClassCardActionImdbUrlEl.textContent = "IMDB link";

		// div.cardImage
		var divClassCardImageEl = document.createElement("div");
		divClassCardImageEl.classList = "card-image";

		// create add button
		var addButton = document.createElement("a");
		addButton.classList = "btn-floating halfway-fab waves-effect waves-light red";
		var materialIcons = document.createElement("i");
		materialIcons.classList = "material-icons";
		materialIcons.textContent = "add";

		// #6 create movie poster image
		var posterImageEl = document.createElement("img");
		posterImageEl.src = `${movies[i].image}`;
		posterImageEl.classList = "responsive-img materialboxed";
		console.log("posterImageEl", posterImageEl);

		/* SECTION END: CREATE HTML STRUCTURE TO HOLD MOVIE RESULTS IN MATERIALIZE CSS ^^^-----------------------------------------------------------------^^^ */

		/* SECTION START: APPEND TO DOM USING MATERIALIZE CSS FORMAT VVV----------------------------------------------------------------VVV */

		// append poster to div.card
		movieCardEl.appendChild(divClassCardImageEl);
		divClassCardImageEl.appendChild(posterImageEl);
		divClassCardImageEl.appendChild(addButton).appendChild(materialIcons);

		// append #2-4 to div movieCardEl
		movieCardEl.appendChild(divClassCardContentEl);

		// N.B. Need to work inside back out when using `.appendchild`
		// append card-title w/ movie title textContent (#3 & #4) to spanClassCardTitleEl (#2)
		divClassCardContentEl.appendChild(spanClassCardTitleEl);
		spanClassCardTitleEl.appendChild(divClassCardTitleYearEl); // ??? Need to insert a space

		// create HTML for div.card-action anchor tags
		function createImdbLink() {
			var newP = document.createElement("p");
			var imdbURL = document.createTextNode(divClassCardActionImdbUrlEl);
			divClassCardActionImdbUrlEl.textContent;
			newP.appendChild(imdbURL);
		}
		// append links to div.card-action
		divClassCardActionEl.appendChild(divClassCardActionImdbUrlEl);

		// append div.card-action to div.card-content so it's a sibling of span.card-title
		divClassCardContentEl.appendChild(divClassCardActionEl);

		// append movieCardEl to movieContainerEl
		movieContainerEl.appendChild(movieCardEl);
	}
};

/* SECTION END: APPEND TO DOM USING MATERIALIZE CSS FORMAT ^^^----------------------------------------------------------------^^^ */

/* step #2:
	- activated by `addEventListener` triggered when there's a "submit" anywhere on the form element
	Steps this function takes:
		- `preventDefault()` to page refresh
		- Takes string entered into form & trims extra spaces 
		- make sure it's valid
		- and send it to `getMovieInfo` for fetch request.     
		- N.B. e = "event"
 */

var formSubmitHandler = function (e) {
	// prevent page refresh
	e.preventDefault();

	// get value from movie search input element
	var query = queryInputEl.value.trim();

	if (query) {
		getMovieInfo(query);
		console.log("getMovieInfo(query) = ", query);
		// clear old content
		queryInputEl.value = "";
		// movieContainerEl.textContent = ""; // ??? add back in once this section is ready
	} else {
		alert("Please enter a search term"); // ??? Not allowed to use alerts? Make it add this message to the DOM?
	}
	return query;
};

/* step #3: 
- `formSubmitHandler` sends search query as parameter to `getMovieInfo` here.
- this uses API `fetch` request to get movie titles w/ related data as JSON
- N.B. on lines 80 & 82, they're parameters, but the function call `displayMovies` has arguments 
- sends it to step #4 `displayMovies` 
*/
var getMovieInfo = function (x) {
	// format the api url -- ??? test the optional chaining by intentionally goofing up the url
	var apiUrl = "https://imdb-api.com/en/API/SearchMovie/k_vm8gj4hz/" + x;

	// make a `get` request to url
	fetch(apiUrl).then(function (response) {
		// request was successful
		if (response.ok) {
			response.json().then(function (data) {
				console.log("api data = ", data);
				// question mark = "optional chain" ???
				displayMovies(data?.results, x); // Gotta get the locally scoped variable `query` into this function
			});
		} else {
			alert("Unable to connect to Open Movie Database"); // ??? Not allowed to use `alerts` in this project?
		}
	});
};

// FUNCTION SECTION END ^^^----------------------------------------------------------------^^^

// EVENT LISTENERS START: event listeners for form & button container VVV----------------------------------------------------------------VVV
// step #1: when button is clicked, search term is submitted, and the text is sent to `formSubmitHandler
queryFormEl.addEventListener("submit", formSubmitHandler);
// EVENT LISTENERS END ^^^----------------------------------------------------------------^^^
