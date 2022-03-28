import {mkdirSync, readFileSync, writeFileSync} from "fs";
import {createServer, Server} from "http";
import {AddressInfo} from "net";
import {resolve} from "path";
import {cleanupSync, OpenFile, openSync} from "temp";
import {Compiler, WebpackPluginInstance} from "webpack";
import {WebSocketServer} from "ws";

type Options = { host?: string, port?: number, enabled?: boolean }

class LiveReloadPlugin implements WebpackPluginInstance {
    private readonly clientFile: OpenFile;
    private readonly httpServer: Server | null;
    private readonly webSocketServer: WebSocketServer | null;

    constructor(options: Options) {
        const tempDirectory = resolve(__dirname, "..", "tmp");
        mkdirSync(tempDirectory, {recursive: true});
        this.clientFile = openSync({dir: tempDirectory, prefix: "client-", suffix: ".js"});

        if (options.enabled === false) {
            this.httpServer = null;
            this.webSocketServer = null;

            const sourceFilePath = resolve(__dirname, "client-disabled.js");
            writeFileSync(this.clientFile.fd, readFileSync(sourceFilePath));
        } else {
            const host = options.host === undefined ? "localhost" : options.host;
            const port = options.port === undefined ? 0 : options.port;

            this.httpServer = createServer().listen(port);
            this.webSocketServer = new WebSocketServer({server: this.httpServer});

            const httpAddress = this.httpServer.address() as AddressInfo;
            const sourceFilePath = resolve(__dirname, "client-enabled.js");
            let sourceContent = readFileSync(sourceFilePath).toString();
            sourceContent = sourceContent.replaceAll("HOST", host);
            sourceContent = sourceContent.replaceAll("PORT", httpAddress.port.toString());
            writeFileSync(this.clientFile.fd, sourceContent);
        }
    }

    clientEntryFile(): string {
        return this.clientFile.path;
    }

    apply(compiler: Compiler): void {
        compiler.hooks.done.tap("LiveReloadPlugin", () => {
            this.webSocketServer?.clients.forEach(socket => socket.send("RELOAD"));
        });

        compiler.hooks.shutdown.tap("LiveReloadPlugin", () => {
            this.webSocketServer?.close();
            this.httpServer?.close()
            cleanupSync();
        });
    }
}

export = LiveReloadPlugin;
