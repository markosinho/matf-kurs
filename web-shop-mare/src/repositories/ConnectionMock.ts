
export class MongoManagerMock {
    _databaseMock: any
    constructor() {
        this._databaseMock = {
            'UserEntity': [],
            'ProductEntity': []
        }
    }

    find(obj: any) {
        if (this._databaseMock.hasOwnProperty(obj.name))
            return this._databaseMock[obj.name];

        this._databaseMock[obj.name] = [];
        return [];
    }

    save(obj: any) {

        if (obj.hasOwnProperty('email'))
            this._databaseMock['UserEntity'].push(obj);

        if (obj.hasOwnProperty('codename'))
            this._databaseMock['ProductEntity'].push(obj);
    }

    findOne(obj: any, params: any) {

        if (Object.keys(params).length === 1) {

            const key = Object.keys(params)[0];
            const value = params[key];

            return this._databaseMock[obj.name].find((item: { [x: string]: any; }) => item[key] === value);
        }

        return {};
    }

    deleteOne(obj: any, params: object) {
        return false;
    }
}

export class ConnectionMock {
    public mongoManager: MongoManagerMock
    public isConnected: boolean
    constructor() {
        this.mongoManager = new MongoManagerMock();
        this.isConnected = true
    }
}