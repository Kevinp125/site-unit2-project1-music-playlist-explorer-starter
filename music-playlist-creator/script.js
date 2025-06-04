const modal = document.getElementById("modal"); //get the modal by its id
const span = document.getElementsByClassName("close")[0]; //getting the close span remember that getting elementsByClassName returns a collection so we index into zero to get first instancce of close button

function openModal() { //mighgt also need to pass object with modal details
  //will need to fill this out at some point with all the modal information by getting elements by id i believbe and populating html tags
  modal.style.display = "block";
}

span.onclick = function() { //attached onclick event handler to the close button when clicked the modals display will be set to none again
  modal.style.display = "none";
}
window.onclick = function(event) { //also attached the onclick handler to the window. If its clicked let us get the event information. If it matches the modal (which is the overlay not the modal-content itself) it means user clicked out of it so hide it again
  if (event.target == modal) {
    modal.style.display = "none";
  }
}