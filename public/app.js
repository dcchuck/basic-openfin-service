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

    document.title = `App UUID: ${fin.desktop.Application.getCurrent().uuid}`;
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

makeCounter().then(s => {
    s.getValue().then(x => ticker.innerText = x );
    serviceConnection = s;
});

inc.onclick = () => {
	const incrementer = document.getElementById('increment-by');
	if (incrementer.value) {
		serviceConnection.incrementBy(parseInt(incrementer.value)).then(x => {
			const updateDiv = document.getElementById('last-update');
			updateDiv.innerText = `I Incremeneted To ${x}`;
		})

	} else {
		serviceConnection.increment().then(x => {
			console.log(x)
			const updateDiv = document.getElementById('last-update');
			updateDiv.innerText = `I Incremeneted To ${x}`;
		})
	}
}
