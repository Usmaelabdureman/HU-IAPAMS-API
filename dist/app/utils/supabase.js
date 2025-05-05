"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = __importDefault(require("../config"));
const supabaseUrl = config_1.default.supabase_url;
const supabaseKey = config_1.default.supabase_anon_key;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
