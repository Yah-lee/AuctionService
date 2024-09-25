import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { Document } from 'mongoose';
import multer from 'multer';
import path from 'path';
import { APP_ROOT } from '../../config';
import { Product } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import { productValidator } from '../../validation';
interface IProductDocument extends Document {
  _doc: {
    image: string;
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {

    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

//! doing normal  async error handling using next ,as multer seems to not work with express async errors
const create = async (req: Request, res: Response, next: NextFunction) => {

  handleMultipartData(req, res, async (err) => {
    try {
      let product;

      if (err)
        return next(CustomErrorHandler.multerError('❌ Error at multer start'));

      if (!req.file) {
        return next(
          CustomErrorHandler.multerError(
            '❌ File Not Present in Multer Request'
          )
        );
      }

      const filePath = req.file.path;

      console.log('filePath ', filePath);



      try {
        const body: unknown = await req.body;
        console.log('product body', JSON.stringify(body, null, 2));
        const { name, price, size } = productValidator.parse(body);
        console.log(
          '🚀 ~ file: productController.ts:56 ~ handleMultipartData ~ const { name, price, size }:',
          name,
          price,
          size
        );

        product = await Product.create({
          name,
          price,
          size,
          image: filePath,
        });

      } catch (err) {
        fs.unlink(`${APP_ROOT}/${filePath}`, (err) => {
          if (err)
            return next(
              CustomErrorHandler.multerError('Could not delete file')
            );
          else console.log('✅ Uploaded file deleted');
        });
        return next(CustomErrorHandler.multerError((err as Error).message));
      }

      return res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    handleMultipartData(req, res, async (err) => {
      try {
        let product;
        let filePath;

        if (err)
          return next(
            CustomErrorHandler.multerError('❌ Error at multer start')
          );
        if (req.file) {
          filePath = req.file.path;
        }

        console.log('filePath ', filePath);



        try {
          const body: unknown = await req.body;
          console.log('product body', JSON.stringify(body, null, 2));
          const { name, price, size } = productValidator.parse(body);
          console.log(
            '🚀 ~ file: productController.ts:56 ~ handleMultipartData ~ const { name, price, size }:',
            name,
            price,
            size
          );
          const id = req.params.id;

          product = await Product.findOneAndUpdate(
            { id },
            {
              name,
              price,
              size,
              ...(req.file && { image: filePath }), // ?this will include the updated image ,if the image is present in the  update request
            },
            { new: true } //? will get updated data in response
          );
          return res.status(201).json(product);
        } catch (err) {

          if (req.file) {
            fs.unlink(`${APP_ROOT}/${filePath}`, (err) => {
              if (err)
                throw CustomErrorHandler.multerError('Could not delete file');
              else console.log('✅ Uploaded file deleted');
            });
            return next(CustomErrorHandler.multerError((err as Error).message));
          }
        }
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const id = req.params.id;

    const product = (await Product.findByIdAndDelete(id)) as IProductDocument;

    if (!product)
      return next(
        CustomErrorHandler.notFound(`Product with id:${id} not found!`)
      );



    const filePath = `${APP_ROOT}/${product._doc.image}`;

    console.log(filePath);

    fs.unlink(filePath, (err) => {
      if (err) {
        return next(CustomErrorHandler.multerError('❌ Could not delete file'));
      } else console.log('✅ Uploaded file deleted');
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

const getAll = async (req: Request, res: Response) => {
  const products = await Product.find()
    .select('-updatedAt -__v')
    .sort({ id: -1 }); //? ascending order

  res.json(products);
};

const getOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product)
    throw CustomErrorHandler.notFound(`product with id ${id} not found`);

  res.json(product);
};

export default {
  create,
  update,
  remove,
  getAll,
  getOne,
};
