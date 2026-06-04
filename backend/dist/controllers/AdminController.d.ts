import { Request, Response } from 'express';
export declare class AdminController {
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getCriticalZones(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
