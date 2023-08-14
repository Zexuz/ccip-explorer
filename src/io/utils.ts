import * as fs from "fs";
import {dirname, join} from "path";
import * as path from "path";

const getAppRoot = () => {
    // @ts-ignore
    return join(dirname(require.main.filename), "..");
}

const createFilePath = (name: string) => {
    return `${getAppRoot()}/${name}`;
}

export const getOrThrowEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing env variable: ${key}`);
    }
    return value;
}

export const saveToFile = async (path: string, data: string) => {
    const filePath = createFilePath(path)

    //Check if directory exists
    const dir = dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            }
            resolve(filePath);
        });
    });
}


export const readFromFile = async (name: string) => {
    const filePath = createFilePath(name);
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data.toString());
        });
    });
}

export const listDirs = (rootDir: string): string[] => {
    const dirPath = createFilePath(rootDir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
        throw new Error('Invalid directory path');
    }

    // Get all items in the directory and filter out items that aren't directories
    return fs.readdirSync(dirPath).filter(item => {
        const fullPath = path.join(dirPath, item);
        return fs.statSync(fullPath).isDirectory();
    });
};
