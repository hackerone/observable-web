# Observables

## introduction
Hi, I'm Ganesh.
I'm a Web Development Engineer with the Bookdepository team in UK.

Bookdepository is an amazon subsidiary. We an an online book seller based in London, UK. 
We sell through our own website and through amazon marketplace. And we deliver worldwide for free, which sets us apart from Amazon.

Without further ado, let's get into the talk.

## time vs async

Normal humans think in terms of time, we have a meeting at 4, finish work at 5:30, go for dinner at 7 etc. 
Every activity in our brain will have a timestamp associated with it.

However, Javascript engineers think in terms of async. async everywhere.

## a problem
In this talk, i'd like to discuss one major problem i've been or we've been dealing with in our day to day webdev life,
and the solutions we've come up with over the course of the internet.

## building a feature
When i get asked to build a feature on the website, i usually to think of it in a series of steps, i guess most of us do that.
Let's look at how my thought process works for a simple feature.

I usually start with my customer, 
- as a user I open the website on the browser 
- when i type something in the search box
- i want to see the search suggestions appear under the search box.
- the search suggestions should update with more relevant suggestions, as i type further

the feature is a trivial search suggestion or search auto-complete that you find in most websites today,

## pseudo code
a pseudo code for the user stories would look like this
- get input from user
- query server and get suggestions
- display result

repeat till the user has found his result

quite simple ey.

however, when i go about implementing it, I get to deal with keyboard events, network requests etc. which are asynchronous in nature. this complicates the code.

## handling async behaviour
so, how have been handling the async events.

traditionally the protocol for dealing with such events is via callbacks.

let's try implementing this the callbacks way.
when i type something, get what he's typing, attach an event listerner to the input field, listen to the keyup event and get what the user has typed so far. 
simple right.

### Step 1 [get what the user is typing]
``` javascript
const searchBox = document.getElementById('searchbox');
searchBox.addEventListener('keyup', (e) => {
    let text = e.target.value;
});
```

### Step 2 [make an xhr request]
now that we got the text, let's perform search via xhr, for simplicity let's assume performSearch does that for us.
``` javascript
const searchBox = document.getElementById('searchbox');
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    performSearch(term, (result) => {
        
    });
});
```

we've got the result now. let's display it to the user.

### Step 3 [display result]
again for simplicity sake, let's assume we have a function displayResult which displays result to the user.
``` javascript
const searchBox = document.getElementById('searchbox');
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    performSearch(term, (result) => {
        displayResult(result);
    });
});
```
and consider our website as done.

### Website is never done!
But! a website is never done!

there's always something more that your customers want or the business want or c'mon you always want to improve customer experience.

in this case, let's say you don't want to query the server till the user stops typing for about 100 milliseconds, to save some bandwidth. 
your customers especially the ones on mobile devices with slower internet speeds would thank you for this.

so, how do we implement it,
```javascript
const searchBox = document.getElementById('searchbox');
var requestTimer = null;
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    clearTimeout(requestTimer);
    requestTimer = setTimeout(() => {
        performSearch(term, (result) => {
            displayResult(result);
        );
    }, 100);
});
```

so, we're building a simple feature and now we got into a callback hell already, and we want to get it to production and maintain it.
also, can someone spot anything wrong in the code? 

### it's missing curly brace!

I can see some people say, c'mon we've got promises. promises make our life easier.. most modern browsers support promises, except for internet explorer and there are polyfills for the older ones.

### let's see if promises can help us here.

- a promise must only resolve once. so, keyboard or any of the dom event can't be promised. in our case, the keyup event cannot be promised.
- a promise can't be cancelled. when you create a promise it's on it's way to be resolved or rejected. so, settimeout cannot be promised either, as we want to be able to clear timeout.
- AJAX request! yay, that's a perfect candidate for promise. infact, there is the fetch api, which returns a promise.

So, in our simple example only 1 of the 3 can be promised.


### solution with promise
```javascript
const searchBox = document.getElementById('searchbox');
var requestTimer = null;
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    clearTimeout(requestTimer);
    requestTimer = setTimeout(() => {
        fetch('/search?term='+term)
            .then((resp) => {
                return resp.json();
            }).then((json) => {
                // do something...
            })
    }, 300);
});
```

