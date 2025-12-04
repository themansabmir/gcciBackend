# Cloudinary Configuration Guide

This project uses Cloudinary as the default storage provider for file uploads. To enable file upload functionality, you need to configure your Cloudinary credentials.

## Getting Your Cloudinary Credentials

1. **Sign up or log in to Cloudinary**
   - Go to https://cloudinary.com/
   - Create a free account or sign in to your existing account

2. **Access your Dashboard**
   - After logging in, you'll be directed to your dashboard
   - Your credentials are displayed on the dashboard

3. **Copy your credentials**
   - **Cloud Name**: Your unique cloud name
   - **API Key**: Your API key for authentication
   - **API Secret**: Your API secret (keep this secure!)

## Configuring Environment Variables

Create or update your `.env` file in the project root directory with the following variables:

```env
# Storage Provider Configuration
STORAGE_PROVIDER=cloudinary

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace `your_cloud_name_here`, `your_api_key_here`, and `your_api_secret_here` with your actual Cloudinary credentials.

## Security Best Practices

- **Never commit your `.env` file** to version control. Ensure it's listed in your `.gitignore` file.
- **Keep your API Secret secure**. Do not share it or expose it in client-side code.
- **Use environment-specific credentials** for development, staging, and production environments.

## Example .env File

```env
# Database
PROD_MONGO_URI=mongodb://...

# JWT
JWT_SECRET=your_jwt_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Storage Provider
STORAGE_PROVIDER=cloudinary

# Cloudinary
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Environment
NODE_ENV=development
```

## Verifying Configuration

After setting up your credentials, start your development server:

```bash
npm run dev
```

The application will automatically connect to Cloudinary using the provided credentials. You can verify the configuration by uploading a file through the API endpoints:

- **Upload File**: `POST /api/file/upload/:shipmentId`
- **Get Files**: `GET /api/file/shipment/:shipmentId`

## Future Storage Providers

The storage layer is designed to be extensible. In the future, you can add support for:

- **AWS S3**: Set `STORAGE_PROVIDER=aws-s3` and add AWS credentials
- **GCP Cloud Storage**: Set `STORAGE_PROVIDER=gcp` and add GCP credentials

The storage provider interface ensures that switching between providers requires minimal code changes.

## Troubleshooting

### Error: "Failed to upload file to Cloudinary"

- Verify your credentials are correct
- Check that your Cloudinary account is active
- Ensure you have sufficient quota/credits in your account

### Files not appearing in Cloudinary dashboard

- Check the folder structure in your Cloudinary media library
- Files are uploaded to `shipments/:shipmentId/` folders by default
- Verify the file upload was successful by checking the API response

### "Invalid file type" errors

- Check the allowed MIME types in `/src/middleware/upload-file.ts`
- The default configuration allows images, PDFs, Word documents, Excel files, and CSV files
- File size limit is 10MB by default
