# 🌟 Vistagram - Points of Interest Social Media Platform

A full-stack web application that blends "Visit" and "Instagram" for Points of Interest (POI). Users can capture and share amazing places, follow other travelers, and discover new destinations through a beautiful social media experience.

![Vistagram Demo](https://img.shields.io/badge/Status-Complete-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-orange)

## 🚀 Live Demo

- **Frontend**: [Vistagram App](https://your-deployment-url.com)
- **Backend API**: [API Documentation](https://your-api-url.com/api/health)

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Profile Management** with bio, location, website, and profile pictures
- **Password Management** with secure change functionality
- **Account Deletion** with confirmation
- **Session Management** with automatic token refresh

### 👥 Social Features
- **User Profiles** with follower/following counts
- **Follow/Unfollow** other users
- **User Search** with real-time results
- **Suggested Users** to follow
- **User Verification** badges
- **Private/Public** account settings

### 📸 Post Management
- **Camera Capture** using device camera
- **Image Upload** with drag & drop support
- **Post Creation** with captions, location, and tags
- **Post Editing** and deletion
- **Post Archiving** functionality
- **Location Tagging** with coordinates

### ❤️ Engagement Features
- **Like/Unlike** posts with real-time counters
- **Save/Unsave** posts to personal collection
- **Share Posts** with link generation and counters
- **Comments System** with nested replies
- **View Counts** and engagement metrics
- **Post Analytics** (impressions, reach)

### 📱 User Experience
- **Infinite Scroll** for seamless browsing
- **Real-time Updates** for likes, comments, and follows
- **Responsive Design** optimized for all devices
- **Dark Theme** with violet/black color scheme
- **Smooth Animations** and transitions
- **Loading States** and error handling

### 🔍 Discovery Features
- **Timeline Feed** with posts from followed users
- **Explore Page** with trending posts
- **Search Functionality** for posts and users
- **Tag-based Discovery** for finding related content
- **Location-based** post discovery
- **Trending Posts** algorithm

### 🛡️ Security & Performance
- **JWT Authentication** with secure token management
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **File Upload Security** with type and size restrictions
- **CORS Configuration** for secure cross-origin requests
- **Error Handling** with user-friendly messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Material UI 5** - Beautiful, accessible component library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Smooth animations
- **React Infinite Scroll** - Infinite scrolling functionality
- **React Webcam** - Camera capture functionality

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting

### Development Tools
- **Jest** - Testing framework
- **Supertest** - API testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vistagram.git
   cd vistagram
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MongoDB**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in backend/.env
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vistagram

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Vistagram
REACT_APP_VERSION=1.0.0
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "username": "traveler_jane",
  "email": "jane@example.com",
  "password": "securepassword123",
  "fullName": "Jane Doe"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### GET /api/auth/profile
Get current user profile

#### PUT /api/auth/profile
Update user profile
```json
{
  "fullName": "Jane Doe",
  "bio": "Adventure seeker and travel enthusiast",
  "location": "New York, NY",
  "website": "https://janesblog.com"
}
```

### Posts Endpoints

#### GET /api/posts
Get posts with pagination
```
?page=1&limit=10&userId=optional
```

#### GET /api/posts/feed
Get posts from followed users
```
?page=1&limit=10
```

#### POST /api/posts
Create a new post
```json
{
  "caption": "Amazing sunset at the beach!",
  "image": "base64_image_data",
  "location": {
    "name": "Maldives",
    "coordinates": [73.2207, 3.2028]
  },
  "tags": "travel,beach,sunset"
}
```

#### POST /api/posts/:id/like
Like/unlike a post

#### POST /api/posts/:id/save
Save/unsave a post

#### POST /api/posts/:id/share
Share a post

### Users Endpoints

#### GET /api/users/profile/:username
Get user profile by username

#### GET /api/users/search
Search users
```
?q=search_term&page=1&limit=20
```

#### POST /api/users/:userId/follow
Follow a user

#### DELETE /api/users/:userId/follow
Unfollow a user

## 🎨 UI/UX Features

### Design System
- **Material Design** principles
- **Dark Theme** with violet accents
- **Glass Morphism** effects
- **Smooth Animations** using Framer Motion
- **Responsive Grid** layouts
- **Custom Icons** and illustrations

### User Interface
- **Instagram-like** post cards
- **Stories-style** user avatars
- **Infinite scroll** timeline
- **Modal dialogs** for actions
- **Toast notifications** for feedback
- **Loading skeletons** for better UX

### Mobile Experience
- **Touch-friendly** interactions
- **Swipe gestures** for navigation
- **Camera integration** for photo capture
- **Offline support** for basic functionality
- **Progressive Web App** features

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

### API Testing
```bash
# Using the provided test suite
cd backend
npm run test:api
```

## 🚀 Deployment

### Backend Deployment

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Heroku
```bash
heroku create your-vistagram-app
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

#### DigitalOcean
1. Create a Droplet
2. Install Node.js and MongoDB
3. Set up PM2 for process management
4. Configure Nginx as reverse proxy

### Frontend Deployment

#### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically

### Environment Setup for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 📊 Performance Optimization

### Frontend
- **Code Splitting** with React.lazy()
- **Image Optimization** with lazy loading
- **Bundle Analysis** and optimization
- **Service Worker** for caching
- **CDN** for static assets

### Backend
- **Database Indexing** for faster queries
- **Query Optimization** with aggregation
- **Caching** with Redis (optional)
- **Compression** middleware
- **Rate Limiting** for API protection

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** with bcrypt
- **Input Validation** and sanitization
- **CORS Configuration** for secure requests
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers
- **File Upload** validation and restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages
- Ensure responsive design
- Test on multiple browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material UI** for the beautiful component library
- **Unsplash** for sample images
- **React Community** for amazing tools and libraries
- **MongoDB** for the flexible database solution

## 📞 Support

- **Email**: support@vistagram.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/vistagram/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/vistagram/wiki)

## 🎯 Roadmap

### Phase 2 Features
- [ ] **Real-time Chat** between users
- [ ] **Video Posts** support
- [ ] **Stories Feature** like Instagram
- [ ] **AI-powered** caption generation
- [ ] **Location-based** recommendations
- [ ] **Advanced Analytics** dashboard
- [ ] **Push Notifications**
- [ ] **Multi-language** support

### Phase 3 Features
- [ ] **Live Streaming** capabilities
- [ ] **AR Filters** for photos
- [ ] **Voice Messages** in comments
- [ ] **Collaborative** travel planning
- [ ] **Integration** with travel booking platforms
- [ ] **Advanced Search** with filters
- [ ] **Export/Import** functionality

---

**Built with ❤️ by the Vistagram Team**

*Share your adventures, discover amazing places, and connect with fellow travelers around the world!*
