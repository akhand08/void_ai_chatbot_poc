# AI Chatbot PoC with LangChain and Mistral AI

## Overview

This project demonstrates a proof of concept (PoC) for an AI chatbot that answers questions about a company, its members, and its services based on a PDF document. The PDF, which contains detailed information about the company, is manually added to the system. The document is then vectorized using Pinecone, and user queries are processed with Mistral AI to provide responses based on vector matching with the content. The entire solution is built using the LangChain framework, Express.js for the backend, and Hugging Face for embeddings.

## How It Works

1. **PDF Collection**: A PDF containing information about the company, its members, and services is manually collected from documents and added to the system.
2. **Vectorization**: The content of the PDF is processed and vectorized using Pinecone. This converts the document into searchable vectors that can be compared with user queries.
3. **Question Handling**: When a user asks a question, the query is embedded using Hugging Face embeddings and vectorized. The system matches the query with the most relevant sections of the PDF in Pinecone.
4. **AI Response**: Mistral AI is used to generate responses based on the matched vectors and the content in the PDF.


## Technologies Used

- **Pinecone**: For vector database and efficient search.
- **Mistral AI**: For language model-based question answering.
- **Hugging Face**: For generating embeddings from the PDF content and user queries.
- **LangChain**: For building the AI agent and managing the pipeline.
- **Express.js**: For handling server operations and API endpoints.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/akhand08/void_ai_chatbot_poc.git
