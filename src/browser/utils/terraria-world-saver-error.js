export default function TerrariaWorldSaverError(msg, err) {
    err.onlyMessage = err.message;
    err.onlyFriendlyMessage = msg;
    err.onlyName = err.name;
    err.message = msg + ":\n" + err.name + ": " + err.message;
    err.name = "TerrariaWorldSaverError";
    return err;
}