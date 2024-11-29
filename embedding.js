



import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
dotenv.config(); // Ensure .env is loaded for Pinecone API Key
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";




import { Pinecone as PineconeClient } from '@pinecone-database/pinecone';

const uploadDocumentsToPinecone = async () => {
    
    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY, 
        
    });

    
    const index = pinecone.Index("void2");

  

    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HuggingFace_API, 
      });

    // Get the current directory path in ES module format
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    // Ensure the 'documents' folder path is correct and decoded
    const directoryPath = decodeURIComponent(path.join(__dirname, 'documents'));
    

    // Debugging: Log the directory path to check if it's correct
    console.log("Directory Path:", directoryPath);

    // Ensure the directory exists before proceeding
    if (!fs.existsSync(directoryPath)) {
        console.error(`Directory not found: ${directoryPath}`);
        return;
    }

    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        
        const embeddingsResult = await embeddings.embedDocuments([content]);

        
        await index.upsert([{
            id: file,               
            values: embeddingsResult[0], 
        }]);

        console.log(`Uploaded: ${file}`);
    }

    console.log('All documents have been uploaded.');
};

uploadDocumentsToPinecone().catch(console.error);
