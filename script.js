const inputText = document.getElementById("textInput");
const correctBtn = document.getElementById("correctBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const originalText = document.getElementById("originalText");
const correctedText = document.getElementById("correctedText");

correctBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();

    if (!text) {
        alert("Please enter a sentence.");
        return;
    }

    loading.classList.remove("hidden");
    result.classList.add("hidden");
    correctBtn.disabled = true;

    try {
        const response = await fetch("/api/correct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI correction failed.");
        }

        originalText.textContent = data.original;
        correctedText.textContent = data.corrected;

        result.classList.remove("hidden");

    } catch (error) {
        console.error("API Error:", error);
        alert("Unable to connect to the AI correction API.");
    } finally {
        loading.classList.add("hidden");
        correctBtn.disabled = false;
    }
});

clearBtn.addEventListener("click", () => {
    inputText.value = "";
    result.classList.add("hidden");
});
