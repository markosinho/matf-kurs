
interface IUser {
    username: string,
    email: string,
    password: string,
    hop: number
};

const UserSchemaFields: Record<keyof IUser, any> = {
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    hop: 2
}