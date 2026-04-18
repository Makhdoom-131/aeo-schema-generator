// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const outputSection = document.getElementById('outputSection');
const codeOutput = document.getElementById('codeOutput');

// Generate Schema Logic
generateBtn.addEventListener('click', () => {
    const title = document.getElementById('articleTitle').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const date = document.getElementById('pubDate').value;
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert("Please enter at least a title and some Q&A content.");
        return;
    }

    // Parse Q&A pairs using Regex
    const qaRegex = /Q:\s*(.*?)\nA:\s*([\s\S]*?)(?=(?:\nQ:|$))/g;
    const faqs = [];
    let match;

    while ((match = qaRegex.exec(content)) !== null) {
        faqs.push({
            "@type": "Question",
            "name": match[1].trim(),
            "acceptedAnswer": {
                "@type": "Answer",
                "text": match[2].trim()
            }
        });
    }

    if (faqs.length === 0) {
        alert("Could not find Q&A pairs. Please format exactly like:\nQ: Your question?\nA: Your answer.");
        return;
    }

    // Construct JSON-LD Object
    const schemaObject = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": title,
                "author": {
                    "@type": "Person",
                    "name": author || "Unknown Author"
                },
                "datePublished": date || new Date().toISOString().split('T')[0]
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqs
            }
        ]
    };

    // Display Code
    const jsonStr = JSON.stringify(schemaObject, null, 2);
    codeOutput.textContent = `<script type="application/ld+json">\n${jsonStr}\n</script>`;
    
    outputSection.style.display = "block";
    outputSection.scrollIntoView({ behavior: "smooth" });
});

// Copy to Clipboard Logic
copyBtn.addEventListener('click', () => {
    const codeToCopy = codeOutput.textContent;
    
    navigator.clipboard.writeText(codeToCopy).then(() => {
        copyBtn.innerText = "✅ Copied!";
        setTimeout(() => {
            copyBtn.innerText = "📋 Copy Code";
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = codeToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.innerText = "✅ Copied!";
    });
});
