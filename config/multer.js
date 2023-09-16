// Multer configuration to save the images in a folder
const configureMulter = () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './public/images/users');
      },
      filename: (req, file, cb) => {

        var userId = global.globalUser.webId;
        if (userId == null) {
            userId = global.globalUser.id;
        }

        cb(null, Date.now() + '-' + userId + '-' + file.originalname);
      }
    });
  
    return multer({ storage });
  };
  
  export default configureMulter ;