import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('')

  /* I created a state variable for isGenerating. This will let us easily create a loading state later so we can tell our users to wait for the OpenAI API to reply. Then, I create apiOutput — this will be where we story the output of the API we want to show the user. */
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  /* I call setIsGenerating(true) to set the loading state to true */
  const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  /* I do a simple fetch to our API — notice the route I use: /api/generate. NextJS automatically creates this route for us based on the structure of our directory: api/generate.js */
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  /* From there, I convert the response to JSON by doing await response.json() and then pull out output. Note: I’m using object destructing here */
  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  /* Finally, I use setApiOutput to actually set apiOutput with the actual text that GPT-3 output. */
  setApiOutput(`${output.text}`);
  /* At the bottom of the function, I do setIsGenerating(false) because that’s when we’re all done with the API and can set the loading state to false */
  setIsGenerating(false);
}

  /* call setUserInput and sets it to whatever is in the textarea. This way, the value of userInput will always be updated with whatever is in the textarea */
  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Habit Planner: Atomic Habits</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Change your habits with Atomic Habits</h1>
          </div>
          <div className="header-subtitle">
            <h2>Write a goal you want to achieve and get actionable steps from Atomic Habits to help you get started.</h2>
          </div>
        </div>

        <div className="prompt-container">
          <textarea 
          placeholder="start typing here: ex. I want to read a book, I want to learn to code, I want to write a book" 
          className="prompt-box"
          /* we set the value of the textarea to userInput which means that whatever is in the userInput variable we’re going to show in the textarea */
          value={userInput}
          /* onChange parameter — so, whenever the user types, it’ll call onUserChangedText */
          onChange={onUserChangedText}
          />
          {/* Oneeeeeee more thing to add really fast — a loading state! We already have the loading state saved in isGenerating which will be true if we’re waiting on the API and false if we’re not. */}
          <div className="prompt-buttons">
            {/* So, if isGenerating is true we use the generate-button loading class which will reduce the opacity of our button. If it’s false, we’ll use the normal generate-button class which keeps it nice and bright. */}
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              {/* If isGenerating is true, we show a loading animation and if it’s false we just show the word “Generate”! Simple. */}
              <div className="generate">
              {isGenerating ? <span class="loader"></span> : <p className="text-black">Generate</p>}
              </div>
            </a>
          </div>
          {/* I just display the output using {apiOutput} here within a div with the CSS class output-content */}
          {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Plan</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;
