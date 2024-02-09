import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET)

            if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                req.body.userId = decoded['id']
            }

            next();
        } catch (error) {
            return res.json({
                message: 'No access!'
            })
        }
    } else {
        return res.json({
            message: 'No access!'
        })
    }
}