"use strict";

let state = (function(){
	let listeners = [];

	return {
		date: {},
		addListeners (listener) {
			listeners.push(listener);
		},
		callAllListeners () {
			listeners.forEach(el => {el()})
		}
	}

})();

let request = (news = 'recode') => {
	return fetch(`https://newsapi.org/v1/articles?source=${news}&apiKey=87304c4e5f9249b39a881273a2e00452`)
		.then((responce) => {
			if (responce.ok) {
				return responce.json();
			} else {
				throw new Error(responce.statusText);
			}
		});
};

let formatData = (publishedAt) => {
	let data = new Date(publishedAt);
	let formatter = new Intl.DateTimeFormat("en-US",{
		year: "numeric",
		month: "long",
		day: "numeric"
	});

	return formatter.format(data);
};

let template = (post) => {
	let li = document.createElement('li');
	let title = document.createElement('h1');
	let data = document.createElement('p');
	let author = document.createElement('h2');
	let image = document.createElement('img');
	let text = document.createElement('p');
	let a = document.createElement('a');

	title.innerHTML = post.title;
	author.innerHTML = post.author;
	data.innerHTML = formatData(post.publishedAt);
	image.src = post.urlToImage;
	text.innerHTML = post.description;
	a.setAttribute('href', post.url);
	a.innerHTML = "more";

	li.appendChild(title);
	li.appendChild(author);
	li.appendChild(data);
	li.appendChild(image);
	li.appendChild(text);
	li.appendChild(a);

	return li;
};

let renderController = () => {
	let news = document.getElementById('news');

	while(news && news.firstChild) {
		news.removeChild(news.firstChild)
	}

	state.date.articles.forEach((el) => {news.appendChild(template(el))});

};

let requestController = (source) => {
	let news = request(source);
	news
	.then(data => {
		state.date = data;
		console.log(data);

		state.callAllListeners();
	})
	.catch(error => errorController(error));
	
};

let errorController = (error) => {
	let app = document.getElementById('app');
	let p = document.createElement('p');
	p.innerHTML = error;

	app.appendChild(p);

};

let viewMenu = () => {
	let menu = document.getElementById('menu');
	let list = ['recode','ars-technica','techcrunch','buzzfeed','mtv-news','reuters'];

	list.forEach(el => {
		const li = document.createElement('li');
		li.setAttribute('data',el);
		li.innerHTML = el;
		menu.appendChild(li);
	});

	menu.addEventListener('click',(el) => {
		requestController(el.target.getAttribute('data'));
	});
};


let app = () => {
	state.addListeners(renderController);

	viewMenu();

	requestController();
};

app();