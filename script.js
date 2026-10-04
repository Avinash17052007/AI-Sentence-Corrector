const sentenceInput = document.getElementById("sentenceInput");
const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const correctedText = document.getElementById("correctedText");
const suggestions = document.getElementById("suggestions");

checkBtn.addEventListener("click", async () => {
    const sentence = sentenceInput.value.trim();

    if (!sentence) {
        alert("Please enter a sentence.");
        return;
    }

    loading.classList.remove("hidden");
    result.classList.add("hidden");

    try {
        const response = await fetch("http://localhost:5000/api/correct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: sentence
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "API request failed");
        }

        correctedText.textContent = data.corrected;

        suggestions.innerHTML = "";

        result.classList.remove("hidden");

    } catch (error) {
        console.error("Error:", error);

        correctedText.textContent =
            "Unable to connect to the AI correction API.";

        suggestions.textContent =
            "Make sure the backend server is running.";

        result.classList.remove("hidden");

    } finally {
        loading.classList.add("hidden");
    }
});

clearBtn.addEventListener("click", () => {
    sentenceInput.value = "";

    result.classList.add("hidden");
    loading.classList.add("hidden");

    correctedText.textContent = "";
    suggestions.innerHTML = "";
});