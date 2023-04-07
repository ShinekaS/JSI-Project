import API_KEY from "./API_KEY.js";

let startArea = document.querySelector('.start-area');
let welcomeBtn = document.querySelector('#welcome-button');
let mainArea = document.querySelector('.main-area');
let planArea = document.querySelector('.plan-area')

let plannedItems = [];
let plannedArea = document.querySelector('.plannedList');

let unplannedIdeas = [];
let unplannedArea = document.querySelector('.unplannedList');


// This function takes a clicked list item and generates a form field to plan that idea, then moves it from the unplanned ideas into the planned ideas
let addPlan = (element) => {
    planArea.innerHTML = '';
    planArea.insertAdjacentHTML('afterbegin', formHTML)
    let submitPlanButton = document.querySelector('#submitPlanButton')
    let ideaField = document.querySelector('.idea-field')
    ideaField.innerText = element.innerText;

    submitPlanButton.addEventListener('click', (e) => {

    let steps = document.querySelector('#Steps')
    let timeFrame = document.querySelector('#timeFrame')
    let plannedIdea = {
        idea: element.innerText,
        steps: steps.value,
        timeFrame: timeFrame.value,
    }
    unplannedIdeas.splice(unplannedIdeas.indexOf(element.innerText));
    buildUnplannedList(unplannedIdeas);
    plannedItems.push(plannedIdea);
    buildPlannedList(plannedItems);
    console.log(plannedItems)
    planArea.innerHTML = '';
})
Ω};


let buildUnplannedList = (array) => {
    unplannedArea.innerHTML = 'Unplanned Ideas!';
    array.forEach(idea => {
        let listItem = document.createElement('li');
        listItem.addEventListener('click', (e) => {
            let target = listItem
            e.preventDefault();
            addPlan(target)
        });
        listItem.innerText = idea;
        console.log(listItem)
        unplannedArea.append(listItem);
    });
};

let buildPlannedList = (array) => {
    plannedArea.innerHTML = 'Planned Ideas!';
    array.forEach(element => {
        let listItem = document.createElement('li');
        listItem.setAttribute('onclick', '')
        listItem.innerText = element.idea;
        plannedArea.append(listItem);
    })
};

const suggestionHTML = `
<div class="api-div">
    <h class="idea-field">Loading something brilliant...</h>
    <nav class="decision-buttons">
    <button id="dislike-button">Nah, can't dit it</button>
        <button id="like-button">Oh yeah, I like it</button>
    </nav>
</div>`

const formHTML = `
<section class='plan-container'>

<div class="stepsContainer">
    <label for="Steps">What steps can you take to make it happen?</label>
    <textarea name="Steps" id="Steps" cols="35" rows="5"></textarea>
</div>
<div class="timeFrameContainer">
    <label for="timeFrame">Set a time frame: </label>

    <select name="timeFrame" id="timeFrame">
        <option value="1-3months">1-3 months</option>
        <option value=" 3-6months">3-6 months</option>
        <option value="6-12months">6-12 months</option>
        <option value="1+years">1+ years</option>
    </select>
</div>
<div class="plan-button-div">
   <button type="submit" id="submitPlanButton">Submit Plan</button>
</div>
</section>`

welcomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Clicked')
    startArea.classList.toggle('hide')

    mainArea.insertAdjacentHTML('afterbegin',
        `<article class="welcome-content">
    <h>Welcome to Buck-iT!</h>

    <p>Here's how to use your new Buck-It! list planner:</p>

    <p>This is an easy way to help you come up with great ideas for fun and exciting things to before you...ya know....kick the bucket! <br> Buck-iT will give you an idea, if you don't like it, "Can-it"!. If you love it, "Plan-it"! On the fence? "Save-it" and plan later. <br> Jot down ideas and plan out your next fun idea. Buck-iT, before you "kick it"!</p>

    <button id="start-button">Got it, let's get started</button>

    </article>`);

    let startBtn = document.querySelector('#start-button');

    startBtn.addEventListener('click', (e) => {
        e.preventDefault();

        mainArea.innerHTML = '';
        mainArea.insertAdjacentHTML('afterbegin', suggestionHTML)

        let decisionBtnArea = document.querySelector('.decision-buttons');

        const getNewIdea = () => {
            let ideaField = document.querySelector('.idea-field');
            fetch(`https://api.api-ninjas.com/v1/bucketlist`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': `${API_KEY}`,
                },
            }).then(r => r.json())
                .then(data => ideaField.innerText = `${data.item}`)
        }

        getNewIdea();

        let userDecline = document.querySelector('#dislike-button');
        userDecline.addEventListener('click', (e) => {
            e.preventDefault();
            getNewIdea();
        })

        let userAdd = document.querySelector('#like-button');
        userAdd.addEventListener('click', (e) => {
            e.preventDefault();
            decisionBtnArea.innerHTML = '';
            decisionBtnArea.insertAdjacentHTML('afterbegin',
                `
            <article class='bucket-buttons'>
                <button id="plan-it">Plan-It! Now</button>
                <button id="save-it">Save for Later</button>
            <button id="can-it">Can-It!</button>
            </article>
            `)
            let planBtn = document.querySelector('#plan-it');
            let quickSaveBtn = document.querySelector('#save-it');
            let canItBtn = document.querySelector('#can-it');



            let planAreaCreated = false


            canItBtn.addEventListener('click', (e) => {
                e.preventDefault();
                decisionBtnArea.innerHTML = '';
                planArea.innerHTML = '';
                getNewIdea();
                decisionBtnArea.append(userDecline, userAdd);
                planAreaCreated = false;
            });

            quickSaveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let ideaField = document.querySelector('.idea-field');
                let idea = ideaField.innerHTML
                unplannedIdeas.push(idea);
                buildUnplannedList(unplannedIdeas);
                getNewIdea();
            });


            planBtn.addEventListener('click', (e) => {
                e.preventDefault();

                if (planAreaCreated === false) {planArea.insertAdjacentHTML('afterbegin', formHTML)
                let submitPlanButton = document.querySelector('#submitPlanButton')
                planAreaCreated = true
                submitPlanButton.addEventListener('click', (e) => {
                    e.preventDefault();

                    let steps = document.querySelector('#Steps')
                    let timeFrame = document.querySelector('#timeFrame')
                    let idea = document.querySelector('.idea-field')
                    let plannedIdea = {
                        idea: idea.innerHTML,
                        steps: steps.value,
                        timeFrame: timeFrame.value,
                    }
                    plannedItems.push(plannedIdea);
        // Area to update planned list
                    buildPlannedList(plannedItems);
                    planArea.innerHTML = ''
                    getNewIdea();
                    planAreaCreated = false
                })

                    console.log(plannedItems)
                }
            });

            quickSaveBtn.addEventListener('click', (e) => {

            })

        })
    })
})
