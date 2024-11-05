import "fastify";

declare module "fastify" {
    interface FastifyReply {
        created: (data?: unknown) => void;
        badRequest: (message?: string) => void;
        error: (error: {
            code?: string;
            message: string;
            status: number;
        }) => void;
        forbidden: (code?: string, message?: string) => void;
        notFound: (message?: string) => void;
        serverError: (code?: string, message?: string) => void;
        success: (data?: unknown, metadata?: unknown) => void;
        unauthorized: (message?: string) => void;
    }
}