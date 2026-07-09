// === ABOUT BUTTON NAVIGATION ===
document.getElementById("aboutBtn").addEventListener("click", () => { // finds the element with id="aboutBtn" and adds a click event
  window.location.href = "about.html"; // when clicked, it redirects the browser to about.html
});


// === SELECTING ELEMENTS ===
const menuToggle = document.querySelector(".menu-toggle"); // selects the hamburger icon
const navMenu = document.querySelector("nav ul"); // selects the navigation menu (<ul> inside <nav>)

// === TOGGLE MENU ON HAMBURGER CLICK ===
menuToggle.addEventListener("click", (event) => { // listens for clicks on the hamburger icon
  event.stopPropagation(); // prevents the click from bubbling up to document (so it won’t trigger close)
  navMenu.classList.toggle("open"); // adds/removes the "open" class to show or hide the nav menu
});

// === CLOSE MENU WHEN CLICKING OUTSIDE ===
document.addEventListener("click", (event) => { // listens for clicks anywhere on the page
  const isClickInsideMenu = navMenu.contains(event.target); // checks if the click was inside the nav
  const isClickOnToggle = menuToggle.contains(event.target); // checks if the click was on the hamburger icon

  if (!isClickInsideMenu && !isClickOnToggle) { // if click is outside both menu and toggle
    navMenu.classList.remove("open"); // close the nav menu
  }
});

// === CLOSE MENU WHEN A NAV LINK IS CLICKED ===
const navLinks = document.querySelectorAll("nav a"); // selects all navigation links
navLinks.forEach(link => {
  link.addEventListener("click", () => { // adds click listener to each nav link
    navMenu.classList.remove("open"); // closes the menu when a link is clicked
  });
});


// === HOBBIES MODAL HANDLER ===
const cards = document.querySelectorAll('.hobbies-card'); // selects all hobby cards
const modalOverlay = document.getElementById('modalOverlay'); // selects the modal overlay (the dark background)
const modalImg = document.getElementById('modalImg'); // selects the image inside modal
const modalTitle = document.getElementById('modalTitle'); // selects the modal title text
const modalDesc = document.getElementById('modalDesc'); // selects the modal description text
const modalExtra = document.getElementById('modalExtra'); // selects the container for extra content
const closeModalBtn = document.getElementById('closeModal'); // selects the modal close button

cards.forEach(card => { // loops through each hobby card
  card.addEventListener('click', () => { // listens for a click on the card
    const hobbyTitle = card.dataset.hobby; // gets hobby title from data-hobby attribute
    const hobbyDesc = card.dataset.description; // gets description from data-description attribute
    const hobbyImg = card.dataset.img; // gets main image from data-img attribute
    const extraData = JSON.parse(card.dataset.extra || '[]'); // parses additional images/text (from JSON string)

    modalTitle.textContent = hobbyTitle; // sets modal title
    modalDesc.textContent = hobbyDesc; // sets modal description
    modalImg.src = hobbyImg; // sets main image
    modalImg.style.display = "block"; // makes sure the image is visible

    modalExtra.innerHTML = ""; // clears old content in extra section

    // === Add extra items inside modal (text or images) ===
    extraData.forEach(item => { 
      if (item.type === "text") { // if the item is text
        const p = document.createElement("p"); // create a <p> element
        p.textContent = item.value; // set its text
        p.style.marginBottom = "0.5rem"; // small margin between texts
        modalExtra.appendChild(p); // add it to the modal
      } else if (item.type === "image") { // if the item is an image
        const img = document.createElement("img"); // create an <img> element
        img.src = item.value; // set its image source
        img.alt = hobbyTitle; // set alt text for accessibility
        img.style.width = "100%"; // make image fit width
        img.style.marginBottom = "0.5rem"; // space between images
        modalExtra.appendChild(img); // add image to modal
      }
    });

    modalOverlay.classList.add('active'); // shows the modal overlay
    document.body.style.overflow = "hidden"; // disables scrolling behind the modal
  });
});


// === CLOSE MODAL BUTTON ===
closeModalBtn.addEventListener('click', () => { // listens for clicks on close button
  modalOverlay.classList.remove('active'); // hides modal
  document.body.style.overflow = ""; // re-enables scrolling
});

// === CLOSE MODAL WHEN CLICKING OUTSIDE IT ===
modalOverlay.addEventListener('click', (e) => { // listens for clicks on overlay background
  if (e.target === modalOverlay) { // only close if background (not modal content) was clicked
    modalOverlay.classList.remove('active'); // hide modal
    document.body.style.overflow = ""; // re-enable scroll
  }
});




// === CLOSE MODAL (for both hobbies and skills) ===
const existingCloseModal = closeModal; // saves reference to existing closeModal function
closeModal = function() { // redefines closeModal function
  existingCloseModal(); // calls the original closeModal

  setTimeout(() => { // waits for fade-out animation
    if (isSkillModal) { // if modal was a skill type
      modalImg.style.display = "block"; // restore image visibility for hobbies
      isSkillModal = false; // reset flag
    }
  }, 300); // matches animation duration (in ms)
};
