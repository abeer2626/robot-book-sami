# Physical Humanoid Robotics Textbook

A comprehensive, open-source textbook covering all aspects of physical humanoid robotics, from foundational concepts to advanced applications and capstone projects.

## 🎯 Overview

This project aims to democratize knowledge in humanoid robotics by providing a free, high-quality educational resource that covers:

- **5 Comprehensive Modules**: From foundations to capstone projects
- **29 Chapters**: In-depth coverage of all robotics domains
- **Mobile-First Design**: Fully responsive and accessible
- **AI-Generated Content**: Leveraging modern AI for educational content creation
- **RAG Integration**: Enhanced learning with AI-powered chatbot support

## 📚 Modules

1. **Module 1: Foundations** (6 chapters)
   - What is Robotics, Robot Components, AI Fundamentals, Mathematics, Exercises

2. **Module 2: Core Concepts** (5 chapters)
   - Kinematics, Dynamics, Path Planning, Control Systems, SLAM

3. **Module 3: Advanced Topics** (5 chapters)
   - Deep Reinforcement Learning, HRI, Swarm Robotics, Ethics, Future Directions

4. **Module 4: Applications** (4 chapters)
   - Industrial Automation, Service Robotics, Autonomous Systems, Capstone Projects

5. **Module 5: Capstone** (6 chapters)
   - Project Guidelines, Case Studies, Future Directions, Resources, Exercises

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook.git
cd physical-humanoid-robotics-textbook

# Install dependencies
npm install

# Start development server
npm run start
```

### Build for Production

```bash
# Build the documentation
npm run build

# Serve the build locally
npm run serve
```

## 🌐 Deployment

### GitHub Pages (Documentation)

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Under "Pages", select "GitHub Actions" as the source
   - The workflow will automatically deploy on push to `1-robotics-textbook` branch

2. **Custom Domain** (Optional):
   ```dns
   # Add a CNAME record pointing to your GitHub Pages URL
   your-domain.com    -> physical-humanoid-robotics-textbook.github.io
   ```

### Railway RAG Chatbot

The RAG chatbot backend can be deployed to Railway:

1. **Connect Repository**:
   - Visit [Railway.app](https://railway.app)
   - Create a new project → "Deploy from GitHub repo"
   - Select `physical-humanoid-robotics-textbook/rag-chatbot`

2. **Configure Environment Variables**:
   ```bash
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-api-key
   OPENAI_ORG_ID=your-org-id

   # Database Configuration
   NEON_DATABASE_URL=postgresql://...

   # Vector Database
   QDRANT_URL=https://...
   QDRANT_API_KEY=your-key

   # Application
   SECRET_KEY=32-character-secret
   ```

## 🛠️ Technologies Used

- **Docusaurus 3.5.2**: Static site generator
- **React & TypeScript**: Modern web development
- **MDX**: Rich content with JSX components
- **Tailwind CSS**: Utility-first styling
- **GitHub Actions**: CI/CD pipeline
- **Railway**: PaaS for RAG backend
- **FastAPI**: Python web framework for RAG
- **Qdrant**: Vector database for semantic search

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

- 📖 [Documentation](https://physical-humanoid-robotics-textbook.github.io)
- 🐛 [Issues](https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook/issues)
- 💬 [Discussions](https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook/discussions)

## 🙏 Acknowledgments

- Built with ❤️ by [SAMI UR REHMAN](https://github.com/physical-humanoid-robotics-textbook)
- Inspired by the open-source community and the need for accessible robotics education

## 📊 Stats

[![GitHub issues](https://img.shields.io/github/issues/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook.svg)](https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook/issues)
[![GitHub stars](https://img.shields.io/github/stars/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook.svg?style=social)](https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook)
[![Forks](https://img.shields.io/github/forks/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook.svg?style=social)](https://github.com/physical-humanoid-robotics-textbook/physical-humanoid-robotics-textbook)

---

Made with ❤️ for the robotics community