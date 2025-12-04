# EchoOS

EchoOS is a next-generation AI-powered operating system designed to augment human intelligence through persistent memory, digital twins, and autonomous agents. It provides a seamless interface for interacting with your digital self and managing your digital life.

## Features

### 🧠 Persistent Memory
- **Capture & Recall**: Store thoughts, notes, and conversations in a vector database for semantic retrieval.
- **Contextual Awareness**: The system understands the context of your past interactions to provide more relevant assistance.

### 👥 Digital Twin
- **Personalized AI**: Create a digital twin that learns from your memories and communication style.
- **Simulation**: Interact with your twin to brainstorm, practice conversations, or explore ideas.

### 🤖 Autonomous Agents
- **Task Automation**: Delegate complex tasks to specialized agents (e.g., Research Agent).
- **Tool Use**: Agents can browse the web, scrape content, and synthesize information.

### ⚡ Modern Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion (Glassmorphism UI).
- **Backend**: FastAPI, Python 3.13, SQLAlchemy, Pydantic.
- **AI/ML**: OpenAI (GPT-4), Pinecone (Vector DB), LangChain (Agent Framework).
- **Database**: PostgreSQL (Metadata), Redis (Caching/Queue).

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Pinecone Account
- OpenAI API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/echo-os.git
    cd echo-os
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # Mac/Linux
    source .venv/bin/activate
    
    pip install -r requirements.txt
    ```
    Create a `.env` file in `backend/` with your API keys (OPENAI_API_KEY, PINECONE_API_KEY, DATABASE_URL, etc.).

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```
    Create a `.env.local` file in `frontend/` with necessary public env vars.

### Running the App

1.  **Start Backend**
    ```bash
    # In backend directory
    uvicorn app.main:app --reload
    ```

2.  **Start Frontend**
    ```bash
    # In frontend directory
    npm run dev
    ```

Visit `http://localhost:3000` to access EchoOS.

## License

MIT
