import { Request, Response } from "express";
import UserModel from "../models/User.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authorization = async (req: Request, res: Response) => {
    try {
        const values = req.body;

        if (!values.email || !values.password) {
            return res.json({
                message: 'Заполните все поля!',
            })
        }

        if (values.email.includes('@') === false) {
            return res.json({
                message: 'Некорректный email!',
            })
        }

        if (values.password.length < 8) {
            return res.json({
                message: 'Пароль должен быть больше 8 символов!',
            })
        }

        const user = await UserModel.findOne({ email: values.email })

        if (!user) {
            return res.json({
                message: 'Пользователь не найден!',
            })
        }

        const isMatch = await bcrypt.compare(values.password, user.password)

        if (!isMatch) {
            return res.json({
                message: 'Неверный пароль!',
            })
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        return res.json({
            token,
            message: 'Вы успешно авторизовались!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            message: 'Что-то пошло не так!'
        })
    }
}

export const registration = async (req: Request, res: Response) => {
    try {
        const values = req.body;

        if (!values.email || !values.password) {
            return res.json({
                message: 'Заполните все поля!',
            })
        }

        if (values.email.includes('@') === false) {
            return res.json({
                message: 'Некорректный email!',
            })
        }

        if (values.password.length < 8) {
            return res.json({
                message: 'Пароль должен быть больше 8 символов!',
            })
        }

        if (values.name.length < 3) {
            return res.json({
                message: 'Имя должно быть больше 3 символов!',
            })
        }

        if (values.surname.length < 3) {
            return res.json({
                message: 'Фамилия должна быть больше 3 символов!',
            })
        }

        const isUsed = await UserModel.findOne({ email: values.email })

        if (isUsed) {
            return res.json({
                message: 'Данный пользователь уже занят!',
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(values.password, salt)

        const newUser = new UserModel({
            name: values.name,
            surname: values.surname,
            email: values.email,
            password: hash,
        })

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        await newUser.save()

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно!',
        })

    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при создании пользователя!' })
    }
}
export const user = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                message: 'Такого пользователя не существует'
            })
        };

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Ошибка при получении пользователя' })
    }
}