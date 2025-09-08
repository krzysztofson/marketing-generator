# Marketing Generator

A Vue.js 3 application that generates marketing content using OpenAI's GPT models. Enter a brief description of your product or service, and the app will generate compelling marketing copy with customizable visual previews.

## Features

### 🤖 AI-Powered Content Generation

- **OpenAI Integration**: Uses GPT-5 (configurable) to generate marketing content
- **Smart Prompting**: Optimized prompts for marketing copy generation
- **Fallback Support**: Graceful degradation with sample content when API is unavailable
- **Error Handling**: Robust error handling with retry mechanisms

### 📝 Content Management

- **Brief Input**: Simple textarea for product/service descriptions
- **Generated Fields**:
  - Title (under 70 characters)
  - Description (1-3 sentences)
  - Call-to-action text
  - Image URL (automatically set to reliable placeholder)

### 🎨 Visual Customization

- **Aspect Ratios**: Square (1:1), Portrait (4:5), Story (9:16)
- **Image Handling**: Cover/contain fit options with reliable placeholder images
- **Logo Control**: Toggle logo visibility
- **Gradient Overlay**: Customizable gradient with color options (Blue, Purple, Black)
- **Text Positioning**: Top, center, or bottom positioning
- **Live Preview**: Real-time preview updates as you customize

### 🛠 Technical Features

- **Vue 3 Composition API**: Modern reactive framework
- **Pinia State Management**: Centralized state for content and customization
- **Tailwind CSS**: Utility-first styling with responsive design
- **Vite Build System**: Fast development and optimized production builds
- **Environment Configuration**: Secure API key management

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- OpenAI API key (optional - app works without it)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/krzysztofson/marketing-generator.git
   cd marketing-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:

   ```
   VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
   VITE_OPENAI_MODEL=gpt-4o-mini
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### Basic Workflow

1. **Enter a Brief**: Describe your product, service, or campaign in the textarea
2. **Generate Content**: Click "Next" to generate marketing copy using AI
3. **Customize**: Use the customization panel to adjust:
   - Aspect ratio for different platforms
   - Image fit and logo visibility
   - Gradient overlay and text positioning
4. **Preview**: See real-time updates in the preview panel
5. **Download**: Export your marketing content (functionality placeholder)

### Example Brief

```
We're launching a sustainable coffee subscription service that delivers
ethically sourced, freshly roasted beans from small farms directly to
customers' doors. Our mission is to support coffee farmers while providing
the best coffee experience at home.
```

## Configuration

### Environment Variables

| Variable              | Description         | Default       | Required |
| --------------------- | ------------------- | ------------- | -------- |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | -             | No\*     |
| `VITE_OPENAI_MODEL`   | OpenAI model to use | `gpt-4o-mini` | No       |

\*Without an API key, the app uses sample content for demonstration.

### Model Options

- `gpt-4o-mini` (recommended, cost-effective)
- `gpt-4o` (higher quality, more expensive)
- `gpt-5` (latest model, if available to your account)

## Architecture

### Project Structure

```
src/
├── components/
│   ├── Form.vue           # Brief input and generation trigger
│   ├── FormEdit.vue       # Content editing and customization
│   └── icons/             # Icon components
├── stores/
│   ├── marketing.js       # Pinia store for content state
│   └── counter.js         # Example store
├── views/
│   ├── HomeView.vue       # Landing page with Form component
│   ├── FormEditView.vue   # Edit page with FormEdit component
│   └── AboutView.vue      # About page
├── router/
│   └── index.js           # Vue Router configuration
└── assets/                # Static assets and styles
```

### State Management

The app uses Pinia for state management with a centralized `marketing` store:

```javascript
// Store state
{
  brief: '',           // User input
  title: '',           // Generated title
  description: '',     // Generated description
  cta: '',            // Generated call-to-action
  imageUrl: '',       // Generated image URL
  loading: false,     // Generation state
  error: null         // Error messages
}
```

### API Integration

The OpenAI integration includes:

- **Multiple Retry Attempts**: Tries different models and configurations
- **Response Format Handling**: Uses structured JSON output when supported
- **Error Recovery**: Provides fallback content on API failures
- **Security**: API calls made from frontend (consider backend proxy for production)

## Customization Options

### Aspect Ratios

- **Square (1:1)**: Perfect for Instagram posts, profile pictures
- **Portrait (4:5)**: Ideal for Instagram stories, Pinterest
- **Story (9:16)**: Optimized for Instagram/Facebook stories, TikTok

### Visual Elements

- **Logo**: Toggle brand logo visibility
- **Gradient**: Customizable overlay with 33% solid, 67% fade
- **Colors**: Blue, Purple, Black gradient options
- **Image Fit**: Cover (fill container) or Contain (fit within bounds)
- **Text Position**: Top, center, or bottom placement

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Code formatting
npm run format
```

### Build Configuration

The project uses separate Vite configurations:

- `vite.config.dev.mjs` - Development settings with devtools
- `vite.config.prod.mjs` - Production optimizations

### Technology Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite 5
- **State Management**: Pinia 2
- **Routing**: Vue Router 4
- **Styling**: Tailwind CSS 3 with custom configurations
- **CSS Preprocessing**: Sass/SCSS support
- **Development**: Vue DevTools integration

## Deployment

### Build for Production

```bash
npm run build
```

The build outputs to `/dist` directory with optimized assets.

### Environment Variables in Production

Ensure these environment variables are set in your hosting platform:

- `VITE_OPENAI_API_KEY`
- `VITE_OPENAI_MODEL`

### Hosting Options

**Static Hosting** (Recommended):

- Netlify, Vercel, GitHub Pages
- Upload `/dist` folder contents

**Traditional Hosting**:

- Any web server capable of serving static files
- Configure server to serve `index.html` for SPA routing

### Security Considerations

⚠️ **Important**: The current implementation makes API calls from the frontend, exposing your API key to users. For production use, consider:

1. **Backend Proxy**: Create a backend service to proxy OpenAI requests
2. **API Key Rotation**: Regularly rotate your OpenAI API keys
3. **Rate Limiting**: Implement request throttling
4. **Input Validation**: Sanitize user inputs before sending to OpenAI

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit changes: `git commit -m "Add feature"`
6. Push to branch: `git push origin feature-name`
7. Open a Pull Request

### Code Style

- Use Vue 3 Composition API
- Follow ESLint and Prettier configurations
- Use TypeScript types where beneficial
- Write descriptive commit messages

## Troubleshooting

### Common Issues

**OpenAI API 400 Error**

- Check your API key is valid and has sufficient credits
- Verify the model name is correct for your account
- Try using `gpt-4o-mini` instead of newer models

**Images Not Loading**

- The app uses `https://picsum.photos/800/800` for reliable image placeholders
- Check network connectivity and firewall settings

**Build Errors**

- Update Node.js to version 16 or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

**Development Server Issues**

- Ensure port 5173 is available
- Check for conflicting processes: `lsof -i :5173`

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```
VITE_DEBUG=true
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **OpenAI** for providing the GPT API
- **Vue.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Unsplash/Picsum** for placeholder images

## Support

For support, please:

1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/krzysztofson/marketing-generator/issues)
3. Create a new issue with detailed description and steps to reproduce

---

**Made with ❤️ using Vue.js 3, Tailwind CSS, and OpenAI GPT**
