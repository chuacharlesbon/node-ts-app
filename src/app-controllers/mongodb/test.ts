import { Request, Response } from 'express';
import { MyModel } from '../../app-schema/MyModel';

export const testMongoDbController = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Request Method", req.method);
        await MyModel.createCollection();
        res.status(200).json({
            message: "Connected to mongo db route.",
        });
    } catch (e) {
        res.status(400).json({
            message: `Error: Something went wrong. ${e}`,
        });
    }
};

export const testMongoDbController2 = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentData = await MyModel.find({});

    if (!currentData || currentData.length === 0) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    res.status(200).json({
      message: "GET Request: Controller 2",
      data: currentData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};