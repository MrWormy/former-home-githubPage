if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/public/sw.js', { scope: '/' })
        .then(function (reg) {
            // registration worked
            console.log('SW Registration succeeded. Scope is ' + reg.scope);
        }).catch(function (error) {
        // registration failed
        console.log('SW Registration failed with ' + error);
    });
}
