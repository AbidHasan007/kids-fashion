# Kids Fashion E-commerce Store

A modern e-commerce platform built with Next.js, PostgreSQL, and Prisma, featuring cash on delivery, admin panel, and lead tracking.

## Features

### 🛍️ E-commerce Features
- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add/remove items with quantity management
- **Cash on Delivery**: Secure checkout with customer details collection
- **Order Management**: Complete order lifecycle tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### 👨‍💼 Admin Panel
- **Dashboard**: Overview with key metrics and recent orders
- **Order Management**: View, update status, and track all orders
- **Lead Tracking**: Manage customer inquiries and track conversion rates
- **Product Management**: Add, edit, and manage product inventory
- **Customer Management**: View customer details and order history

### 📊 Lead Tracking System
- **Contact Forms**: Capture customer inquiries
- **Lead Status Management**: Track leads through conversion funnel
- **Analytics**: Conversion rate tracking and performance metrics
- **Assignment System**: Assign leads to team members

## Tech Stack

- **Frontend**: Next.js 13, React 17, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind CSS
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kids-fashion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/kids_fashion_db"
   NEXTAUTH_SECRET=your-secret-key-here
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXT_PUBLIC_SITE_TITLE="Kids Fashion Store"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Open Prisma Studio to manage data
   npm run db:studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Admin Access

The admin panel is protected with authentication. To access it:

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Use the default credentials:
   - **Email**: admin@kidsfashion.com
   - **Password**: password
3. After successful login, you'll be redirected to the admin dashboard

**Important**: Change the default password in production by updating the `ADMIN_USER` object in `pages/api/auth/login.js`

### Image Upload System

The application includes a local image upload system for product images:

- **Upload Location**: Images are stored in `public/uploads/` directory
- **File Types**: Supports PNG, JPG, GIF formats
- **File Size**: Maximum 5MB per image
- **Features**: Drag & drop, multiple file upload, image preview
- **Security**: Files are renamed with timestamps to prevent conflicts

**Note**: The `public/uploads/` directory is excluded from git tracking to avoid committing uploaded files.

## Database Schema

The application uses the following main entities:

- **Users**: Admin and customer accounts
- **Products**: Product catalog with images and pricing
- **Orders**: Order management with status tracking
- **Customers**: Customer information and addresses
- **Leads**: Lead tracking and conversion management

## Admin Panel Access

Access the admin panel at `/admin` to manage:
- Orders and order status
- Product inventory
- Customer leads and inquiries
- Store analytics and metrics

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[handle]` - Get product by handle

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order by ID
- `PATCH /api/orders/[id]` - Update order status

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/[id]` - Update lead status

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
