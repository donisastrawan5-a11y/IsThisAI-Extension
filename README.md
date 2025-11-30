# IsThisAI?

IsThisAI? 🤖
(Because honestly, it’s getting really hard to tell these days)

Let's be real: We've all read that one email, article, or student essay that sounded just a little bit too soulless. Too perfect. Too... robot.

IsThisAI? is a chrome extension born out of that paranoia. It's a tool designed to give you a "gut check" on whether the text you're reading was written by a human with blood in their veins or a large language model predicting the next token.

Whether you're a teacher tired of grading ChatGPT, or just a skeptic browsing the web, this tool is your new best friend.

🧐 What does it actually do?
It doesn't just flip a coin. It analyzes text directly in your browser to flag potential AI generation.

Right-Click & Truth Check: Highlight text anywhere, right-click, and ask the magic question. No tab switching needed.

The "Vibe Check" Meter: We give you a confidence score. It's not just "Yes/No"—it tells you how sure it is.

The "Why": It doesn't just judge; it explains. If it thinks something is AI, it points out specific markers (like suspicious sentence structures or lack of human "messiness").

⚙️ How it works (The non-boring version)
Under the hood, this isn't black magic. It uses a heuristic-based detection engine. Basically, it looks for things that humans do naturally but AI struggles to fake:

Chaos: Humans are inconsistent. We use slang, contractions, and weird sentence lengths.

Vocabulary: AI loves big, formal words used in weirdly safe contexts. We look for that "corporate robot" tone.

Patterns: If the text structure is mathematically perfect, it’s probably not human.

🛠 Installation (Beta)
Okay, look, we're in Beta (v0.1.0). It's MVP season. So you can't just click "Add to Chrome" from the store yet. You gotta get your hands dirty:

Clone this repo (You know the drill).

Run npm install to grab the dependencies.

Run npm run dev to build it.

Open Chrome, go to chrome://extensions, turn on Developer Mode (top right), and load the unpacked extension from the .output/chrome-mv3 folder.

Boom. You're in.

🚀 How to use it
The Lazy Way (Right-Click):

See suspicious text on a website.

Highlight it.

Right-click -> "Check with IsThisAI 🤖".

Judge the result.

The Manual Way (Popup):

Click the little robot icon in your toolbar.

Paste the text (aim for at least 50 characters, or the detector gets confused).

Hit Analyze.

⚠️ A Note on Accuracy (Please Read)
This tool is a guide, not a judge. Please don't fail a student or fire an employee solely based on this extension.

It works best on text longer than 100 characters.

It can be wrong. Sometimes humans write like robots (lawyers, I'm looking at you).

Advanced prompting can sometimes trick it.

💻 Tech Stack
Built with love, caffeine, and:

WXT Framework (The backbone)

React + TypeScript (Because we like type safety)

Chrome Extension API

🗺 The Roadmap (Dream Big)
Things I want to build before my coffee runs out:

[ ] Image Detection (Because Midjourney is getting too good)

[ ] Audio Detection (Deepfakes are scary)

[ ] Smarter ML Models (Moving beyond heuristics)

[ ] Fact-Checking (The holy grail)

🤝 Contributing
Found a bug? Have a better detection algorithm? Want to fix my typos? PRs are welcome. Let's keep the internet human, one commit at a time.

License
MIT. Go wild.

Built by Doni Sastrawan. Yes, I wrote this README myself. The irony would be too much otherwise.
