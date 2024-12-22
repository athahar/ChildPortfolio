import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

// Configure storage
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    // Generate a random filename to avoid collisions
    const randomName = randomBytes(16).toString("hex");
    cb(null, `${randomName}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and documents
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
