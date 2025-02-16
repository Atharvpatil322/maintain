
// const Image = require('../models/image');
// const cloudinary = require('../config/cloudinary');

// // POST /api/images/upload
// exports.uploadImage = async (req, res) => {
//   try {
//     const { assetName, projectName } = req.body;
//     const userId = req.userId; // from authMiddleware
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Create a promise that resolves when the stream is done
//     const uploadedImage = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: 'freelancer_assets' }, // optional folder in Cloudinary
//         (error, result) => {
//           if (error) return reject(error);
//           resolve(result);
//         }
//       );
//       // Pipe the buffer into the upload_stream
//       stream.end(req.file.buffer);
//     });

//     // uploadedImage will have fields like secure_url, public_id
//     const { secure_url, public_id } = uploadedImage;

//     // Save record in Mongo
//     const newImage = await Image.create({
//       assetName,
//       projectName,
//       cloudinaryUrl: secure_url,
//       publicId: public_id
//     });

//     // The "platform URL" that redirects to the Cloudinary resource
//     const platformUrl = `${req.protocol}://${req.get('host')}/api/images/${newImage._id}`;

//     return res.status(200).json({
//       message: 'Image uploaded successfully',
//       data: {
//         _id: newImage._id,
//         assetName: newImage.assetName,
//         projectName: newImage.projectName,
//         platformUrl,
//         createdAt: newImage.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/images/:id  (same as before)
// exports.redirectToImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const imageRecord = await Image.findById(id);
//     if (!imageRecord) {
//       return res.status(404).json({ message: 'Image not found.' });
//     }
//     return res.redirect(imageRecord.cloudinaryUrl);
//   } catch (err) {
//     console.error('Error in redirectToImage:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// exports.getAllImages = async (req, res) => {
//     try {
   
//       const images = await Image.find({}).select('assetName projectName cloudinaryUrl createdAt updatedAt');

//       return res.status(200).json(images);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//       return res.status(500).json({ message: 'Server error' });
//     }
//   };



//   exports.updateImage = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { assetName, projectName } = req.body;
  
//       // Find the existing image by _id
//       const existingImage = await Image.findById(id);
//       if (!existingImage) {
//         return res.status(404).json({ message: 'Image not found' });
//       }
  
//       // If a new file is uploaded, replace the old image
//       if (req.file) {
//         // 1) Destroy the old image on Cloudinary (optional if you want to remove it)
//         // if (existingImage.publicId) {
//         //   await cloudinary.uploader.destroy(existingImage.publicId);
//         // }
  
//         // 2) Upload the new file to Cloudinary
//         const uploadedImage = await new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { folder: 'freelancer_assets' }, // or any folder name you like
//             (error, result) => {
//               if (error) return reject(error);
//               resolve(result);
//             }
//           );
//           stream.end(req.file.buffer); // send the buffer to Cloudinary
//         });
  
//         // 3) Update the doc with new Cloudinary details
//         existingImage.cloudinaryUrl = uploadedImage.secure_url;
//         existingImage.publicId = uploadedImage.public_id;
//       }
  
//       // Update text fields even if no new file is uploaded
//       if (assetName) existingImage.assetName = assetName;
//       if (projectName) existingImage.projectName = projectName;
  
//       // Save the updated document
//       await existingImage.save();
  
//       // Return the updated info
//       return res.status(200).json({
//         message: 'Image updated successfully',
//         data: {
//           _id: existingImage._id,
//           assetName: existingImage.assetName,
//           projectName: existingImage.projectName,
//           cloudinaryUrl: existingImage.cloudinaryUrl,
//           updatedAt: existingImage.updatedAt
//         }
//       });
//     } catch (error) {
//       console.error('Error updating image:', error);
//       return res.status(500).json({ message: 'Server error' });
//     }
//   };
// server/src/controllers/image.controller.js
const Image = require('../models/image');
const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    const { assetName, projectName } = req.body;
    const userId = req.userId; // from authMiddleware

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary via upload_stream
    const uploadedImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'freelancer_assets' }, // optional folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const { secure_url, public_id } = uploadedImage;

    // Create new Image doc, including user & platform URL
    // We'll build the platformUrl (redirect route) with newImage._id
    // but first we need the doc. So let's create & save in two steps:
    let newImage = new Image({
      assetName,
      projectName,
      cloudinaryUrl: secure_url,
      publicId: public_id,
      user: userId
    });
    // await newImage.save();

    // Now we can set the platformUrl
    // e.g. GET /api/images/:id => redirect to cloud
    const platformUrl = `${req.protocol}://${req.get('host')}/api/images/${newImage._id}`;
    newImage.platformUrl = platformUrl;
    await newImage.save();

    return res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        _id: newImage._id,
        assetName: newImage.assetName,
        projectName: newImage.projectName,
        platformUrl: newImage.platformUrl,
        createdAt: newImage.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.redirectToImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageRecord = await Image.findById(id);
    if (!imageRecord) {
      return res.status(404).json({ message: 'Image not found.' });
    }
    return res.redirect(imageRecord.cloudinaryUrl);
  } catch (err) {
    console.error('Error in redirectToImage:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const userId = req.userId;
    // only return images belonging to the logged-in user
    const images = await Image.find({ user: userId })
    .select('assetName projectName platformUrl cloudinaryUrl createdAt updatedAt');

    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { assetName, projectName } = req.body;

    // Find the existing image by _id and user
    const existingImage = await Image.findOne({ _id: id, user: userId });
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found or not yours' });
    }

    // If a new file is uploaded, replace the old image
    if (req.file) {
      // (Optional) destroy old image on Cloudinary if you like
      // if (existingImage.publicId) {
      //   await cloudinary.uploader.destroy(existingImage.publicId);
      // }

      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'freelancer_assets' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      existingImage.cloudinaryUrl = uploadedImage.secure_url;
      existingImage.publicId = uploadedImage.public_id;
    }

    // Update text fields
    if (assetName) existingImage.assetName = assetName;
    if (projectName) existingImage.projectName = projectName;

    // Save the updated doc
    await existingImage.save();

    return res.status(200).json({
      message: 'Image updated successfully',
      data: {
        _id: existingImage._id,
        assetName: existingImage.assetName,
        projectName: existingImage.projectName,
        cloudinaryUrl: existingImage.cloudinaryUrl,
        updatedAt: existingImage.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
