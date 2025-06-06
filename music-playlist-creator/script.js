
//all html elements we grabbed below
const modal = document.getElementById("modal"); //get the modal by its id
const modalCloseBtn = document.getElementById("modal-close");
const playlistCards = document.querySelector(".playlist-cards"); //getting the playlist-cards section from the HTML dom so we can append playlist articles to it.
const songList = document.getElementById("song-list");
const formOverlay = document.getElementById("form-Overlay");
const formCloseBtn = document.getElementById("form-close");
const formContainer = document.getElementById("form-container");
const addPlaylistbtn = document.getElementById("add-song-link");
const formSongHeader = document.getElementById("form-song-header");
const sortDropdown = document.getElementById("sort-dropdown");

//Global flags and variables used
let currentPlaylistData = null; // this is a variable that we will update inside of openModal so that we can use this info for our randomize song section
let editMode = false;
let editingPlaylistIdx = null //global variables so we can resuse submit form for editing functionality
let searchMode = false;

//calling this function up top because all playlist cards should be rendered ASAP. As soon as page loads
populatePlaylistCardSection();

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

//function closes the modal
modalCloseBtn.onclick = function() { //attached onclick event handler to the close button when clicked the modals display will be set to none again
  modal.style.display = "none";
}

//function closes form modal
formCloseBtn.onclick = function() {
  formOverlay.style.display = "none";
}

