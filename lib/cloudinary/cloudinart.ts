import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dqrnjgnzw',
  api_key: process.env.CLOUDINARY_API_KEY || '532641659535115',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || 'palBrTsZzgT0tDLqS7o_5qr4lZ0',
});

export default cloudinary;
