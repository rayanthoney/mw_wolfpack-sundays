// Control image Carousel
function startCarousel() {
  let activeImage = 0;
  const images = document.querySelectorAll("#carousel img");

  function cycleImage() {
    if (!images[activeImage]) {
      clearInterval(intervalId);
      return;
    }
    //Loops the carousel
    images[activeImage].classList.remove("active");
    activeImage = (activeImage + 1) % images.length;
    images[activeImage].classList.add("active");
  }

  let intervalId = setInterval(cycleImage, 3000);
}
// Handle Edit Requests
function editItem(is, name, description) {
  document.getElementById("updatedId").value = id;
  document.getElementById("updateName").value = name;
  document.getElementById("updateDescription").value = description;
  document.getElementById("updateForm").action = `/item/update/${id}`;
}

// Handle Delete Requests
async function deleteItem(id) {
  try {
    const response = await fetch(`http://localhost:3500/item/delete/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      location.reload();
    } else {
      console.log("failed to delete item");
    }
  } catch (error) {
    console.log("error occurred:", error);
  }
}

// Handle Errors From Server if unable to write data (optional)
function checkForError() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("error")) {
    alert("Validation failed. Name and description are required.");
  }
}

// Start the carousel and check for errors when the page loads
window.onload = function () {
  startCarousel();
  checkForError();
};

function editItem(id, name, description) {
    // Populate the hidden field with the id
    document.getElementById("updateId").value = id;
  
    // Populate the form fields with the existing item's data
    document.getElementById("updateName").value = name;
    document.getElementById("updateDescription").value = description;
  
    // Update the form's action attribute
    document.getElementById("updateForm").action = `/item/update/${id}`;
  }
  
  async function deleteItem(id) {
    try {
      const response = await fetch(`http://localhost:3000/item/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Item deleted successfully');
        location.reload();
      } else {
        console.log('Failed to delete item');
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }
