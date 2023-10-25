export const fileFilter = (
  req: Express.Request,
  image: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  callback: Function,
) => {
  //console.log({ image });
  if (!image) return callback(new Error('Image is empty'), false);

  const fileExtension = image.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }
  callback(null, false);
};
