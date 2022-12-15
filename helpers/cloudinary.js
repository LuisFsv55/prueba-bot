const { v2 } = require('cloudinary');
// Configuración
v2.config({ 
    cloud_name  : process.env.CLOUD_NAME, 
    api_key     : process.env.API_KEY, 
    api_secret  : process.env.API_SECRET 
});


// Función que permite subir el archivo a v2
const uploadImage = async (filePath) => {
    return await v2.uploader.upload(filePath, {
        folder: "topicos",
    });
};

const deleteImage = async (id) => {
    return await v2.uploader.destroy(id);
};

module.exports = {
    uploadImage,
    deleteImage
}