import { Request, Response } from 'express';

const myController1 = (req: Request, res: Response): void => {
    console.log("My controller req.method", req.method);
    res.status(200).json({ message: "Connected to my controller 1" });
};

const myController2 = (req: Request, res: Response): void => {
    console.log("My controller req.method", req.method);
    res.status(200).json({ message: "Connected to my controller 1" });
};

const MyController = {
    myController1,
    myController2,
};

export default MyController;