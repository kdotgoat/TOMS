import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
    log : process.env.NODE_ENV === "development"
    ?["query", "error", "warn"]
    :["error"],
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database is connected successfully");
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Database disconnected successfully");
    } catch (error) {
        console.error(`Error disconnecting database: ${error.message}`);
    }
};

export{prisma, connectDB, disconnectDB};