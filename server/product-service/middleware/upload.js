const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    if (req.originalUrl.includes("products")) {
      cb(null, "uploads/products");
    } 
    
    else if (req.originalUrl.includes("suppliers")) {
      cb(null, "uploads/suppliers");
    } 
    
    else {
      cb(null, "uploads");
    }

  },

  filename: function (req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);

  },

});

module.exports = multer({ storage });