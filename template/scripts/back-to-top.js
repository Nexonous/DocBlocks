document.getElementById('back-to-top').onclick = () => {
  window.scrollTo(0, 0)
}

document.onscroll = () => {
  const element = document.getElementById('back-to-top')
  if (window.scrollY > 100) {
    element.style.display = 'flex'
  } else {
    element.style.display = 'none'
  }
}
