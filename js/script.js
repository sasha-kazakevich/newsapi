"use strict";

// application state, aka model
const state = {
  articles: {},
  sources: ['recode','ars-technica','techcrunch','buzzfeed','mtv-news','reuters'],
  currentSource: null
};

// in this case also could be called as app
// manage all parts (data and their representation) of our small application
const controller = {
  init() {
    state.currentSource = state.sources[0];
    
    this.fetchArticles()
      .then(this.setArticles)
      .catch() // handle error
      .then(menuView.init.bind(menuView))
      .then(articlesView.init.bind(articlesView));
  },
  
  fetchArticles() {
    const apiKey = '87304c4e5f9249b39a881273a2e00452';
    const { currentSource: source } = state;
    return fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`)
      .then((responce) => {
        if (!responce.ok) {
          throw new Error(responce.statusText)
        }
        return responce.json()
    })
  },
  
  getArticles() {
    return state.articles
  },
  
  setArticles(articles) {
    state.articles = articles
  },
  
  setCurrentSource(source) {
    state.currentSource = source
  },
  
  getCurrentSource() {
    return state.currentSource
  },
  
  getSources() {
    return state.sources
  }
}

// represent articles (news)
// works only with controller
const articlesView = {
  init() {
    this.$ul = document.getElementById('news');
    
    this.render();
  },

  formatData(publishedAt) {
    const date = new Date(publishedAt);
    const formatter = new Intl.DateTimeFormat("en-US",{
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    return formatter.format(date);
  },

  template(post) {
    const li = document.createElement('li');

    li.innerHTML = `
    <h1>${post.title}</h1>
    <h2>${post.author}</h2>
    <p>${this.formatData(post.publishedAt)}</p>
    <img src=${post.urlToImage}></img>
    <p>${post.description}</p>
    <a href=${post.url}>more</a>
    `

    return li;
  },
  
  render() {
    this.$ul.innerHTML = "";

    controller.getArticles().articles
      .forEach(post => this.$ul.appendChild(this.template(post)));
  }
}

// represent menu (list of sources)
// works only with controller
const menuView = {
  init() {
    this.$ul = document.getElementById('menu');
    this.$ul.addEventListener('click',this.handleMenuItemClick);

    this.render();
  },
  
  handleMenuItemClick(event){
    controller.setCurrentSource(event.target.getAttribute('class'));
    controller.fetchArticles()
      .then(controller.setArticles)
      .catch()
      .then(articlesView.render.bind(articlesView))
  },

  render() {
    controller.getSources().forEach(el => {
      const li = document.createElement('li');
      li.innerHTML = el;
      li.setAttribute('class', el);
      this.$ul.appendChild(li);
    })
  }
}

// run our application
controller.init();