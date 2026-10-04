const sentenceInput = document.getElementById("sentenceInput");
const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");

const loading = document.getElementById("loading");
const result = document.getElementById("result");
const correctedText = document.getElementById("correctedText");
const suggestions = document.getElementById("suggestions");

checkBtn.addEventListener("click", async () => {
    const text = sentenceInput.value.trim();

    if (!text) {
        alert("Please enter a sentence.");
        return;
    }

    loading.classList.remove("hidden");
    result.classList.add("hidden");
    checkBtn.disabled = true;

    try {
        const response = await fetch("/api/correct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI correction failed.");
        }

        correctedText.textContent = data.corrected;

        suggestions.textContent = "";

        result.classList.remove("hidden");

    } catch (error) {
        console.error("API Error:", error);

        alert(
            "Unable to connect to the AI correction API.\n\n" +
            "Please try again."
        );

    } finally {
        loading.classList.add("hidden");
        checkBtn.disabled = false;
    }
});

clearBtn.addEventListener("click", () => {
    sentenceInput.value = "";

    correctedText.textContent = "";
    suggestions.textContent = "";

    result.classList.add("hidden");
    loading.classList.add("hidden");
});
