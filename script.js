// Floating blob follows cursor slightly
const blob = document.querySelector(".blob");

document.addEventListener("mousemove", (e) => {
  blob.style.transform = `translate(${e.clientX / 10}px, ${e.clientY / 10}px)`;
});

// Ripple effect on click
document.addEventListener("click", function (e) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");

  ripple.style.left = e.clientX + "px";
  ripple.style.top = e.clientY + "px";
  ripple.style.width = ripple.style.height = "20px";

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
});
