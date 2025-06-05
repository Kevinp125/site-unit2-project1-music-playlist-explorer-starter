const modal = document.getElementById("modal"); //get the modal by its id
const closeBtn = document.getElementsByClassName("close")[0]; //getting the close span remember that getting elementsByClassName returns a collection so we index into zero to get first instancce of close button

/* *** BELOW FUNCTIONS HAVE TO DUE WITH OPENING AND CLOSING THE MODAL ***  */

function openModal() { //mighgt also need to pass object with modal details
  //will need to fill this out at some point with all the modal information by getting elements by id i believbe and populating html tags
  modal.style.display = "block";
}

closeBtn.onclick = function() { //attached onclick event handler to the close button when clicked the modals display will be set to none again
  modal.style.display = "none";
}
window.onclick = function(event) { //also attached the onclick handler to the window. If its clicked let us get the event information. If it matches the modal (which is the overlay not the modal-content itself) it means user clicked out of it so hide it again
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* *** BELOW FUNCTIONS HAVE TO DUE WITH DYNAMICALLY POPULATING PLAYLISTS ***  */

const playlistCards = document.querySelector(".playlist-cards"); //getting the playlist-cards section from the HTML dom so we can append playlist articles to it.


//function will make a card using JS
const createPlaylistCard = function(card){

  let playlistArticle = document.createElement('article'); //creates an <article> element
  playlistArticle.className = 'card'; //allows us to give the article its proper class
  playlistArticle.setAttribute("onclick", "openModal()"); //might have to pass stuff to this openModal function at some point!! Set aattribute allows on click functionality to work

  //below just made one fat template literal work smarter not harder. It is the exact same html I had except for the insertion of the variables from our card object which contains playlist details

  //we alter the innerHTML of the article we created above by just adding the literal
  playlistArticle.innerHTML += `
    <img class = "playlist-image" src="${card.playlist_art}" alt="Playlist image placeholder">

    <div class = "card-content-padding">
      <h2>${card.playlist_name}</h2>
      <p>${card.playlist_author}</p>
        <div class = "likes-incard">
          <img src="assets/img/unlikedHeart.png" alt="Unliked heart image" width = 35px height = 35px>
          <p>${card.like_count}</p>
        </div>
    </div>
  `

  //finally we want to append this playlistArticle to the playlistCards section we selected at the top of our code.
  playlistCards.appendChild(playlistArticle);
}

if(data === null){
  let emptyData = document.createElement('p');
  emptyData.textContent = 'No playlists added';
  document.body.appendChild(emptyData); 
}

else{
  data.forEach((card) => {
    createPlaylistCard(card);
  })
}

