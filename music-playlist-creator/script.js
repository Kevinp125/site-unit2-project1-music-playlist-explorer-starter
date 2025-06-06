const modal = document.getElementById("modal"); //get the modal by its id
const closeBtn = document.getElementsByClassName("close")[0]; //getting the close span remember that getting elementsByClassName returns a collection so we index into zero to get first instancce of close button
const playlistCards = document.querySelector(".playlist-cards"); //getting the playlist-cards section from the HTML dom so we can append playlist articles to it.
const songList = document.getElementById("song-list");
let currentPlaylistData = null; // this is a variable that we will update inside of openModal so that we can use this info for our randomize song section

/* *** BELOW FUNCTIONS HAVE TO DUE WITH OPENING AND CLOSING THE MODAL ***  */

//helper function is going to create a song banner and append it to the unordered list inside our modal
function createSongBanner(song){

  const songList = document.getElementById("song-list"); //grabbing the <ul> tag which is the parent of the list of songs so we can append songs to it.

  const songBanner = document.createElement("li"); //creating a <li> element in which all song info is going to go.

  //Add all the song info inside of our li element exactly how I had it in the HTML only difference is its a template literal and we can fill in info with the data.
  songBanner.innerHTML += `
    <img class = "song-image" src=${song.song_art} alt="Song Image" >
      <div>
        <h2>${song.title}</h2>
        <p>${song.artist}</p>
        <p>${song.album}</p>
      </div>
    <p>${song.time}</p>
  `

  //finally append this newly created banner onto the ul tag songList
  songList.appendChild(songBanner);
}

//function receives data object so that when modal is opened we can fill it in with all of a playlists data
function openModal(data) { 
  modal.style.display = "block"; //when modal is opened change style to block so it is visible
  currentPlaylistData = data; //now currentPlaylistdata can be used in the randomize songs function.
  console.log(currentPlaylistData);

  //grab the playlist aside tags by their id so we can alter their textContent to reflect the information inside the data.js
  const modalImg = document.getElementById('modal-playlist-image');
  const modalPlaylistTitle = document.getElementById("playlist-title");
  const modalPlaylistCreator = document.getElementById("playlist-creator");

  //updating all the playlist info in the modal dynamically
  modalImg.src = data.playlist_art;
  modalPlaylistTitle.textContent = data.playlist_name;
  modalPlaylistCreator.textContent = data.playlist_author;

  //next part is to populate the songs in a playlist. Now since this is more varying because there could be more songs in one playlist. They can get added or removed we have to create the li elements and append them to the song container. We achieve this through createSongBanner helper function

  songList.innerHTML = ""; //before populating the modal with all the songs it is important for us to clear the innerHTML of the <ul> tag so that the same duplicate songs arent added everytime user clicks

  //finally just loop through this cards array of song objects and call the create SongBanner for each of them.
  data.songs.forEach((song) => {
      createSongBanner(song);
  })
}

closeBtn.onclick = function() { //attached onclick event handler to the close button when clicked the modals display will be set to none again
  modal.style.display = "none";
}
window.onclick = function(event) { //also attached the onclick handler to the window. If its clicked let us get the event information. If it matches the modal (which is the overlay not the modal-content itself) it means user clicked out of it so hide it again
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/* *** BELOW FUNCTIONS HAVE TO DUE WITH DYNAMICALLY POPULATING PLAYLISTS***  */

//function will make a card using JS
function createPlaylistCard(card){

  const playlistArticle = document.createElement('article'); //creates an <article> element
  playlistArticle.className = 'card'; //allows us to give the article its proper class

  playlistArticle.addEventListener("click", () => { //want to pass in the card data when we open the modal so that we can populate modal information
    openModal(card);
  })

  //below just made one fat template literal work smarter not harder. It is the exact same html I had except for the insertion of the variables from our card object which contains playlist details

  //we alter the innerHTML of the article we created above by just adding the literal
  playlistArticle.innerHTML += `
    <img class = "playlist-image" src="${card.playlist_art}" alt="Playlist image placeholder">

    <div class = "card-content-padding">
      <h2>${card.playlist_name}</h2>
      <p>${card.playlist_author}</p>
        <div class = "likes-incard">
          <img class = "like-img" src="assets/img/unlikedHeart.svg" alt="Unliked heart image" width = 35px height = 35px>
          <p class = "like-count">${card.like_count}</p>
        </div>
    </div>
  `

  //finally we want to append this playlistArticle to the playlistCards section we selected at the top of our code.
  playlistCards.appendChild(playlistArticle);

  /* ***BELOW CODE IS GOING TO BE FOR ALL LIKE BUTTON FUNCTIONALITY *** */

  const likeImg = playlistArticle.querySelector(".like-img"); //fetch the likeImg tag so that we can change the icon when user clicks it
  const likeCount = playlistArticle.querySelector(".like-count"); //fetch the p tag that contains the like count because we need to update it when user likes song

  //let us add an event listener to the likeImg which is the heart. Whenever it is clicked we want to toggle the kind of heart that is being displayed. We are attaching listener inside this loop because if we do it outside the playlist card html might not even be rendered yet.
  likeImg.addEventListener("click", (event)=>{

    event.stopPropagation(); // prevent modal open. Event propogation stops bubbling which is when an event gets sent up to the parent and triggers it too aka the modal open.
    if(likeImg.src.includes("unlikedHeart")){ //if it is not liked
      likeImg.src = "assets/img/likedHeart.svg"; //changed it to liked logo
      card.like_count++; //update the like count
      likeCount.textContent = card.like_count; //and change the textContent of likeCount p tag since it increased
    }

    else{ //if it is liked
      likeImg.src = "assets/img/unlikedHeart.svg"; //change icon to unliked
      card.like_count--; //decrease the like count
      likeCount.textContent = card.like_count; ///and update the p tag accordingly
    }


  })
}

//function populates the playlistcard section by iterating over data and calling our createPlayListCard helper function on each piece of data.

function populatePlaylistCardSection(){
   //being a little extra defensive here if the data is not null also make sure if there even is any data
  if(!data || data.length === 0){ //if there ISNT data then we just want to add a p tag displaying the error message
    let emptyData = document.createElement('p');
    emptyData.textContent = 'No playlists added!';
    playlistCards.appendChild(emptyData); 
  }

  else{
    data.forEach((card) => {
      createPlaylistCard(card);
    })
  }   
}


populatePlaylistCardSection();

/* BELOW Logic WILL HANDLE SHUFFLING THE SONGS */

const shuffleBtn = document.querySelector(".shuffle-btn"); //get the shuffleBtn so we can add an eventlistener to it

//Function has inside is an event listener so that when shuffle is clicked songs are shuffled by using sort to randomize actual data first clearing whats on the front end and re rendering it with helper function
function randomizeSongs(){

  shuffleBtn.addEventListener("click", () =>{
    
    currentPlaylistData.songs.sort(() => Math.random() - 0.5);
    songList.innerHTML = "";
    currentPlaylistData.songs.forEach((song) => {
      createSongBanner(song);
    })
  })
}

randomizeSongs(); 


