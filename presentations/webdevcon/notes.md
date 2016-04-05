# Observable Web
Welcome to Observable web

Untangling async, when i came up with the tagline "Untangling async", i thought i should Google to see if there are any blog posts on it.  

Interestingly i found another presentation last year with exactly the same tagline. But that presentation was for JS promises, which were hot back then. 

So, had modify the tagline slightly to "untangling async completely".

## introduction
Hello all, I'm Ganesh Shanmugasundaram.

I'm a Web Development Engineer at the Bookdepository, an Amazon subsidiary based in London, UK.

We an an online book seller. We sell through our own website and through Amazon Marketplace. 

And we deliver worldwide for free, a service not offered by many retailers.

Without further ado, let's get started.

## a problem

Before i get into the presentation, i'd like to ask a couple of questions

- how many of you use javascript everyday? could be work or fun?
could be working on a simple UI interaction or a full blown single page app. anything..  
- how many people maintain code that someone else has left behind?
- what do you think is good code?

I know we all write good code, no one wants to write bad code,
except for that guy who left you to maintain his code.

In this talk, i'd like to discuss one major problem i've been or we've been dealing with in our day to day webdev life,
and the solutions we've come up with over the course of the internet.

## building a feature
When i get asked to build a feature on the website,
i usually try to think about it in a series of steps,
i guess most of us do that.
Let's look at how my thought process works for a simple feature.

I usually start with a user story, 
- when a user types something in the search box
- display a list of search suggestions under search box
- the search suggestions should update with more relevant suggestions, 
as the user types further

the feature is a trivial search suggestion or search auto-complete 
that you can find in most websites today,

## pseudo code
a pseudo code for that feature would look something like this
- get input from user
- query server and get suggestions
- display results

repeat till the user has found his result

sounds quite simple isn't it? That's how i feel when i start building a new feature.

however, when i go about implementing it, 
I get to deal with keyboard events, network requests etc. 
which are asynchronous in nature. 

which makes it not so simple anymore.

## handling async behaviour
so, how have been handling the async events.

traditionally the protocol for dealing with such events is via callbacks.

let's try implementing this the callbacks way.

### Step 1 [get what the user is typing]
the first step is to get what the user has typed.
 we attach an event listerner to the input field, 
 listen for the keyup event 
and get what the user has typed so far.
 quite straight forward.

``` javascript
searchBox.addEventListener('keyup', (e) => {
    let text = e.target.value;
});
```

### Step 2 [make an xhr request]
now that we got the text, let's query the server and get the suggestions,
for simplicity let's assume performSearch does the ajax request to the server.
``` javascript
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    performSearch(term, (result) => {
        
    });
});
```

we've got the result now.

### Step 3 [display result]
let's display it to the user.

again for simplicity sake, 
let's assume we have a function displayResult
which renders the result under the search box.
``` javascript
const searchBox = document.getElementById('searchbox');
searchBox.addEventListener('keyup', (e) => {
    let term = e.target.value;
    performSearch(term, (result) => {
        displayResult(result);
    });
});
```
and that would complete our feature. the code works, does what we wanted it to do.

Ok, now, is that good code? would you be happy if you were left with that code to maintain?

I wouldn't mind maintaining that actually. 
That code is simple,
easy to read.

### We're done
let's get our code peer reviewed,
do some refactoring,
write some tests. 
Ship it to production! 
That feature is done!

We'll never ever have to go back to that code again forever.

I wish things were like that!

### Website is never done!
But Wait! a website is never done!

We launched this feature. 
A Simple one, but useful to the users.

The next day i receive an email from one of my colleagues, 
it read,  "Love the new auto suggest feature you guys have launched.
But it acts a bit wierd sometimes. Could you please check?"

It's great that he likes the feature,
but it acts a bit weird some times.
hmm, that wasn't very informative, is it?.

So, I thought before i get back to him asking for more information, 
let me do some sanity check,
just to make sure there's isn't anything obvious that we missed 
or the tests have missed.
i opened up my shiny mac,
tested across different browser it worked on all the browsers,
it was working fine
even in the old ones

