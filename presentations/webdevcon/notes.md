# Observable Web
Welcome to Observable web

## introduction
Hello all, I'm Ganesh Shanmugasundaram.

I'm a Web Development Engineer at the Bookdepository, an Amazon subsidiary based in London UK.

We an an online book seller. We sell through our own website and through Amazon Marketplace. 

And we deliver worldwide for free, a service not offered by many retailers.

Without further ado, let's get started.

## time vs async

Normal humans think in terms of time, Our brain attaches a timestamp to all our daily activities. We wake up at 6:30, we get to work at 8:30, we have meetings at 10:30 etc etc,
So, everything relates to a time.

However, Javascript Engineers think in terms of async. async everywhere. Asyncs 

## a problem
In this talk, i'd like to discuss one major problem i've been or we've been dealing with in our day to day webdev life,
and the solutions we've come up with over the course of the internet.

## building a feature
When i get asked to build a feature on the website, i usually try to think about it in a series of steps, i guess most of us do that.
Let's look at how my thought process works for a simple feature.

I usually start with a user story, 
- when i type something in the search box
- i want to see the search suggestions appear under the search box.
- the search suggestions should update with more relevant suggestions, as i type further

the feature is a trivial search suggestion or search auto-complete that you can find in most websites today,

## pseudo code
a pseudo code for the feature would look something like this
- get input from user
- query server and get suggestions
- display result

repeat till the user has found his result

quite simple eh?

however, when i go about implementing it, I get to deal with keyboard events, network requests etc. which are asynchronous in nature. this complicates the code.

## handling async behaviour
so, how have been handling the async events.

traditionally the protocol for dealing with such events is via callbacks.

let's try implementing this the callbacks way.

### Step 1 [get what the user is typing]
the first step is to get what the user has typed. so, we attach an event listerner to the input field, listen for the keyup event 
and get what the user has typed so far.  quite straight forward.

``` javascript
searchBox.addEventListener('keyup', (e) => {
    let text = e.target.value;
});
```

### Step 2 [make an xhr request]
now that we got the text, let's query the server and get the suggestions, for simplicity let's assume performSearch does the ajax request to the server.
``` javascript
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    performSearch(term, (result) => {
        
    });
});
```

we've got the result now. let's display it to the user.

### Step 3 [display result]
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
and that would complete our feature and the website is done.

### Website is never done!
But! a website is never done!

there's always going to be an extension to the feature. it could be an improvement to the user experience, or a business requirement change etc. so we have to go back to the code again.

### user on mobile
in this case, let's consider a user who is on the tube as the Londoners call it or a Metro as the rest of the world call it. 
he's on his way to work, 
he's on mobile network connection,

what does the environment look like for such a user,
- network might be slow
- network might be unstable, some network requests might fail
- network cost
- device might be slow

We would want to cater for that user as well as they buy books, so let's improve our feature to accomodate this specific use case

### make it better
how could we improve?
- add some debounce logic [100ms]
in this case, let's say we query the server only when the user stops typing for about 100 milliseconds, to save some bandwidth.
- avoid race conditions, make sure we show the results for the latest value in the search box.

### one at a time
let's deal with the improvements one at a time.
so, how do we implement debounce logic, let's use the age old method of adding a setTimeout, and cancel the timeout if we detect another keyup event within 100 milli seconds.
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
### we have 3 problems now
hmm, now we have 3 problems
- we've introduced a state and timer which makes it harder to test
- we've gotten into the callback hell!

also, can someone spot anything wrong in the code? 

### it's missing curly brace!
this is one of the symptoms of callback hell

- the code gets harder to maintain as we make more changes.
it'll be a hard time for the future maintainers of your code,
but that's fine right, someone is going to maintain the code right? may be or if your unlucky you'll maintain your own code.

### Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.

### Promises

But hey! we've got promises to save us from the callback hell right? Promises are cool. the make the code more readable and comprehendable.

Promises make our life easier.. most modern browsers support promises, except for internet explorer and there are polyfills for the older ones, so that's fine.

### can promises save us from the violent psychopath

let's see what promises can do

