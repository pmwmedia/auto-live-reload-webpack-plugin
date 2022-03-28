import {readFileSync, rmSync} from "fs";
import path from "path";
import {mkdirSync} from "temp";
import {Compiler, webpack} from "webpack";

import LiveReloadPlugin from "./index";

describe("webpack plugin", () => {
    let directory: string;

    beforeEach(() => {
        directory = mkdirSync();
    });

    afterEach(() => {
        rmSync(directory, { recursive: true });
    });

    test("should generate default client", async () => {
        const plugin = new LiveReloadPlugin();
        const targetFile = await compile(plugin);
        expect(readFileSync(targetFile).toString()).toMatch(/localhost:[1-9]\d?/);
    });

    test("should generate disabled client", async () => {
        const plugin = new LiveReloadPlugin({enabled: false});
        const targetFile = await compile(plugin);
        expect(readFileSync(targetFile).toString()).toBe("");
    });

    test("should generate enabled client", async () => {
        const plugin = new LiveReloadPlugin({enabled: true});
        const targetFile = await compile(plugin);
        expect(readFileSync(targetFile).toString()).toMatch(/localhost:[1-9]\d?/);
    });

    test("should generate enabled client with custom host", async () => {
        const plugin = new LiveReloadPlugin({host: "foo.bar"});
        const targetFile = await compile(plugin);
        expect(readFileSync(targetFile).toString()).toMatch(/foo.bar:[1-9]\d?/);
    });

    test("should generate enabled client with custom host", async () => {
        const plugin = new LiveReloadPlugin({port: 4242});
        const targetFile = await compile(plugin);
        expect(readFileSync(targetFile).toString()).toMatch(/localhost:4242/);
    });

    function compile(plugin: LiveReloadPlugin): Promise<string> {
        return new Promise((resolve, reject) => {
            const compiler = webpack({
                entry: plugin.clientEntryFile(),
                plugins: [plugin],
                output: {
                    filename: "target.js",
                    path: directory,
                }
            });

            compiler.run((error, stats) => {
                if (error) {
                    close(compiler);
                    return reject(error);
                } else if (stats?.hasErrors()) {
                    close(compiler);
                    return reject(stats.toString("errors-only"));
                } else {
                    const targetPath = path.resolve(directory, "target.js");
                    close(compiler);
                    return resolve(targetPath);
                }
            });
        });
    }

    function close(compiler: Compiler) {
        compiler.close(() => { /* Nothing to do */ });
    }
});
