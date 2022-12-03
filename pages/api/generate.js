import { Configuration, OpenAIApi } from 'openai';

/* we’re using the OpenAI JS library to setup the API easily. But you’ll see here we need a process.env.OPENAI_API_KEY. This will come from our .env file which is a file that holds any secret information that you don’t want to push to GitHub by accident. */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = 
`
Write me a detailed and actionable step-by-step strategy plan with real examples by James Clear from Atomic Habits and his 30 Days to Better Habits Workbook for the following goal:

Goal: I want to write a book

Identity-Based Habit: If you want to write a book, you should focus on becoming the type of person who writes every day. I want to become a Writer.

Habit to focus on: Writing

Two-Minute Rule: “Work on my novel” becomes “write one sentence each day.”

Implementation Intention: When, where, and how you're going to complete the habit. For example, I will write for 10 minutes at 8 a.m in my studio every day.

Temptation Bundling: I will only drink coffee when I write.

Commitment Devices: Publish something that I've written each week no matter what.

Immediate Reward: Go for a walk.

Habit Tracking: track how many pages you wrote each day by adding a hairpin to a container after finishing each page.


Goal:
`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    /* model — Which is the model type we want to use. As of today, text-davinci-003 is the most advanced model. */
    model: 'text-davinci-003',
    /* prompt — This is the prompt we’re passing, just like we’d do in Playground. In this case, we pass it basePromptPrefix which is an empty string right now (we’ll use it later) and req.body.userInput which will be the input that the user enters in the textarea on the frontend that we send to this API function. */
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    /* temperature — We already know about this thing from Playground. You can play with it more later based on your use case. */
    temperature: 0.8,
    /* max_tokens — I’m setting this to 250 for now which is about 1,000 characters total. If you’re dealing with longer prompts + longer outputs, you can increase this number later. But for testing purposes better to keep it lower. I’ll definitely increase this later because I want longer blog posts generated for myself. */
    max_tokens: 600,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;