- a promise must only resolve once. so, keyboard or any of the dom event can't be promised. in our case, the keyup event cannot be promised.
- when you create a promise it's on it's way to be resolved or rejected, it can't be cancelled. so, settimeout cannot be promised either, as we want to be able to clear timeout.
- AJAX request! yay, that's a perfect candidate for promise. infact, there is the fetch api, which returns a promise.

So, even in our simple example only 1 of the 3 can be promised.

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
            }).then((result) => {
                displayResult(result);
            })
    }, 300);
});
```

so, when we re-wrote using promise, the ajax bit looks a bit cleaner and followable but the rest remains the same. 
that's still unmaintainable code and the maintainers is not going to be happy.

we started out with a simple 3 step pseudo code, and we ended up in this mess and we haven't even completed our feature yet.

can we do better than this? can we make it more maintainable and make dev life easier.

may be.. let me introduce you to a new object type called Observables.

everytime i tell that there's a new feature or library in javascript to nonJS devs i work with, i get this.
 

## Observables

### what is it?
Let's see observables can do here, but before that, let's see what observables are

Bluntly put, an observable is an object type for modelling async data. it represents a stream of values over a period of time.
It pushes or emits zero to n values over a period of time.

To explain it clearly,

If it's a syncronous operation and returns a single value, it can be represented by a normal function.
If it's synchronous operation and returns multiple values, it can be an iterator like array
If it's asynchronous operation and emits a ONLY a single value, it can be represented by a promise.
And finally, this is where there is some hollow space, if it's asynchronous and emits 0 - N values, it can be modelled as an observable.

## So do i have to learn new things?

### similar syntax as Promise
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
subscription = observable.subscribe(onNext, onComplete, onError);
```

### unsubscribe observables
Since observables can emit multiple values, we'll need a way to unsubscribe.
we just call unsubscribe on the subscription

```javascript
subscription.unsubscribe();
```

So, the learning curve is quite small for Observables. if you're used to promises already then it's so easy to get started with Observables.


### what can be observables?

In our auto-suggest we said only the ajax request is a good candidate for a promise. 
So, what about observables? what can be modelled into observables. if you take a look at the browser events, we have

- keyboard events like keyup / keydown etc. they emit events everytime user types.. they can be observables. except the oncomplete will never get called.
- Mouse events like mouse click, mouse up / down etc can be observables
- Animation events start, end, iteration can be observable. they'll have an oncomplete event triggered.
- lifecycle events settimeout request animation frame, they can be modelled to observable
- ajax calls, they emit just 1 event, a success or a failure.  most of use promises nowadays for this, they can be observables
- websocket events where data is pushed for every message, they're good candidates for observables.
- so, nearly all the events that we fiddle with to build apps can be observables. 

### cold observable

If you look at these events, they can be classified into 2 types, 

ones that are passive event, they only start producing notiifcations on request or on subscription. for example an ajax request doesn't happen till you want to make it happen. 
And when you subscribe to such events, you get all the values emitted right from the beginning. Such observables are considered cold.

so, for cold observables, the operation happens when you subscribe to the observable. The operation happens everytime you subscribe to the observable. 

### hot observable
on the other hand, events like mouse clicks, keyboard events etc, keep happening no matter if you subscribe to them or not. so, you start listening in the middle and you only get the values that are emitted after you subscribe to them. those observables are considered hot. in case of hot observables, we're not interested in the past values, we're only interested in current and future values.

### what's so special?

so, what's so special about observable? Their syntax is similar to promise, but allows for multiple value to be emitted, 
that sounds more like an event emitter in node.js. right?
well it is similar. they both are different implementations of observer pattern.
i had the similar thoughts when i read the specs.

### observables are composable and transformable
can use map, reduce, forEach on the observable like you do on any arrays

```javascript
[1,2,3].map(x => x*x);
// [1, 4, 9]
```

for example, here we are mapping the mouse move events to a set of co-ordinates 

```javascript
newObservable = mouseMoveObservable.map(e => {x: e.offsetX, y: e.offsetY});
```

the new observable will be emitting the co-ordinates rather than the events


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

