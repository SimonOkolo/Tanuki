(()=>{"use strict";var e=function(e,t,n,i){return new(n||(n=Promise))((function(o,r){function c(e){try{a(i.next(e))}catch(e){r(e)}}function s(e){try{a(i.throw(e))}catch(e){r(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,s)}a((i=i.apply(e,t||[])).next())}))};const t="/api";function n(){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/movies`);return(yield e.json()).results}))}function i(){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/recent-episodes`);return(yield e.json()).results}))}function o(n){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/info/${n}`);return yield e.json()}))}function r(){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/genre/list`);return yield e.json()}))}function c(e,t){t.innerHTML="",0!==e.length?e.forEach((e=>{const n=function(e){const t=document.createElement("div");return t.classList.add("anime-card"),t.innerHTML=`\n    <img src="${e.image}" alt="${e.title}" onerror="this.src='https://via.placeholder.com/200x300'">\n    <div class="anime-info">\n      <h3>${e.title}</h3>\n      <p>Type: ${e.subOrDub||"N/A"}</p>\n      <p>Status: ${e.status||"N/A"}</p>\n    </div>\n  `,t.addEventListener("click",(()=>{window.location.href=`animeDetails.html?id=${e.id}`})),t}(e);t.appendChild(n)})):t.innerHTML="<p>No results found.</p>"}class s{constructor(e=[]){this.animeList=e,this.currentIndex=0,this.intervalId=null}init(){return n=this,i=void 0,c=function*(){try{0===this.animeList.length&&(this.animeList=yield function(){return e(this,void 0,void 0,(function*(){const n=yield function(){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/top-airing`);return(yield e.json()).results}))}();return yield Promise.all(n.map((t=>e(this,void 0,void 0,(function*(){const e=yield o(t.id);return Object.assign(Object.assign({},t),{description:e.description})})))))}))}()),this.updateSlide(),this.createDots(),this.startSlideshow()}catch(e){console.error("Error initializing slideshow:",e)}},new((r=void 0)||(r=Promise))((function(e,t){function o(e){try{a(c.next(e))}catch(e){t(e)}}function s(e){try{a(c.throw(e))}catch(e){t(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(o,s)}a((c=c.apply(n,i||[])).next())}));var n,i,r,c}updateSlide(){const e=this.animeList[this.currentIndex],t=document.getElementById("animeImage"),n=document.getElementById("animeTitle"),i=document.getElementById("animeDescription");t&&n&&i&&(t.src=e.image,n.textContent=e.title,i.textContent=e.description||"No description available.")}createDots(){const e=document.getElementById("dotsContainer");e&&(e.innerHTML="",this.animeList.forEach(((t,n)=>{const i=document.createElement("span");i.classList.add("dot"),i.addEventListener("click",(()=>this.showSlide(n))),e.appendChild(i)})),this.updateActiveDot())}showSlide(e){this.currentIndex=e,this.updateSlide(),this.updateActiveDot()}updateActiveDot(){document.querySelectorAll(".dot").forEach(((e,t)=>{e.classList.toggle("active",t===this.currentIndex)}))}nextSlide(){this.currentIndex=(this.currentIndex+1)%this.animeList.length,this.updateSlide(),this.updateActiveDot()}startSlideshow(){this.intervalId=window.setInterval((()=>this.nextSlide()),15e3)}stopSlideshow(){null!==this.intervalId&&clearInterval(this.intervalId)}}function a(){return e=this,t=void 0,a=function*(){const e=document.getElementById("recentAnime"),t=document.getElementById("genresList"),o=document.getElementById("moviesAnime");if(e&&t&&o)try{const[l,u,h]=yield Promise.all([i(),r(),n()]),m=new s;yield m.init(),c(l.slice(0,12),e),a=u,(d=t).innerHTML="",a.forEach((e=>{const t=document.createElement("a");t.textContent=e.title,t.href=`genres.html?id=${e.id}&title=${encodeURIComponent(e.title)}`,t.classList.add("genre-link"),d.appendChild(t)})),c(h.slice(0,12),o)}catch(e){console.error("Error initializing home page:",e)}var a,d},new((o=void 0)||(o=Promise))((function(n,i){function r(e){try{s(a.next(e))}catch(e){i(e)}}function c(e){try{s(a.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?n(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(r,c)}s((a=a.apply(e,t||[])).next())}));var e,t,o,a}function d(){const n=document.getElementById("searchInput"),i=document.getElementById("searchButton"),o=document.getElementById("searchResults");n&&i&&o&&i.addEventListener("click",(()=>function(n,i){return o=this,r=void 0,a=function*(){if(0!==n.trim().length)try{const o=yield function(n){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/${n}`);return(yield e.json()).results}))}(n);c(o,i)}catch(e){console.error("Error searching anime:",e),i.innerHTML="<p>Error searching for anime. Please try again.</p>"}},new((s=void 0)||(s=Promise))((function(e,t){function n(e){try{c(a.next(e))}catch(e){t(e)}}function i(e){try{c(a.throw(e))}catch(e){t(e)}}function c(t){var o;t.done?e(t.value):(o=t.value,o instanceof s?o:new s((function(e){e(o)}))).then(n,i)}c((a=a.apply(o,r||[])).next())}));var o,r,s,a}(n.value,o)))}function l(n,i,o=1){return r=this,s=void 0,d=function*(){const r=document.getElementById("selectedGenre"),s=document.getElementById("animeGrid"),a=document.getElementById("paginationControls");if(r&&s&&a)try{const d=yield function(n,i=1){return e(this,void 0,void 0,(function*(){const e=yield fetch(`${t}/genre/${n}?page=${i}`);return yield e.json()}))}(n,o);r.textContent=`${i} Anime (Page ${o})`,c(d.results,s),function(e,t,n,i,o){if(o.innerHTML="",t>1){const e=document.createElement("button");e.textContent="Previous",e.addEventListener("click",(()=>l(n,i,t-1))),o.appendChild(e)}const r=document.createElement("span");if(r.textContent=`Page ${t}`,o.appendChild(r),e){const e=document.createElement("button");e.textContent="Next",e.addEventListener("click",(()=>l(n,i,t+1))),o.appendChild(e)}}(d.hasNextPage,o,n,i,a)}catch(e){console.error("Error fetching anime by genre:",e),s.innerHTML="<p>Error loading anime. Please try again later.</p>"}},new((a=void 0)||(a=Promise))((function(e,t){function n(e){try{o(d.next(e))}catch(e){t(e)}}function i(e){try{o(d.throw(e))}catch(e){t(e)}}function o(t){var o;t.done?e(t.value):(o=t.value,o instanceof a?o:new a((function(e){e(o)}))).then(n,i)}o((d=d.apply(r,s||[])).next())}));var r,s,a,d}function u(){return e=this,t=void 0,i=function*(){const e=new URLSearchParams(window.location.search).get("id");if(e)try{!function(e){var t;document.title=`Tanuki - ${e.title}`;const n=document.getElementById("animeBanner");n&&(n.style.backgroundImage=`url(${e.image})`),h("animeTitle",e.title),h("animeDescription",e.description||"No description available."),h("animeType",`Type: ${e.subOrDub||"N/A"}`),h("animeStatus",`Status: ${e.status||"N/A"}`),h("animeReleased",`Released: ${e.releaseDate||"N/A"}`),h("animeGenres",`Genres: ${(null===(t=e.genres)||void 0===t?void 0:t.join(", "))||"N/A"}`),function(e,t){const n=document.getElementById("episodesContainer");n&&(n.innerHTML="",e.forEach((e=>{const i=document.createElement("li");i.className="episode-item",i.onclick=()=>window.location.href=`episode.html?id=${t}&ep=${e.number}`;const o=document.createElement("span");o.className="episode-number",o.textContent=`Episode ${e.number}`;const r=document.createElement("span");r.className="episode-title",r.textContent=e.title&&"null"!==e.title?e.title:"No Title",i.appendChild(o),i.appendChild(r),n.appendChild(i)})))}(e.episodes,e.id)}(yield o(e))}catch(e){console.error("Error fetching anime details:",e),document.body.innerHTML="<h1>Error: Failed to fetch anime details</h1>"}else document.body.innerHTML="<h1>Error: No anime ID provided</h1>"},new((n=void 0)||(n=Promise))((function(o,r){function c(e){try{a(i.next(e))}catch(e){r(e)}}function s(e){try{a(i.throw(e))}catch(e){r(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,s)}a((i=i.apply(e,t||[])).next())}));var e,t,n,i}function h(e,t){const n=document.getElementById(e);n&&(n.textContent=t)}function m(){return n=this,i=void 0,c=function*(){const n=new URLSearchParams(window.location.search),i=n.get("id"),r=n.get("ep");if(i&&r)try{const n=yield o(i);!function(e,t,n){const i=document.getElementById("episodes");i&&e.episodes&&(i.innerHTML="",e.episodes.forEach((e=>{const o=document.createElement("button");o.textContent=`Episode ${e.number}`,o.classList.add("episode-button"),e.number===n&&o.classList.add("current-episode"),o.addEventListener("click",(()=>{window.location.href=`episode.html?id=${t}&ep=${e.number}`})),i.appendChild(o)})))}(n,i,parseInt(r));const c=`${i}-episode-${r}`,s=yield function(n){return e(this,void 0,void 0,(function*(){try{const i=yield fetch(`${t}/servers/${n}`);return yield function(t){return e(this,void 0,void 0,(function*(){if(!t.ok){const e=yield t.text();throw console.error(`API error (${t.status}):`,e),new Error(`API request failed: ${t.statusText}\n${e}`)}return t.json()}))}(i)}catch(e){throw console.error("Error in getEpisodeServers:",e),e}}))}(c);console.log("Available servers:",s),function(e){const t=document.getElementById("serviceSelector");t&&(t.innerHTML="",e.forEach((e=>{const n=document.createElement("option");n.value=e.url,n.textContent=e.name,t.appendChild(n)})),t.onchange=e=>{f(e.target.value)},e.length>0&&f(e[0].url))}(s),function(e){const t=document.getElementById("animeBannerSmall");t&&(t.style.backgroundImage=`url(${e.image})`),v("animeTitle",e.title),v("animeDescription",e.description||"No Description Available"),v("animeStatus",`Status: ${e.status||"N/A"}`)}(n)}catch(e){console.error("Error initializing episode page:",e),p("Failed to load episode information. Please try again later.")}else p("Invalid episode information. Please check the URL.")},new((r=void 0)||(r=Promise))((function(e,t){function o(e){try{a(c.next(e))}catch(e){t(e)}}function s(e){try{a(c.throw(e))}catch(e){t(e)}}function a(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(o,s)}a((c=c.apply(n,i||[])).next())}));var n,i,r,c}function f(e){const t=document.getElementById("videoContainer");if(t){t.innerHTML="";const n=document.createElement("iframe");n.src=e,n.width="100%",n.height="100%",n.allowFullscreen=!0,t.appendChild(n)}}function p(e){const t=document.getElementById("errorContainer");t?t.innerHTML=`<p style="color: red; font-weight: bold;">Error: ${e}</p>`:(console.error("Error container not found in the DOM"),alert(`Error: ${e}`))}function v(e,t){const n=document.getElementById(e);n&&(n.textContent=t)}document.addEventListener("DOMContentLoaded",(()=>{switch(window.location.pathname.split("/").pop()){case"index.html":case"":a();break;case"search.html":d();break;case"genres.html":!function(){const e=new URLSearchParams(window.location.search),t=e.get("id"),n=e.get("title");if(t&&n)l(t,n);else{const e=document.getElementById("selectedGenre"),t=document.getElementById("animeGrid");e&&t&&(e.textContent="No genre selected",t.innerHTML="<p>Please select a genre from the home page.</p>")}}();break;case"animeDetails.html":u();break;case"episode.html":m();break;default:console.error("Unknown page")}}))})();