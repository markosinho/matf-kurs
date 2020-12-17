export interface IPermissions {
    GET: Array<string>;
    POST: Array<string>;
    DELETE: Array<string>;
    PATCH: Array<string>;
}

export interface IRoles {
    SALES: IPermissions,
    CUSTOMER: IPermissions,
    ANONYMOUS: IPermissions
}

const roles: IRoles = {
    SALES: {
        GET: [
            '/login',
            '/user/me'
        ],
        POST: [],
        PATCH: [],
        DELETE: []
    },
    CUSTOMER: {
        GET: [
            '/login',
            '/user/me'
        ],
        POST: [],
        PATCH: [],
        DELETE: []
    },
    ANONYMOUS: {
        GET: [
            '/login',
            '/register'
        ],
        POST: [],
        PATCH: [],
        DELETE: []
    }
}

export default roles;