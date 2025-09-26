# EverStride Dashboard

A modern Next.js dashboard application built with TypeScript, Tailwind CSS, and Recharts for data visualization.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.17 or later)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

## Local Development

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd everstride
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Development Server

Start the development server with hot reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production

1. **Build the application:**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   # or
   bun run build
   ```

2. **Start the production server:**
   ```bash
   npm run start
   # or
   yarn start
   # or
   pnpm start
   # or
   bun run start
   ```

The production build will be available at [http://localhost:3000](http://localhost:3000).

### Linting

Run the linter to check code quality:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
# or
bun run lint
```

## Windows IIS Server Deployment

### Option 1: Static Export (Recommended for IIS)

Next.js can be exported as static files for deployment on any web server including IIS.

#### Configuration

1. **Update `next.config.ts` for static export:**
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   };

   export default nextConfig;
   ```

2. **Build the static export:**
   ```bash
   npm run build
   ```

3. **The static files will be generated in the `out` directory.**

#### IIS Deployment Steps

1. **Install IIS on Windows Server:**
   - Open Server Manager
   - Add the "Web Server (IIS)" role
   - Include common HTTP features and management tools

2. **Create a new website in IIS:**
   - Open IIS Manager
   - Right-click on "Sites" → "Add Website"
   - Set site name (e.g., "EverStride")
   - Set physical path to your `out` directory
   - Configure binding (port, hostname)

3. **Configure MIME types (if needed):**
   - In IIS Manager, select your site
   - Open "MIME Types"
   - Add the following if missing:
     - `.json` → `application/json`
     - `.js` → `application/javascript`
     - `.css` → `text/css`

4. **Set up URL Rewrite (for SPA routing):**
   - Install URL Rewrite module if not present
   - Add a web.config file in your `out` directory:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/index.html" />
           </rule>
         </rules>
       </rewrite>
       <staticContent>
         <mimeMap fileExtension=".json" mimeType="application/json" />
       </staticContent>
     </system.webServer>
   </configuration>
   ```

5. **Configure permissions:**
   - Ensure IIS_IUSRS has read access to the `out` directory
   - Ensure proper permissions for static file serving

6. **Start the website:**
   - In IIS Manager, select your site and click "Start"

### Option 2: Node.js Application with IIS Reverse Proxy

For server-side rendering and API routes, deploy as a Node.js application with IIS reverse proxy.

#### Prerequisites

- **Node.js** installed on the server
- **IIS** with URL Rewrite and Application Request Routing (ARR) modules

#### Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Install PM2 for process management:**
   ```bash
   npm install -g pm2
   ```

3. **Create ecosystem file (`ecosystem.config.js`):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'everstride',
       script: 'npm',
       args: 'run start',
       cwd: '/path/to/your/app',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       }
     }]
   };
   ```

4. **Start the application with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

5. **Configure IIS Reverse Proxy:**
   - Install Application Request Routing (ARR) in IIS
   - Create a new website pointing to a dummy directory
   - Add URL Rewrite rule to proxy to Node.js:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="Reverse Proxy to Node.js" stopProcessing="true">
             <match url="(.*)" />
             <action type="Rewrite" url="http://localhost:3001/{R:1}" />
             <serverVariables>
               <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
               <set name="HTTP_X_FORWARDED_PROTO" value="http" />
             </serverVariables>
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

### Environment Variables

Create a `.env.local` file for environment-specific configurations:

```env
# Database connection (if applicable)
DATABASE_URL=your_database_connection_string

# API Keys (if applicable)
API_KEY=your_api_key

# Application settings
NEXT_PUBLIC_APP_NAME=EverStride Dashboard
```

## Troubleshooting

### Common Issues

1. **Build fails on Windows:**
   - Ensure you're using Node.js version 18.17+
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

2. **IIS static files not loading:**
   - Check MIME types are configured correctly
   - Verify file permissions on the `out` directory
   - Ensure web.config is in the correct location

3. **Memory issues during build:**
   - Increase Node.js memory limit: `node --max-old-space-size=4096 ./node_modules/.bin/next build`

4. **Port conflicts:**
   - Change the default port in package.json scripts or use environment variable `PORT=3001 npm run start`

### Performance Optimization

- Enable gzip compression in IIS
- Configure caching headers for static assets
- Consider using a CDN for static assets in production

## Project Structure

```
everstride/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── dashboard-data.json     # Dashboard data
└── package.json           # Dependencies and scripts
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add your feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a pull request

## License

This project is private and proprietary.
