// Show the search backdrop and box if the user clicks the search button.
document.getElementById('search').onclick = () => {
  document.getElementById('search-backdrop').style.display = 'block'
  document.getElementById('search-box').style.display = 'block'
}

// Hide the search backdrop and box if the user clicks the cancel button
document.getElementById('cancel-search').onclick = () => {
  document.getElementById('search-backdrop').style.display = 'none'
  document.getElementById('search-box').style.display = 'none'
}

document.getElementById('search-input').oninput = (ev) => {
  // const searchString = ev.target.value
}