//function closes modal if user clicks outside of window
window.onclick = function(event) { 
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//takes care of when user clicks the add playlist button. Pops the modal up when button is clicked with empty values
function addPlaylist(){
    addPlaylistbtn.addEventListener("click", () =>{
    formSongHeader.style.display = "block";
    formOverlay.style.display = "block";
    formContainer.querySelector('input[name="playlistName"]').value = " ";
    formContainer.querySelector('input[name="playlistAuthor"]').value = " ";
  })

}

addPlaylist();

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
          <img class = "edit" src="assets/img/edit-icon.svg" alt="Edit" width = 40px height = 40px>
          <img class = "trash-can" src="assets/img/trash-bin.svg" alt="Trashbin" width = 40px height = 40px>
          <img class = "like-img" src="assets/img/unlikedHeart.svg" alt="Unliked heart image" width = 35px height = 35px>
          <p class = "like-count">${card.like_count}</p>
        </div>
    </div>
  `

  //finally we want to append this playlistArticle to the playlistCards section we selected at the top of our code.
  playlistCards.appendChild(playlistArticle);

  /* ***BELOW CODE IS GOING TO BE FOR ALL CARD BUTTON FUNCTIONALITY *** */

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
  
  //get the trashBtn
  const trashBtn = playlistArticle.querySelector(".trash-can");

  //add an event listener for when its clicked
  trashBtn.addEventListener("click", (event) => {
    event.stopPropagation(); //do this again so modal isnt opened
    const cardIdx = data.findIndex((d) => d.playlistID === card.playlistID); //cant use standrad indexOf on objects. Need to use findIndex and pass it callback so it can iterate through each object knowing what and how to compare
    data.splice(cardIdx, 1);//once we have index where item is at just remove it with splice
    populatePlaylistCardSection(); //re render the card section since we deleted something.
  })

  //logic for edit btn on cards

  const editBtn = playlistArticle.querySelector(".edit")

  editBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    editingPlaylistIdx = data.findIndex((d) => d.playlistID === card.playlistID);
    editMode = true; //update our flags so we know we are in edit mode

    formOverlay.style.display = "block"; //show the form
    formSongHeader.style.display = "none";

    formContainer.querySelector('input[name="playlistName"]').value = card.playlist_name;
    formContainer.querySelector('input[name="playlistAuthor"]').value = card.playlist_author;

    // Clear existing song inputs
    songContainer.innerHTML = "";
  })

}

//function populates the playlistcard section by iterating over data and calling our createPlayListCard helper function on each piece of data.

function populatePlaylistCardSection(filteredData){
  playlistCards.innerHTML = "";

   //being a little extra defensive here if the data is not null also make sure if there even is any data
  if(!data || data.length === 0){ //if there ISNT data then we just want to add a p tag displaying the error message
    let emptyData = document.createElement('p');
    emptyData.textContent = 'No playlists added!';
    playlistCards.appendChild(emptyData); 
  }

  //if our searchMode flag is true it means search function found something and we need to use filtered data to re-render not just the full data array 
  else if(searchMode === true){
    filteredData.forEach((card) => {
      createPlaylistCard(card);
    })

    searchMode = false;
  }

  //if searchMode isnt on just popoulate page with all playlists
  else{
    data.forEach((card) => {
      createPlaylistCard(card);
    })
  }   
}


/* BELOW Logic WILL HANDLE SHUFFLING THE SONGS */

const shuffleBtn = document.querySelector(".shuffle-btn"); //get the shuffleBtn so we can add an eventlistener to it

//Below randomizes songs... Event listener so that when shuffle is clicked songs are shuffled by using sort to randomize actual data first clearing whats on the front end and re rendering it with helper function
shuffleBtn.addEventListener("click", () =>{
    currentPlaylistData.songs.sort(() => Math.random() - 0.5); //Math.rand() gives number 0-1 so subtracting 0.5 gives us 50/50 chance of number being (-) or (+). How sort works is it gets - numbers and puts them back and + forward. It will go through songs and randomly place them.
    songList.innerHTML = "";
    currentPlaylistData.songs.forEach((song) => {
      createSongBanner(song);
    })
})

/* *** HANDLING CRUD OPERATIONS WITH THIS CODE *** */

const songContainer = document.getElementById("song-container");
const addSongBtn = document.getElementById("add-song-btn");

//function adds 4 new inputs for a new song's information when user clicks "Add Song" on form
function addSongGroupToForm(){

  const newSong = document.createElement("div");
    newSong.innerHTML = `
    ---------
    <div class="song-input-group">
      <label>Title</label>
      <input type="text" name="songTitle[]" required>
    </div> 

    <div class="song-input-group">
      <label>Artist</label>
      <input type="text" name="songArtist[]" required>
    </div> 

    <div class="song-input-group">
      <label>Album</label>
      <input type="text" name="songAlbum[]" required>
    </div> 

    <div class="song-input-group">
      <label>Time</label>
      <input type="text" name="songTime[]" required>
    </div>
  `;

  songContainer.insertBefore(newSong, addSongBtn); //insert the newSong before the button so button is always towards bottom

  
  
}

addSongBtn.addEventListener("click", () => {
  addSongGroupToForm();
})

//below event listenr waits for add playlist form to be submitted
formContainer.addEventListener("submit", (event) =>{
  event.preventDefault(); 
  
  const formData = new FormData(formContainer); //creating object using js built in feature. Pass it form after submit and variable holds all information

  const playlistName = formData.get("playlistName"); //since i gave inputs name in html now I can use get method by their name and store it in variable
  const playlistAuthor = formData.get("playlistAuthor");

  //below is getting all the information from the song or songs if users added more than one
  const songTitles = formData.getAll("songTitle[]");
  const songArtists = formData.getAll("songArtist[]");
  const songAlbums = formData.getAll("songAlbum[]");
  const songTimes = formData.getAll("songTime[]");

  //just map through the songTitles array and keep track of index and then put each thing back into songs as an array of song objects
  const songs = songTitles.map((title, index) => ({
    title,
    artist: songArtists[index],
    album: songAlbums[index],
    time: songTimes[index],
    "song_art": "assets/img/song.png",
  }));

  //if we are in edit mode don't make a new object just edit current values
  if(editMode && (editingPlaylistIdx !== null)){
    data[editingPlaylistIdx].playlist_name = playlistName;
    data[editingPlaylistIdx].playlist_author = playlistAuthor;
    
  }
  else{
      const newPlaylist = {
      "id": data.length+2,
      "playlist_name": playlistName,
      "playlist_author": playlistAuthor,
      "playlist_art": "assets/img/playlist.png",
      "like_count": "0",
      "date_added": new Date().toISOString(), //this line creates the current date fir sirtung purposes
      "songs": songs,
    }

    data.push(newPlaylist);

  }

  //once any changes are made whether it be edit or a new card re-render the playlists
  populatePlaylistCardSection();
  formOverlay.style.display = "none";

})


//Below is search functionality

searchBar = document.getElementById("search-bar");
submitBtn = document.getElementById("submit-button");
clearBtn = document.getElementById("clear-button")


//search function looks through the data and filters it based on the playlist name or author user enters
function search(value){

  let foundPlaylist = null;
  foundPlaylist = data.filter((playlist) => {
      return(playlist.playlist_name.toLowerCase().includes(value.toLowerCase()) ||
              playlist.playlist_author.toLowerCase().includes(value.toLowerCase()))
  });

  //if filter returns an array with length it means we found results
  if(foundPlaylist.length > 0){
    searchMode = true;
    populatePlaylistCardSection(foundPlaylist);
  }
  else{
    playlistCards.innerHTML = `<p>No results found</p>`;
    
  }

}

//adding event listeners to the enter keypress as well as clicking submit button once that happens we want to call search function
searchBar.addEventListener("keypress", (e) => {
  if(e.key === 'Enter'){
    search(e.target.value);
  }
})

submitBtn.addEventListener("click", () =>{
  search(searchBar.value);
})

//add event listner to clear button when we clear we just want to bring all the cards back
clearBtn.addEventListener("click", () =>{
  searchBar.value = "";
  populatePlaylistCardSection();
})

//below code is all sorting logic

sortDropdown.addEventListener("change", (e) => {

  const sortOption = e.target.value;

  if(sortOption === "playlist-name"){
    sortByName()
  }

  else if(sortOption === "like-count"){
    sortByLikes()
  }

  else if(sortOption === "date-added"){
    sortByDateAdded()
  }

})

//sorts by playlist name from A-Z
function sortByName(){
  const sortedByName = data.sort((a,b) => {
    if(a.playlist_name > b.playlist_name) return 1;
    else if(a.playlist_name < b.playlist_name) return -1;
    else return 0;
  })

  populatePlaylistCardSection();
}

//sorts by likes (highest-lowest)
function sortByLikes(){
  const sortedByLikes = data.sort((a,b) => {
    return b.like_count-a.like_count;
  })

  populatePlaylistCardSection();
}

//sorts by Date added (recent to oldest)
function sortByDateAdded(){
  const sortedByDateAdded = data.sort((a,b) => {
    if(a.date_added > b.date_added) return -1;
    else if(a.date_added < b.date_added) return 1;
    else return 0;
  })

  populatePlaylistCardSection();
}