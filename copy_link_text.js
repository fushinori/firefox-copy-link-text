const links = document.getElementsByTagName("a");

for (const link of links) {
  link.addEventListener("dblclick", onDoubleClick);
}

function onDoubleClick(e) {
  const link = e.currentTarget;
  const linkText = link.textContent;
  navigator.clipboard.writeText(linkText);
}
