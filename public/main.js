/* global fin */
document.addEventListener('DOMContentLoaded', () => {
    const ofVersion = document.getElementById('no-openfin');
    if (typeof fin !== 'undefined') {
        init();
    } else {
        ofVersion.innerText = 'OpenFin is not available - you are probably running in a browser.';
    }
});

function init () {
    fin.desktop.System.getVersion(version => {
        console.log(version);
    });

    const serviceProvider = new fin.desktop.Application({
        name: 'service',
        uuid: 'service',
        url: 'http://localhost:3000/provider.html',
        mainWindowOptions: {
            autoShow: true
        }
    }, () => serviceProvider.run(
    ))
}

let serviceConnection;

const ticker = document.getElementById('ticker');

async function makeCounter () {
    const serviceClient = await fin.desktop.Service.connect({uuid:'service'});
    serviceClient.onServiceDisconnect(service=>console.log('Service disconnected!', service));
    serviceClient.register('valueUpdated', (x) => ticker.innerText = x);
    return {
        increment: () => serviceClient.dispatch('increment'),
        incrementBy: (x) => serviceClient.dispatch('incrementBy', {amount: x}),
        getValue: () => serviceClient.dispatch('getValue')
    }
}

const inc = document.getElementById('increment');

makeCounter().then(counter => counter.getValue().then(x => ticker.innerText = x));

inc.onclick = () => {
    makeCounter().then(counter => counter.increment().then(x => console.log(x)));
}

const launcher = document.getElementById('launcher');

launcher.onclick = () => {
    let newApp = new fin.desktop.Application({
        name: Math.random().toString(),
        url: 'http://localhost:3000/app.html',
        uuid: Math.random().toString(),
        mainWindowOptions: {
            autoShow: true,
            defaultHeight: 300,
            defaultWidth: 475,
            saveWindowState: false
        }
    }, () => {
        newApp.run();
    })
}