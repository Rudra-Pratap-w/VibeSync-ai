document.addEventListener("DOMContentLoaded", () => {
  const text = "Your mood, your music. Instantly matched for the perfect vibe!";

  const element = document.getElementsByClassName("description-0")[0];

  let index = 0;
  element.innerHTML = "";

  function typewriter() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(typewriter, 30);
    }
  }
  typewriter();
  gsap.from(".title-wrapper", {
    scale: 0,
    delay: 0,
    duration: 1.5,
  });
  gsap.from(".Page-2 h1", {
    opacity: 0,
    duration: 2,
    y: -20,
    scrollTrigger: {
      trigger: ".Page-2 h1",
      scroller: "body",
      start: "top 20%",
      end: "top 30",
      scrub: 3,
      ease: "power3.in",
    },
  });
  gsap.to(".Grid", {
    opacity: 1,
    scale: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".Grid-container",
      scroller: "body",
      start: "top 80%",
      end: "top 50%",
      scrub: "3",
      ease: "power3.in",
      scroller: "body",
    },
  });
});
