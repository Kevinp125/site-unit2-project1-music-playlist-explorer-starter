const randomIndex = Math.floor(Math.random() * data.length); //getting a random index from our array  by doing math.random (number 0-1) multiplying by our array length to get it in range and then flooring/

function createFeatureSongsList(songs){
  
  const songList = document.querySelector(".feature-playlist-songs"); //grabbing the <ul> tag which is the parent of the list of songs so we can append songs to it.

  songs.forEach((song) => {

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

  })
}

function featurePlaylistLoad(randomIdx){
  const featArt = document.querySelector("#feature-playlist-art");
  const featName = document.querySelector("#feature-playlist-name");
  const songList = document.querySelector(".feature-playlist-songs");
  
  featArt.src = data[randomIdx].playlist_art;
  featName.textContent = data[randomIdx].playlist_name;

  songList.innerHTML = " ";

  createFeatureSongsList(data[randomIndex].songs);

}

featurePlaylistLoad(randomIndex);