so, when we re-wrote using promise, the ajax bit looks a bit cleaner and followable but the rest remains the same. that's still unmaintainable code..

so, can we do better than this? can we make it more maintainable and make dev life easier.


## Observables

### what is it?
Let's see observables can do here, but before that, let's see what observables are

Bluntly put, an observable is an object type for modelling async data. it represents a stream of values over a period of time.
It pushes out or emits zero to n items over a period of time.

To explain it clearly,

If it's a syncronous operation and returns a single value, it can be represented by primitive type.
If it's synchronous operation and returns multiple values, it can be an iterable like array
If it's asynchronous and emits a ONLY a single value, it can be represented by a promise
And finally, this is where there is some hollow space, if it's asynchronous and emits 0 - N values, it can be represented as an observable.

### syntax similar to promise
So, let's see how to use an observable,

The syntax is similar to promise, so if you've used promises before, you'll be comfortable using observable.

In promise, we usually call then on the promise passing onResolve and onReject functions.

```javascript
somePromise.then(onResolve, onReject);
```

In Observable, we use subscribe instead of then.

We pass onNext and onError functions
Since it can emit multiple values, we need a way to see when it's complete, so we pass a onComplete function as well.

The onNext gets called every time the observable emits a value and onComplete will call when all the values are emitted.

```javascript
observable.subscribe(onNext, onComplete, onError);
```

So, the learning curve is quite small for Observables. if you're used to promises already then it's easy to get started with observables.


### what can be observables?

In our auto-suggest we said only the ajax request is a good candidate for a promise. 
So, what about observables? what can be observables.

- keyboard events like keyup / keydown etc. they emit events everytime user types.. they can be observables. except the oncomplete will never get called.
- Mouse events like mouse click, mouse up / down etc can be observables
- Animation events start, end, iteration can be observable
- lifecycle events settimeout request animation frame, they can be modelled to observable
- ajax calls, they emit just 1 event, a success or a failure.  they can be observables
- websocket events where data is pushed for every message, they're good candidates for observables.
- so, nearly all the events that we fiddle with to build apps can be observables. 

### hot / cold observable

If you look at these events, they can be classified into 2 types, 

ones that are passive event, they only start producing notiifcations on request or on subscription. for example an ajax request doesn't happen till you want to make it happen. 
And when you subscribe to such events, you get all the values emitted right from the beginning. Such observables are considered cold.

for cold observables, the operation happens when you subscribe to the observable, for example, the AJAX request is made when you subscribe to the observable. 

on the other hand, events like mouse clicks, keyboard events etc, keep happening no matter if you subscribe to them or not. so, you start listening in the middle and you only get the values that are emitted after you subscribe to them. those observables are considered hot. in case of hot observables, we're not interested in the past values, we're only interested in current and future values.



## what's special?

so, what's so special about observable? Their syntax is similar to promise, but allows for multiple value to be emitted, that's more like an event emitter in node.js. right?
i had 

### observables are composable
can use map, reduce, forEach on the observable


### browser support?
It's in stage 1 of tc39 proposal. Hopefully will be included in tc39


### what do i do today?
luckily there are a few projects which let you use observables today
- rxJS
- baconJS
- angular 2 implements this 

### Autocomplete example using observable

```javascript
const searchBox = document.getElementById('searchbox');
const searchObservable = Observable.fromEvent(searchBox, 'keyUp')
        .map((e) => e.target.value)
        .debounce(200)
        .distinctUntilChanged()
        .map((term) => {
            return fetch('/search?term='+term).then(resp => resp.json());
        });
```

```javascript
const searchBox = document.getElementById('searchbox');
const searchObservable = Observable.fromEvent(searchBox, 'keyUp')
        .map((e) => e.target.value)
        .debounce(200)
        .distinctUntilChanged()
        .map((term) => {
            return fetch('/search?term='+term).then(resp => resp.json());
        });
searchObservable.subscribe(next, complete, error);
```

## demo time

## thanks

