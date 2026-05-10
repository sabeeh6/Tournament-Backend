import multer from 'multer';

// Use memory storage to store files in buffer instead of disk
// This is suitable for serverless functions (Vercel) and storing as Base64.
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
