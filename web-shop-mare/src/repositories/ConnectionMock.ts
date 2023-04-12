
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
            this._save(obj, 'UserEntity');

        if (obj.hasOwnProperty('codename'))
            this._save(obj, 'ProductEntity');
    }

    _save(obj: any, entityType: string) {
        if (entityType === 'UserEntity') {
            // @ts-ignore
            let user = this._databaseMock['UserEntity'].find(item => item['email'] === obj['email'])
            if (user) {
                user = obj;
            } else {
                this._databaseMock['UserEntity'].push(obj);
            }
        }

        if (entityType === 'ProductEntity') {
            // @ts-ignore
            let user = this._databaseMock['ProductEntity'].find(item => item['codename'] === obj['codename'])
            if (user) {
                user = obj;
            } else {
                this._databaseMock['ProductEntity'].push(obj);
            }
        }
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
        if (Object.keys(params).length === 1) {

            const key = Object.keys(params)[0];
            // @ts-ignore
            const value = params[key];

            this._databaseMock[obj.name] =
                this._databaseMock[obj.name].filter((item: { [x: string]: any; }) => item[key] !== value);
            return true;
        }

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