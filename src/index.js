let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

// New toy image addresses
//'https://upload.wikimedia.org/wikipedia/commons/d/d8/Teddy_bear_early_1900s_-_Smithsonian_Museum_of_Natural_History.jpg'

document.addEventListener('DOMContentLoaded', renderJs)
// Database URL
const dbURL = 'http://localhost:3000/toys'

// Grab HTML Elements
const toyCollection = document.querySelector('#toy-collection')
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const toyForm = document.querySelector('.add-toy-form')
const formSubmitBtn = document.querySelector('.submit')
const nameInput = document.getElementsByName('name')[0]
const imageInput = document.getElementsByName('image')[0]

// Event Listeners (aside from add a new toy button and likeBtn)
//console.log('toyForm: ', toyForm)
toyForm.addEventListener('submit', submitNewToy)

function renderJs() {

  activateNewToyForm();

  receive(dbURL)
  .then(collection => collection.forEach(renderCard))
}

function activateNewToyForm () {

  addBtn.addEventListener("click", () => {

    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block"; 
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function submitNewToy(e) {
  e.preventDefault()
  
  const newName = nameInput.value
  const newImage = imageInput.value.toString()
  let newCardBody = {}
  if (newName === '') alert('Please enter a name')
  else if (newImage === '') alert('Please enter an image url')
  else {
    newCardBody = {
      name: newName,
      image: newImage,
      likes: 0
    }}
  
    // update the database
    post(dbURL, newCardBody)
    //.then(console.log(newCardBody))
    // then render to page
    .then(() => {
      console.log(newCardBody)
      renderCard(newCardBody)
  })
}

function renderCard(toy) {
  
    const toyCard = document.createElement('div')
    const toyName = document.createElement('h2')
    const img = document.createElement('img')
    const likes = document.createElement('p')
    const likeBtn = document.createElement('button')

    //console.log(toy)
    // Add data to toy card
    toyCard.id = toy.id
    toyName.textContent = toy.name
    img.src = toy.image
    likes.textContent = toy.likes
    likeBtn.classList = 'like-btn'
    likeBtn.id = toy.id
    likeBtn.textContent = `Like` + ' &hearts';

    // Append card to DOM
    toyCollection.append(toyCard)
    toyCard.append(toyName, img, likes, likeBtn)
    console.log(likeBtn)

    likeBtn.addEventListener('click', e => handleLikeBtn(e, toy))  
}

function handleLikeBtn(e, toy) {
  console.log(toy)
  console.log(e.target.parentNode.querySelector('p'))
  console.log(toy.likes, toy.id)

  patch(dbURL + `/${toy.id}`, {likes: toy.likes + 1})
  .then(console.log)
  .then(e.target.parentNode.querySelector('p').textContent = toy.likes + 1)
  .catch(console.error)
}

function receive(url) {
  return fetch(url).then(res => res.json())
}

function post(url, body) {
  return fetch(url, {
    method: 'POST', 
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

function patch(url, body) {
  return fetch(url, {
    method: 'PATCH', 
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
}