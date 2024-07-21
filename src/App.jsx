import './App.css'
import React, { useState } from 'react';
import OpenAI from "openai";

const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHotdog, setIsHotdog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [base64Image, setBase64Image] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0AQMAAADxGE3JAAAABlBMVEW6vsHp7vHTREENAAACWUlEQVR42u3aMXKsMAyAYTIUlByBo3A0fDQfxUdw6cKPPGZiE7/FBZKyO3nJv81u840Gr5CR8PBu+sQBj8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px/9yvw/Xj8SHjl8E3nX8JPAdPrzd973L7y9A3+eu32771PXrbR+f4pfbPjzFz7e9N/teTgj82MtJo3cTHv86/1gvnSx/0+P9LowfHgu+0LthNPnLhiHz+2XDkPl82TBkPl0KvtwvBh+NPlwKtiz/Ol4cfzJ4/338H6NPWl9uwLjZ4ofVFt8vtvgl8WT51/jyrY2/l+vQ5m8uhUx7/6VSyLQ+lkKmrR+hFDJt/fLlh7Z+unIh2vpd/wjl/rHXRBbuv3X/yrX1Ue6fqbY+yv071tZH6FNZ/lBbF+Xzi6+th/L5ydXWQenP3lXnP1rRUe3z2fvqfDp7X2H+/dtKbtr44exddd6fvafOu7N31PnP4YXK10nEqPT5c/gh9ns7iVD4vDWThE3u09pMAlZ5/sWlmQQs8vhhbgZRs9z7qRlETXLvxmYQpfDHn54N/ojdDKLk/oi9RYM/Yq/B4I/Yizf4I/bsWi/MvyP2NBjiu4fpp9QPNr8bfTb6ZPTR6IPRe6N3Fy99/jPF340+G30y+mj0wej9z/PzL79+PPn333jeX3y5n1k/ix8E6/dm9Mb3v+Fb+uW2j0/x622fjOcfrOcnrOc3uudHRoH3xvMr8ebyc34Jj8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px7/O/wW0UI6aaMYEhQAAAABJRU5ErkJggg==');
  const [imageBorder, setImageBorder] = useState("gray");

  async function detectHotdog() {
    setIsLoading(true);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Does this image contain a hotdog? Only respond with true or false and nothing else. Do not add any explanations. If you are unsure, respond with false." },
            {
              type: "image_url",
              image_url: {
                "url": base64Image,
              },
            },
          ],
        },
      ],

    });
    console.log(response.choices[0]);
    if (response.choices[0].message.content.toLowerCase() === "true") {
      setIsHotdog(true);
      setImageBorder("green");
    } else {
      setIsHotdog(false);
      setImageBorder("red");
    }
    setIsLoading(false);
  }

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setImageBorder("gray");
    setIsHotdog(null);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => setBase64Image(reader.result);
  };

  function reset() {
    setSelectedImage(null);
    setIsHotdog(null);
    setIsLoading(false);
    setBase64Image(null);
    setImageBorder("gray");
    document.getElementById('imageInput').value = null;
  }

  return (
    <div className="mainContainer">
      <h1>Hot Dog Detector</h1>
      <div className="imagePane">
        <div className="imageContainer">
          <img
            style={{
              maxWidth: "500px",
              maxHeight: "500px",
              border: `5px solid ${imageBorder}`,
              display: "block",
            }}
            src={base64Image}
            alt="Selected Image"
          />
          {isHotdog !== null && <div className="overlay">{isHotdog ? "HOTDOG!" : "NOT HOTDOG!"}</div>}
        </div>
      </div>
      <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={detectHotdog} disabled={!selectedImage || isLoading}>
        {isLoading ? 'Detecting...' : 'Detect Hotdog'}
      </button>
      <button onClick={reset}>Reset</button>
      {isHotdog !== null && (isHotdog ? <p>This image contains a hotdog!</p> : <p>This image does not contain a hotdog.</p>)}
    </div>
  )
}

export default App
