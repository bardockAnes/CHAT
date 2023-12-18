import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();






const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
 
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'it working',
    })
});

let messageHistory = []; // Array to store the message history



app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        async function main() {
        messageHistory.push({"role": "user", "content": `${prompt}`});
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "You are a helpful assistant, Continuosly engage in dialogue based on previous questions and answers"},
                ...messageHistory 
              ],
            temperature: 0,
            max_tokens: 35,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        const assistantResponse = response.choices[0].message.content;
        messageHistory.push({"role": "assistant", "content": assistantResponse});

        console.log("Message history:", messageHistory);
        res.status(200).send({ 
            bot: response.choices[0].message.content
        })
       
       
    }
    main();
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
        
    }
})

app.listen(5000,() => console.log('Server is runing on port http://localhost:5000'));



