


import express from "express";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { HfInference } from "@huggingface/inference";
import fs from "fs";
import path from "path";
import dotenv from "dotenv"
import { Mistral } from '@mistralai/mistralai';
dotenv.config(); 

const app = express();
const port = 3000;

app.use(express.json());

// Hugging Face API Setup
const hf = new HfInference(process.env.HuggingFace_API);

// Pinecone setup
const pinecone = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY, 
});



const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const searchAndAnswer = async (query) => {
    const index = pinecone.Index('void2');

    // Generate embedding for the user query
    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HuggingFace_API, 
    });
    const embeddingResult = await embeddings.embedQuery(query);

    // Query Pinecone for similar documents
    const searchResults = await index.query({
        vector: embeddingResult,
        topK: 3,
        includeValues: true,
    });

 
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const directoryPath = decodeURIComponent(path.join(__dirname, 'documents'));

    const contexts = searchResults.matches.map(match => {
        const filePath = path.join(directoryPath, match.id);
        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
    }).join('');

    console.log(contexts);

    
    const chatPrompt = `Use the following context to provide a concise answer to the question.\nContext: ${contexts}\nQuestion: ${query}`;



      

    const prompts = `Hello Mistral AI, you are a helpful assistant. Please provide a specific and concise answer based on the context: ${contexts}. Answer the user's question: ${query}`;

    const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{role: 'user', content: prompts}]
    });
    
    console.log('Chat:', chatResponse.choices[0].message.content);
    return chatResponse.choices[0].message.content;

    
};

app.post('/query', async (req, res) => {
    const { question } = req.body;

    try {
        const answer = await searchAndAnswer(question);
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
