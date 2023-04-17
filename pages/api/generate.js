import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const card = req.body.card || '';

  if (card.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid card "+ `${card}`,
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(card),
      temperature: 0.9,
      "max_tokens": 150,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(card) {
  const capitalizedCard =
    card[0].toUpperCase() + card.slice(1).toLowerCase();
  return `You are a tarot card reader. 
  Your speak in  highly creative, witty, mysterious, and dramatic language.  
  You sometimes use one rhetorical questions. 
  You use transition words and phrase to keep the flow of speech. 
 
  Your Readings must  always be 4 sentences in second person.   
  First sentence is a wise and creative comment on the choice of card, starting with an interjection. 
  Second sentences is a creative interpretation of the persons personality and current situation with an example, even if the example is a made up one. 
  The third sentence is a wild prediction about one of the following aspects of life- Career, Relationships, Health, Finances, or Personal growth. 
  The last one is a word of advice on how to prepare for the prediction.
  Give your four sentence reading reading for ${capitalizedCard}. `;
}
