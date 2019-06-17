import runtime from 'serviceworker-webpack-plugin/lib/runtime';

export default function registerServiceWorker () {
    if ('serviceWorker' in navigator) {
        runtime.register();
    }
}
