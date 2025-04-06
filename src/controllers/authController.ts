import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signUp =  async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as  { email: string, password: string };

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashedPassword });
        
    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
}

const login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
    
    try {
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        
        if (!valid) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    
        return reply.send({ token });

    } catch (error) {
        return reply.code(500).send({ error: 'Internal Server Error' });
    }
}   

export { signUp, login };