import fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify({
    logger: true,
});

const start = async () => {
    try {
        await app.listen({ port: parseInt(process.env.PORT || '3000') });
        console.log(`Server listening on port ${process.env.PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();