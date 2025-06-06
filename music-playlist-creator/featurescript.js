const randomIndex = Math.floor(Math.random() * data.length); //getting a random index from our array  by doing math.random (number 0-1) multiplying by our array length to get it in range and then flooring/

console.log(data);

function featurePlaylistLoad(randomIdx){
  const featArt = document.querySelector("#feature-playlist-art");
  const featName = document.querySelector("#feature-playlist-name");

  console.log(featArt);
  console.log(featName);
  
  featArt.src = data[randomIdx].playlist_art;
  featName.textContent = data[randomIdx].playlist_name;
}

featurePlaylistLoad(randomIndex);