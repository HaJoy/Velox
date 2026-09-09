

export type ipifyResponse = {
    ip: string;
};

export type continent = {
    code: string;
    name: string;
};

export type ispinfo = {
    org: string;
    country: string;
    countryCode: string;
    continent: continent;
};

export type ipinfoResponse = {
    message: string;
    ispinfo: ispinfo;
};