So i emailed him back saying,
i tested it on most browsers and couldn't find any issue, 
could you give me some more information on the issue?
like what was happening,
the browser version,
some screenshots may be.

That's enough information for us to get started.

And then i got a reply,

I was on the tube this morning,
i was trying to search for a book, 
i typed 5 letters and it showed me the exact book i wanted,
but when i tried to click on it, 
the results changed quickly,
which wasn't that relevent. 
I had to press backspace and the same letter again to get to the book,
but it worked the second time. 
The same issue happened a few times during my journey 
I'm on iphone 5S,
not sure how to check the browser version. 
I can't seem to reproduce the issue now though,
seemed to have fixed itself!


we all love the issue that fixes itself.

That reply provided more information.

### user on mobile
we have an extended use case
a user who is on the tube as the Londoners call it or a Metro as the most of the world call it. 
he's on mobile network connection,
trying to find a book,
using the feature we just launched.

### Consider

What kind of issues should we consider for this use case?

- network might be slow, depending on the type of connection he's on. 
- network might be unstable, since he's on a train and moving, some network requests might fail
- network cost, there's going to be a network cost.
- mobile phone  might be slow or low on memory 

We would want to cater for that user as well,
so let's improve our feature to accomodate this specific use case

### make it better
how could we improve?
- reduce the number of requests we make, that'll be quite useful especially in terms of bandwidth, and data costs.
we can  add some debounce logic [100ms]
in this case, let's say we query the server
only when the user stops typing for about 100 milliseconds
- remove duplicate requests
you don't want to make a duplicate request to the server.
- avoid race conditions, make sure we show the results for the latest value in the search box.
this will address the issue my colleague faced.

### one at a time
let's deal with the improvements one at a time. 
Reduce the number of request. 
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

also, did anyone spot anything else that was wrong with the code? 

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

- a promise must only resolve once. so, keyboard or any of the dom event can't be promised.
- when you create a promise it's on it's way to be resolved or rejected, it can't be cancelled. so, settimeout cannot be promised either, as we want to be able to clear timeout.
- AJAX request! yay, that's a perfect candidate for promise. infact, there is the fetch api, which returns a promise.

hmm, promise doesn't look that promising.
let's see how our code looks like if we rewrite it using promise.

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
since a promise can resolve only once and the keyup event cannot be promised, but it'll emit multiple values

the setTimeout can't be promised either, as we'll need a way to cancel timer. and promises can't be cancelled.

the ajax call can be a perfect candidate for promises, 
in fact there is a fetch API which provides a clean interface for making ajax request.

so, when we re-wrote our code using promise, the ajax bit looks a bit cleaner and followable but the rest remains the same. 
that's still unmaintainable code and the maintainers is not going to be happy.

we started out with a simple 3 step pseudo code, and we ended up in this mess and we haven't even completed our feature yet.


can we do better than this? can we make it more maintainable and make dev life easier.

may be.. let me introduce you to a new object type called Observables.

everytime i tell that there's a new feature or library in javascript to nonJavascript devs i work with, i get this look. 

## Observables

### what is it?
Let's see observables can do here, but before that, let's see what observables are

Bluntly put, an observable is an object type for modelling async data. it represents a stream of values over a period of time.
It pushes or emits zero to n values over a period of time.

To explain it clearly,

If it's a synchronous operation and returns a single value, it can be represented by a normal function.
If it's synchronous operation and returns multiple values, it can be  iterators
If it's asynchronous operation and emits a ONLY a single value, it can be represented by a promise.
And finally, this is where there is some hollow space, if it's asynchronous and emits 0 - N values, it can be modelled as an observable.

Now that brings us to another question, so do i have to learn another API? new syntax?

### similar syntax as Promise
So, let's see how to use an observable,

The syntax is similar to promise, so if you've used promises before, you'll be comfortable using observable.

In promise, we usually call then on the promise passing onResolve and onReject functions.

```javascript
somePromise.then(onResolve, onReject);
```

In Observable, we use subscribe instead of then.

We pass onNext and onError functions

The onNext gets called every time the observable emits a value.

