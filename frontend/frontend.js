const urlParams = new URLSearchParams(window.location.search);
const mood = urlParams.get("mood");
document.getElementById(
  "mood-title"
).textContent = `Playlists for "${mood}" vibes`;
fetch(`http://localhost:3000/playlist/${mood}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("Received playlists:", data);

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response format");
    }
    const container = document.getElementById("playlist-container");
    data.forEach((playlist) => {
      if (playlist && playlist.name && playlist.external_urls?.spotify) {
        const div = document.createElement("div");
        div.className = "playlist";
        div.innerHTML = `
                  <h3>${playlist.name}</h3>
                  <img src="${playlist.images[0]?.url}" width="200" />`;
        div.onclick = () => {
          window.open(playlist.external_urls.spotify, "_blank");
        };
        container.appendChild(div);
      } else {
        console.warn("Skipping invalid playlist object:", playlist);
      }
    });
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("playlist-container").textContent =
      "Failed to load playlists.";
  });
function generatePlaylistFromText() {
  const userText = document.getElementById("userInput").value.trim();
  if (!userText) {
    alert("Please describe your mood.");
    return;
  }

  fetch("http://localhost:3000/generate-playlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: userText }),
  })
    .then((res) => res.json())
    .then((data) => {
      const mood = data.mood;
      if (!mood) {
        throw new Error("Mood not returned");
      }

      // Redirect to playlist page with mood in URL
      window.location.href = `playlist.html?mood=${encodeURIComponent(mood)}`;
    })
    .catch((err) => {
      console.error("Error detecting mood:", err);
      alert("Something went wrong. Please try again.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("playlist-generator")
    .addEventListener("click", generatePlaylistFromText);
});
