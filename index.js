import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

console.log('Hello, World!', process.env.name);