Since it can emit multiple values, we need a way to see when it's complete, so we pass a onComplete function as well.
 onComplete will call when all the values are emitted.

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

### Create an observable
So, we saw how to subscribe to an observale, but first how do we create an observable. 
Let's take a button click event and create an observable out of it.

But before that, How many of you have used promises?
How many of you actually created a promise from scratch?

```javascript
$clickObs = new Observable(observer => {
    const element = docuement.getElementById('btn');
    let handler =  (evt) => {
        observer.next(evt);
    };
    
    element.addEventListener('click', handler, true);
    
    return _ =>  {
        element.removeEventListener('click', handler, true);
    }
}); 
```
So, the Observable takes in a function which receives an observer. 
we attach an click event listener on a button, and every time the button is clicked observer.next is called.
And we return a clean up function which will remove the listener from the button.
When a subscriber subscribes to the observable, the onNext function will be called with the eventInfo
subscriber.unsubscribe() will call the clean up function which will remove the event listener.


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

### Event emitter
When i first learnt about observables, i thought this looks similar to event emitters. 
Event emitters are quite popular in nodeJS. 
I even thought are they event emitters for the browser?
They are similar in the way that the observable emit 0 or more values like event emitters.
And can be subscribed on.

Observables are lazy in nature, nothing happens when you instantiate the observable
Actual operation like the ajax request happens only on subscription.
An observable will have one subscriber by default. 
subscribing on observable multiple times will cause it to perform multiple operations and each subscriber will get different values.
 
### hot observable
Sometimes you want to share values between multiple subscribers, 
This is called making the observable hot. there are tools which can do this.
The operation happens only on first subscription. 
On subsequent subscriptions, the subscribers just listen to what's getting emitted.
The observable acts more like an event emitter. 

And not all the subscribers get all the values. So, not really preferred unless you have to use it.

### what's so special?

so, what's so special about observable? Their syntax is similar to promise, but allows for multiple value to be emitted, 
that sounds more like an event emitter in node.js. 
 they both are different implementations of observer pattern.

### observables are composable and transformable

So, what makes it special?

A couple of things, it could act as a unified protocol for all the async events. 
So, you want to represent something that emits just one value, you can use an observable
you want to represent something that emits a zillion values, you can use observables for that too. 

They're transformable, you can transform each value into different values 

Composable, you can combine 2 or more observable to make a third one.

And all this using extended array operators like map, reduce, forEach. 
That in my opinion is the best bit about Observables. They can be treated like iterators.
 
 
# treat them like iterators

```javascript
[1,2,3].map(x => x*x).reduce((x, sum) => sum+x, 0)
```
So, we can treat the observables as iterators. 

Let's take the following example,
we're transforming an array [1,2,3]
what we're doing here is mapping each value of the array to it's square, 
so we get a new array with [1,4,9]
then the reduce operation returns the sum of the squares.

As for Observables, we can treat each event like a value of the array.
In our example we map each mouse click to a value of 1
and the reduce operation, gets the sum. 
 

```javascript
newObservable = clickObs.map(x=>1).scan((x,y) => x+y);
```

the new observable will be emitting the co-ordinates rather than the events


### browser support?
Well, that's the tricky part. It's not part of the standards yet.
It's at stage 1 for the tc39 process, which means it's proposed.
It didn't make it into ES 2016

But that said, it shouldn't stop us from using observable

### what do i do today?
luckily there are a few projects which let you use observables today
- rxJS
- baconJS
- angular 2 implements this 
 
RxJS is one of the mature ones, it provides tools or APIs for creating observables from events, 
promises, event streams, callbacks, virtually anything. It also provides over 200 operators to 
compose and transform observable. It has a huge community, and well documented. 
They're trying to make their implementation of Observable to align with the Observable standard.
baconJS, a light weight library. Not as extensive as rxJS, but supports most of the use cases.
How many angular users do we have here?
So, Angular 1, used promise extensively, especially for the http provider.
Angular 2.0 will be using Observable, currently supported by rxJS.
So, there is a huge community behind this and this is a worthy contender.


### Autocomplete example using observable
Oh, coming to our auto-suggest box. Let's see how to implement that using Observable.


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

