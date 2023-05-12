for (const element of document.getElementById('navigation').getElementsByTagName('a')) {
  if (element.href === document.URL) { element.classList.add('active') }
}

window.onload = () => {
  setTimeout(() => {
    document.getElementById('navigation-bar').classList.remove('expand')
  }, 1000)
}
