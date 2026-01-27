# EchoOS — AI-Powered Operating System

EchoOS is an innovative AI-powered operating system designed to augment human intelligence. It features persistent memory for long-term data retention, digital twins for personalized digital representations, and autonomous agents for automated task handling. The system provides a seamless interface to interact with your digital self and manage your digital life efficiently.

## Features

- **Persistent Memory**: Store and retrieve memories with AI-enhanced search and recall.
- **Digital Twins**: Create personalized digital representations that learn and adapt to user behavior.
- **Autonomous Agents**: AI agents that perform tasks autonomously, integrated with LangChain for advanced workflows.
- **Glassmorphism UI**: Modern, responsive user interface with animations for an intuitive experience.
- **Real-Time Caching and Queues**: Powered by Redis for fast performance.
- **Vector Database Integration**: Use Pinecone for efficient vector embeddings and similarity searches.
- **API-Driven Backend**: Secure and scalable APIs for memory management, agent interactions, and more.

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend      | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend       | FastAPI, Python 3.13, SQLAlchemy, Pydantic |
| AI/ML         | OpenAI (GPT-4), Pinecone (Vector DB), LangChain (Agent Framework) |
| Database      | PostgreSQL (Metadata), Redis (Caching/Queue) |
| Others        | Uvicorn (for serving backend), Environment variables for configuration |

The project primarily uses TypeScript (68.9%) and Python (27.4%), with CSS and other minor contributions.

## Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher
- PostgreSQL database
- Redis server
- Accounts and API keys for:
  - OpenAI (GPT-4 API)
  - Pinecone (Vector Database)
- Optional: Docker for containerized setup (if preferred)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following variables (replace with your actual values):
   ```
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   DATABASE_URL=postgresql://user:password@localhost:5432/echoos_db
   REDIS_URL=redis://localhost:6379/0
   # Add other variables as needed, e.g., SECRET_KEY for security
   ```

5. Set up the PostgreSQL database (create the database and run any migrations if applicable).

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with necessary variables (e.g., API endpoints):
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   # Add other frontend-specific env vars if required
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   uvicorn app.main:app --reload
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`.

If you encounter terminal issues, run the provided script: `./fix_terminal.sh`.

## Usage

- **Interacting with the System**: Use the web interface to store memories, interact with your digital twin, or deploy autonomous agents.
- **API Endpoints**: Access backend APIs at `http://localhost:8000` (e.g., `/memories` for memory management).
- **Example Workflow**:
  - Store a memory: Send a POST request to `/memories` with JSON payload containing the memory data.
  - Query agents: Use the UI or API to trigger agent actions, leveraging GPT-4 for responses.

For detailed API documentation, refer to FastAPI's auto-generated docs at `http://localhost:8000/docs`.

## Architecture Overview

EchoOS follows a client-server architecture:
- **Frontend**: Handles user interactions with a responsive Next.js app.
- **Backend**: Manages business logic, database interactions, and AI integrations using FastAPI.
- **AI Layer**: Integrates OpenAI for natural language processing, Pinecone for vector storage, and LangChain for agent orchestration.
- **Data Flow**: User inputs → Frontend → Backend APIs → AI Processing → Database/Redis → Response back to user.

## Environment Variables

- **Backend (.env)**:
  - `OPENAI_API_KEY`: API key for OpenAI services.
  - `PINECONE_API_KEY`: API key for Pinecone vector DB.
  - `DATABASE_URL`: Connection string for PostgreSQL.
  - `REDIS_URL`: Connection string for Redis.
- **Frontend (.env.local)**:
  - `NEXT_PUBLIC_BACKEND_URL`: URL to the backend server.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Follow coding standards: Use TypeScript for frontend, Python for backend; adhere to PEP8 and ESLint rules.
4. Commit your changes and submit a pull request with a clear description.

Please open an issue first for major changes.

## Troubleshooting

- **Terminal Issues**: Run `fix_terminal.sh` to resolve common setup problems.
- **Dependency Errors**: Ensure Python and Node versions match prerequisites; reinstall dependencies.
- **API Key Issues**: Verify keys in `.env` files and check for rate limits on external services.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, issues, or support, open an issue on the [GitHub repository](https://github.com/Hanishsaini/ECHO-OS). You can also reach out to the maintainer at [your email or contact info if available].
