const topbar = document.getElementById('topbar')

let currPos = window.scrollY
document.addEventListener('scroll', () => {
  if (window.scrollY < currPos) {
    topbar.classList.add('show')
  } else {
    topbar.classList.remove('show')
  }
  currPos = window.scrollY
})
