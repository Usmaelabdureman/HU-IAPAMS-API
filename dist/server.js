"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const db_1 = __importDefault(require("./app/utils/db"));
const port = config_1.default.port || 9000;
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            server = app_1.default.listen(port, () => {
                console.log(`Server is running on port ${port}`);
                console.log(`Swagger docs at http://localhost:${port}/api-docs`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
process.on('unhandledRejection', () => {
    console.log('Unhandled rejection detected. shutting down...');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log('Uncaught exception detected. shutting down...');
    process.exit(1);
});
main();
